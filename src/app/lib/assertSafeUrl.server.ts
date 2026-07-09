import dns from "node:dns/promises";
import { isPrivateOrReservedIp } from "@/app/lib/validateUrl";

export async function resolvePublicIp(
  hostname: string,
): Promise<string | null> {
  try {
    // Get the site's real DNS to avoid attacks on server side and check that in the validateUrl
    const records = await dns.lookup(hostname, { all: true });
    const allPublic = records.every((r) => !isPrivateOrReservedIp(r.address));
    if (!allPublic || records.length === 0) return null;
    return records[0].address;
  } catch {
    return null;
  }
}
