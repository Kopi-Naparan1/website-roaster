import { ImageResponse } from "next/og";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

const redis = Redis.fromEnv();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const record = await redis.get<{
    roast: { overall: { score: number; tier: string } };
    domain: string;
  }>(`roast:${id}`);

  if (!record) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#F9FAFB",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
        }}
      ></div>,
      { width: 1200, height: 640 },
    );
  }

  const { domain, roast } = record;
  const { score, tier } = roast.overall;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#F9FAFB",
        color: "#171717",
        padding: 60,
        fontFamily: "Inter",
      }}
    >
      {" "}
      <div style={{ fontSize: 32, color: "#367E96" }}>Website Roaster</div>
      <div style={{ fontSize: 56, marginTop: 20 }}>{domain}</div>
      <div style={{ display: "flex", alignItems: "baseline", marginTop: 40 }}>
        <div style={{ fontSize: 120, fontWeight: 700 }}>{score}</div>
        <div style={{ fontSize: 40, marginLeft: 12 }}>/10</div>
      </div>
      <div style={{ fontSize: 36, marginTop: 20 }}>{tier}</div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, immutable, no-transform, max-age=31536000",
      },
    },
  );
}
