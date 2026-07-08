export function isPrivateOrReservedIp(hostname: string): boolean {
  // IPv4 dotted-decimal
  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [parseInt(ipv4[1], 10), parseInt(ipv4[2], 10)];
    if (a === 127) return true; // loopback
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // link-local + metadata
    if (a === 0) return true; // 0.0.0.0/8
    if (hostname === "100.100.100.200") return true;
    return false;
  }

  // IPv6 loopback / unique-local / link-local, plus IPv4-mapped IPv6
  if (hostname === "::1") return true;
  if (hostname.startsWith("::ffff:")) {
    return isPrivateOrReservedIp(hostname.replace("::ffff:", ""));
  }
  if (/^fc[0-9a-f]{2}:|^fd[0-9a-f]{2}:/i.test(hostname)) return true; // fc00::/7
  if (/^fe[89ab][0-9a-f]:/i.test(hostname)) return true; // fe80::/10

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

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
      return null;

    const hostname = parsed.hostname.toLowerCase();

    if (hostname === "localhost" || hostname.endsWith(".local")) return null;
    if (BLOCKED_HOSTNAMES.has(hostname)) return null;

    if (isPrivateOrReservedIp(hostname)) return null;

    const isIp = /^[\d.]+$/.test(hostname) || hostname.includes(":");
    if (isIp) {
      if (isPrivateOrReservedIp(hostname)) return null;
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
