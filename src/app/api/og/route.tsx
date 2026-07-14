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
        background: "linear-gradient(160deg, #EBF1F3 0%, #F9FAFB 60%)",
        position: "relative",
      }}
    >
      {/* top accent bar */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "8px",
          background: scoreColor,
        }}
      />

      {/* main content: white "card" floating on the gradient */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: "28px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#FFFFFF",
            borderRadius: "28px",
            padding: "36px 64px",
            boxShadow: "0 20px 40px rgba(23,23,23,0.10)",
            border: "1px solid #ECECEC",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Vex Winking"
            src={logo}
            width={110}
            height={88}
            style={{ display: "flex" }}
          />

          {/* domain chip */}
          <div
            style={{
              display: "flex",
              background: "#EBF1F3",
              color: "#367E96",
              borderRadius: "999px",
              padding: "6px 18px",
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: "18px",
              margin: "10px 0 0 0",
            }}
          >
            {domain}
          </div>

          <h3
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              margin: "14px 0 0 0",
              fontSize: "42px",
              color: "#171717",
            }}
          >
            Vex&apos;s Verdict
          </h3>

          <p
            style={{
              color: "#565252",
              fontFamily: "Inter",
              fontWeight: 500,
              margin: "10px 0 0 0",
              fontSize: "22px",
              textAlign: "center",
              lineHeight: 1.3,
              maxWidth: "760px",
            }}
          >
            &quot;{overviewData.quote}&quot;
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: "22px 0 0 0",
            }}
          >
            <p
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                background: scoreColor,
                color: "#F9FAFB",
                borderRadius: "999px",
                padding: "18px 32px",
                fontSize: "50px",
                margin: "0",
                boxShadow: `0 10px 24px ${scoreColor}55`,
              }}
            >
              {overviewScore}
            </p>
            <p
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                margin: "8px 0 0 0",
                fontSize: "16px",
                color: "#171717",
              }}
            >
              OVERALL
            </p>
            <p
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                margin: "0",
                fontSize: "16px",
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
              gap: "22px",
              margin: "20px 0 0 0",
            }}
          >
            {Fields.map(({ category, score }) => {
              const badgeColor =
                (score ?? 0) >= 7
                  ? "#367E96"
                  : (score ?? 0) >= 4
                    ? "#D97706"
                    : "#DC2626";
              return (
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
                      padding: "8px 16px",
                      background: badgeColor,
                      color: "#F9FAFB",
                      fontSize: "20px",
                      margin: "0",
                    }}
                  >
                    {score}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 500,
                      fontSize: "13px",
                      margin: "6px 0 0 0",
                      color: "#565252",
                    }}
                  >
                    {category}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA footer with button-style pill */}
      <div
        style={{
          display: "flex",
          width: "100%",
          background: "#171717",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#F9FAFB",
            color: "#171717",
            borderRadius: "999px",
            padding: "10px 28px",
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          Roast Your Own Site →
        </div>
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
