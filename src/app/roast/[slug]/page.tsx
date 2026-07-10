import { redis } from "@/app/lib/redis";
import { ComponentType } from "react";
import { slugToKey } from "@/app/lib/slug";
import { notFound } from "next/navigation";
import Overview from "../Overview";
import RoastBreakDown, { RoastDataType } from "@/app/roast/RoastBreakDown";
import { AllSectionData, AllSectionDataInterface } from "@/data/AllSections";

interface Section {
  sectionID: string;
  Component: ComponentType<AllSectionDataInterface>;
}

const sections: Section[] = [
  {
    sectionID: "overview",
    Component: Overview as ComponentType<AllSectionDataInterface>,
  },
  {
    sectionID: "examples",
    Component: RoastBreakDown as ComponentType<AllSectionDataInterface>,
  },
];
export default async function RoastResultPage({
  params,
}: {
  params: { slug: string };
}) {
  const cacheKey = `roast:${slugToKey(params.slug)}`;
  const rawRoast = await redis.get(cacheKey);

  const { roast, url } = rawRoast as { roast: RoastDataType; url: string };

  if (!rawRoast) notFound();

  if (!roast) notFound();
  return (
    <div className="flex flex-col flex-1  ">
      {sections.map(({ sectionID, Component }) => {
        const data = AllSectionData.find(
          (i: AllSectionDataInterface) => i.sectionType === sectionID,
        );
        const newHeading = `${data?.heading} of ${url} `;

        if (!data) return null;
        return (
          <Component
            roast={roast}
            subHeading={data.subHeading}
            heading={`${data.sectionType === "overview" ? newHeading : data.heading}`}
            sectionType={data.sectionType}
            key={data.sectionType}
          />
        );
      })}
    </div>
  );
}
