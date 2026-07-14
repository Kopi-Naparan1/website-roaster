import { ImageResponse } from "next/og";
import { Redis } from "@upstash/redis";
import fs from "node:fs/promises";
import path from "node:path";

type CategoryResult = {
  score: number;
  comment: string;
  evidence: string;
  strength: string;
  tip: string;
  quote: string;
  topPriority?: string;
  tier?: string;
};

export type RoastDataType = {
  clarity: CategoryResult;
  copy: CategoryResult;
  cta: CategoryResult;
  trust: CategoryResult;
  mobile: CategoryResult;
  overall: CategoryResult;
};

interface CategoryFieldProps {
  category: string;
  score?: number;
}

export const runtime = "nodejs";

// Cache in module scope — read once, reused across requests
let logoBase64: string | null = null;
async function getLogo() {
  if (!logoBase64) {
    const logoPath = path.join(process.cwd(), "public", "wink.png");
    const buffer = await fs.readFile(logoPath);
    logoBase64 = `data:image/png;base64,${buffer.toString("base64")}`;
  }
  return logoBase64;
}

const spaceGrotesk = await fs.readFile(
  path.join(
    process.cwd(),
    "src",
    "assets",
    "Space_Grotesk",
    "static",
    "SpaceGrotesk-Bold.ttf",
  ),
);

const inter = await fs.readFile(
  path.join(
    process.cwd(),
    "src",
    "assets",
    "Inter",
    "static",
    "Inter_18pt-Medium.ttf",
  ),
);

const redis = Redis.fromEnv();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const record = await redis.get<{ domain: string; roast: RoastDataType }>(
    `roast:${id}`,
  );

  if (!record) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#F9FAFB",
        }}
      />,
      { width: 1200, height: 630 },
    );
  }

  const { domain, roast } = record;

  const Fields: CategoryFieldProps[] = [
    { category: "Clarity", score: roast.clarity.score },
    { category: "Copy", score: roast.copy.score },
    { category: "CTA", score: roast.cta.score },
    { category: "Trust", score: roast.trust.score },
    { category: "Mobile", score: roast.mobile.score },
  ];
  const overviewData = roast.overall;

  const overviewScore = Math.round(
    Fields.reduce((sum, field) => sum + (field.score ?? 0), 0) / Fields.length,
  );

  const scoreColor =
    overviewScore >= 7 ? "#367E96" : overviewScore >= 4 ? "#D97706" : "#DC2626";

  const logo = await getLogo();

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#F9FAFB",
        justifyContent: "center",
        alignItems: "center",
        padding: "50px 80px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Vex Winking"
        src={logo}
        width={220}
        height={176}
        style={{ display: "flex" }}
      />

      <p
        style={{
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: "32px",
          color: "#367E96",
          margin: "8px 0 0 0",
        }}
      >
        {domain}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "24px 0 0 0",
          maxWidth: "880px",
        }}
      >
        <h3
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            margin: "0",
            fontSize: "56px",
          }}
        >
          Vex&apos;s Verdict
        </h3>
        <p
          style={{
            color: "#565252",
            fontFamily: "Inter",
            fontWeight: 500,
            margin: "16px 0 0 0",
            fontSize: "30px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          &quot;{overviewData.quote}&quot;
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "32px 0 0 0",
        }}
      >
        <p
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            background: scoreColor,
            color: "#F9FAFB",
            borderRadius: "999px",
            padding: "28px 50px",
            fontSize: "76px",
            margin: "0",
          }}
        >
          {overviewScore}
        </p>
        <p
          style={{
            fontFamily: "Inter",
            fontWeight: 500,
            margin: "14px 0 0 0",
            fontSize: "24px",
          }}
        >
          OVERALL
        </p>
        <p
          style={{
            fontFamily: "Inter",
            fontWeight: 500,
            margin: "0",
            fontSize: "24px",
            color: "#565252",
          }}
        >
          {overviewData.tier}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          margin: "32px 0 0 0",
        }}
      >
        {Fields.map(({ category, score }) => (
          <div
            key={category}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                borderRadius: "999px",
                padding: "14px 24px",
                background: "#565252",
                color: "#eff6f8",
                fontSize: "32px",
                margin: "0",
              }}
            >
              {score}
            </p>
            <p
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "18px",
                margin: "10px 0 0 0",
                color: "#565252",
              }}
            >
              {category}
            </p>
          </div>
        ))}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Space Grotesk",
          data: spaceGrotesk,
          weight: 700,
          style: "normal",
        },
        { name: "Inter", data: inter, weight: 500, style: "normal" },
      ],
    },
  );
}
