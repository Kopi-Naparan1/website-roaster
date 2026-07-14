import { redis } from "@/app/lib/redis";
import { ComponentType } from "react";

import { notFound } from "next/navigation";
import Overview from "../../roast/Overview";
import RoastBreakDown, { RoastDataType } from "@/app/roast/RoastBreakDown";
import ReRoast from "@/app/roast/ReRoast";
import { AllSectionData, AllSectionDataInterface } from "@/data/AllSections";
import { SharedSectionOverrides } from "@/data/SharedSectionOverrides";
import type { Metadata } from "next";

interface Section {
  sectionID: string;
  Component: ComponentType<AllSectionDataInterface>;
}

const sections: Section[] = [
  {
    sectionID: "overviewResultPage",
    Component: Overview as ComponentType<AllSectionDataInterface>,
  },
  {
    sectionID: "roastBreakDown",
    Component: RoastBreakDown as ComponentType<AllSectionDataInterface>,
  },
  {
    sectionID: "reroast",
    Component: ReRoast as ComponentType<AllSectionDataInterface>,
  },
];

type RoastRecord = {
  roast: RoastDataType;
  url: string;
  domain: string;
  createdAt: number;
};

async function getRecord(shareID: string) {
  return redis.get<RoastRecord>(`roast:${shareID}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareID: string }>;
}): Promise<Metadata> {
  const { shareID } = await params;
  const record = await getRecord(shareID);
  if (!record) return { title: "Roast expired — Website Roaster" };

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "website-roaster-weld.vercel.app";
  const ogUrl = `${baseUrl}/api/og?id=${shareID}`;
  const title = `${record.domain} scored ${record.roast.overall.score}/10 — Website Roaster`;
  const description = `Vex roasted ${record.domain} and gave it a ${record.roast.overall.score}/10. See the full breakdown.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      siteName: "Website Roaster",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function SharedRoastPage({
  params,
}: {
  params: Promise<{ shareID: string }>;
}) {
  const { shareID } = await params;
  const record = await getRecord(shareID);

  return (
    <div>
      <p>shareID: {shareID}</p>
      <p>record found: {record ? "YES" : "NO"}</p>
      <pre>{JSON.stringify(record, null, 2)}</pre>
    </div>
  );

  // if (!record) {
  //   notFound();
  // }

  // const { roast, url } = record;
  // const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  // return (
  //   <div className="flex flex-col flex-1 gap-6">
  //     {sections.map(({ sectionID, Component }) => {
  //       const base = AllSectionData.find((i) => i.sectionType === sectionID);
  //       if (!base) return null;

  //       const override = SharedSectionOverrides[sectionID];
  //       const data = override ? { ...base, ...override } : base;

  //       return (
  //         <Component
  //           key={sectionID}
  //           isResultPage={data.sectionType === "reroast" ? true : false}
  //           roast={roast}
  //           heading={data.heading}
  //           subHeading={data.subHeading}
  //           headingUrl={displayUrl}
  //           sectionType={data.sectionType}
  //         />
  //       );
  //     })}
  //   </div>
  // );
}
