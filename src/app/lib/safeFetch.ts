// app/lib/safeFetch.ts
import { Agent, fetch as undiciFetch } from "undici";

function createPinnedAgent(pinnedIp: string) {
  return new Agent({
    connect: {
      lookup: (_hostname, _options, callback) => {
        // Ignore whatever hostname undici asks to resolve — always hand back
        // the IP we already validated, so no second/independent DNS lookup happens.
        callback(null, [
          { address: pinnedIp, family: pinnedIp.includes(":") ? 6 : 4 },
        ]);
      },
    },
  });
}

export function fetchPinned(
  url: URL,
  pinnedIp: string,
  init: {
    headers?: Record<string, string>;
    signal?: AbortSignal;
    redirect?: "manual" | "follow" | "error";
  } = {},
): Promise<Response> {
  // Prevents DNS binding: re-resolving DNS can flip to private IP if the correct IP is not pinned
  const agent = createPinnedAgent(pinnedIp);
  return undiciFetch(url.toString(), {
    ...init,
    dispatcher: agent,
  }) as unknown as Promise<Response>;
}
