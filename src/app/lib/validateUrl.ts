export function isPrivateOrReservedIp(hostname: string): boolean {
  // --- IPv4 ---

  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const octets = [ipv4[1], ipv4[2], ipv4[3], ipv4[4]].map((o) =>
      parseInt(o, 10),
    );
    // Reject malformed octets (e.g. "999") rather than silently falling through as "safe"
    if (octets.some((o) => o > 255)) return true;

    const [a, b] = octets;

    if (a === 0) return true; // 0.0.0.0/8 "this network"
    if (a === 127) return true; // 127.0.0.0/8 loopback
    if (a === 10) return true; // 10.0.0.0/8 private
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 private
    if (a === 192 && b === 168) return true; // 192.168.0.0/16 private
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local (covers cloud metadata IPs)
    if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT
    if (a === 192 && b === 0 && octets[2] === 0) return true; // 192.0.0.0/24 IETF protocol assignments
    if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15 benchmarking
    if (a >= 224 && a <= 239) return true; // 224.0.0.0/4 multicast
    if (a >= 240) return true; // 240.0.0.0/4 reserved, incl. 255.255.255.255 broadcast
    if (hostname === "100.100.100.200") return true; // Alibaba Cloud metadata (falls in CGNAT range too, kept explicit for clarity)

    return false;
  }

  // --- IPv6 ---

  const lower = hostname.toLowerCase();

  if (lower === "::") return true; // unspecified address
  if (lower === "::1") return true; // loopback

  // IPv4-mapped IPv6 (::ffff:a.b.c.d) — unwrap and recheck the embedded IPv4
  if (lower.startsWith("::ffff:") && lower.includes(".")) {
    return isPrivateOrReservedIp(lower.replace("::ffff:", ""));
  }

  // NAT64 (64:ff9b::/96) — the IPv4 address is embedded in the low 32 bits.
  // This is a known SSRF bypass: e.g. 64:ff9b::a9fe:a9fe encodes 169.254.169.254.
  const nat64 = lower.match(/^64:ff9b::(.+)$/);
  if (nat64) {
    const embedded = nat64[1];
    let ipv4Str: string | null = null;

    if (embedded.includes(".")) {
      // Mixed notation, e.g. "64:ff9b::169.254.169.254"
      ipv4Str = embedded.split(":").pop() ?? null;
    } else {
      // Pure hex form: last two 16-bit groups are the IPv4 address' two halves
      const groups = embedded.split(":").filter(Boolean);
      const lastTwo = groups.slice(-2);
      if (lastTwo.length === 2) {
        const [g1, g2] = lastTwo.map((g) => parseInt(g, 16));
        ipv4Str = `${(g1 >> 8) & 0xff}.${g1 & 0xff}.${(g2 >> 8) & 0xff}.${g2 & 0xff}`;
      }
    }

    // If we can't confidently parse the embedded address, fail safe (treat as unsafe)
    return ipv4Str ? isPrivateOrReservedIp(ipv4Str) : true;
  }

  // 6to4 — embeds IPv4 directly after the 2002: prefix
  // e.g. 2002:a9fe:a9fe:: encodes 169.254.169.254
  const sixToFour = lower.match(/^2002:([0-9a-f]{1,4}):([0-9a-f]{1,4})/);
  if (sixToFour) {
    const [g1, g2] = [sixToFour[1], sixToFour[2]].map((g) => parseInt(g, 16));
    const ipv4Str = `${(g1 >> 8) & 0xff}.${g1 & 0xff}.${(g2 >> 8) & 0xff}.${g2 & 0xff}`;
    return isPrivateOrReservedIp(ipv4Str);
  }

  // For fc00::/7, fe80::/10, and ff00::/8: don't regex-match the string shape
  // (leading zeros can be compressed differently), instead parse the first
  // hex group as a number and check it against the actual bit range.
  const firstGroup = lower.split(":")[0];
  const groupVal = parseInt(firstGroup.padStart(4, "0"), 16);

  if (!isNaN(groupVal)) {
    if (groupVal >= 0xfc00 && groupVal <= 0xfdff) return true; // fc00::/7 unique local
    if (groupVal >= 0xfe80 && groupVal <= 0xfebf) return true; // fe80::/10 link-local
    if (groupVal >= 0xff00 && groupVal <= 0xffff) return true; // ff00::/8 multicast
  }

  return false;
}

function looksLikeDomain(hostname: string): boolean {
  // Must have at least one dot (a label + a TLD), e.g. "google.com" not "google"
  // IPv4/IPv6 are handled separately below, so this only gates plain hostnames.
  if (!hostname.includes(".")) return false;

  // Each label: letters/digits/hyphens, no leading/trailing hyphen, TLD letters-only
  const labelPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;
  const labels = hostname.split(".");
  const tld = labels[labels.length - 1];

  if (!/^[a-z]{2,}$/i.test(tld)) return false; // TLD must be alphabetic, 2+ chars
  return labels.every((label) => labelPattern.test(label));
}

const BLOCKED_HOSTNAMES = new Set([
  "metadata.google.internal",
  "metadata.internal",
]);

export function normalizeUrl(input: string): string | null {
  const trimmed = input?.trim();
  if (!trimmed) return null;

  // Testing whether the URL has https at the start. If yes, proceed, if not, add it then proceed.
  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    // Check whether the URL has http?s:
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
      return null;

    // Checks the URL
    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    if (hostname === "localhost" || hostname.endsWith(".local")) return null;
    if (BLOCKED_HOSTNAMES.has(hostname)) return null;

    const isIp = /^[\d.]+$/.test(hostname) || hostname.includes(":");
    if (isIp) {
      if (isPrivateOrReservedIp(hostname)) return null; // Check the IP: if it's private, then the roasting wont run.
    } else if (!looksLikeDomain(hostname)) {
      return null; // reject "askldjfajdf", "foo bar", etc.
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function isValidUrl(input: string): boolean {
  return normalizeUrl(input) !== null;
}
