import dns from "node:dns/promises";
import { isPrivateOrReservedIp } from "@/app/lib/validateUrl";

export async function assertPublicHostname(hostname: string): Promise<boolean> {
  try {
    const records = await dns.lookup(hostname, { all: true });
    return records.every((r) => !isPrivateOrReservedIp(r.address));
  } catch {
    // DNS resolution failed -- treat as unsafe rather than letting fetch() try anyway
    return false;
  }
}
