import { redis } from "@/app/lib/redis";
import { ComponentType } from "react";
import { slugToKey } from "@/app/lib/slug";
import Overview from "../Overview";
import ExpiredID from "../ExpiredID";
import Share from "../Share";
import RoastBreakDown, { RoastDataType } from "@/app/roast/RoastBreakDown";
import { AllSectionData, AllSectionDataInterface } from "@/data/AllSections";
import ReRoast from "../ReRoast";

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
  {
    sectionID: "reroast",
    Component: ReRoast as ComponentType<AllSectionDataInterface>,
  },
];

const ErrorSection: Section = {
  sectionID: "expiredID",
  Component: ExpiredID as ComponentType<AllSectionDataInterface>,
};

export default async function RoastResultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cacheKey = `roast:${slugToKey(slug)}`;
  const rawRoast = await redis.get(cacheKey);

  if (!rawRoast) {
    const displayUrl = slug.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return (
      <ErrorSection.Component
        heading={displayUrl}
        sectionType="expiredID"
      ></ErrorSection.Component>
    );
  }

  const { roast, url, shareId } = rawRoast as {
    roast: RoastDataType;
    url: string;
    shareId: string;
  };

  return (
    <div className="flex flex-col flex-1 gap-6 ">
      {shareId !== null &&
        sections.map(({ sectionID, Component }) => {
          const data = AllSectionData.find(
            (i: AllSectionDataInterface) => i.sectionType === sectionID,
          );
          const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

          if (!data) return null;

          return (
            <Component
              shareId={data.sectionType !== "share" ? "" : shareId}
              isResultPage={data.sectionType === "reroast" ? true : false}
              roast={roast}
              subHeading={data.subHeading}
              heading={data.heading}
              headingUrl={displayUrl}
              sectionType={data.sectionType}
              key={data.sectionType}
            />
          );
        })}
    </div>
  );
}
