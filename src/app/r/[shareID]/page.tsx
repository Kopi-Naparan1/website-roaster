import { redis } from "@/app/lib/redis";
import { ComponentType } from "react";
import { notFound } from "next/navigation";
import Overview from "../../roast/Overview";
import RoastBreakDown, { RoastDataType } from "@/app/roast/RoastBreakDown";
import Share from "../../roast/Share";
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
    sectionID: "share",
    Component: Share as ComponentType<AllSectionDataInterface>,
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

  const ogUrl = `https://yoursite.com/api/og?id=${shareID}`;
  return {
    title: `${record.domain} scored ${record.roast.overall.score}/10 — Website Roaster`,
    openGraph: { images: [ogUrl] },
    twitter: { card: "summary_large_image", images: [ogUrl] },
  };
}

export default async function SharedRoastPage({
  params,
}: {
  params: Promise<{ shareID: string }>;
}) {
  const { shareID } = await params;
  const record = await getRecord(shareID);

  if (!record) {
    notFound();
  }

  const { roast, url } = record;
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="flex flex-col flex-1 gap-6">
      {sections.map(({ sectionID, Component }) => {
        const base = AllSectionData.find((i) => i.sectionType === sectionID);
        if (!base) return null;

        const override = SharedSectionOverrides[sectionID];
        const data = override ? { ...base, ...override } : base;

        return (
          <Component
            key={sectionID}
            shareId={sectionID === "share" ? shareID : ""}
            roast={roast}
            heading={data.heading}
            subHeading={data.subHeading}
            headingUrl={displayUrl}
            sectionType={data.sectionType}
          />
        );
      })}
    </div>
  );
}
