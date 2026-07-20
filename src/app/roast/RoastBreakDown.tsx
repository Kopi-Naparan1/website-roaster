"use client";

import SectionLayout from "@/components/ui/Section";
import { useState } from "react";

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
interface RoastBreakDownProps {
  roast: RoastDataType;
  sectionType: "roastBreakDown";
  heading: string;
  subHeading?: string;
}

function CategoryCard({
  title,
  data,
  score,
  isDimmed,
  onHover,
  onLeave,
}: {
  title: string;
  data: CategoryResult;
  score: number;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const cardInfo: { heading: string; description: string }[] = [
    { heading: "Comment", description: data.comment },
    { heading: "Evidence", description: data.evidence },
    { heading: "Strength", description: data.strength },
    { heading: "Tip", description: data.tip },
    { heading: "To put it simply", description: data.quote },
  ];

  return (
    <div
      id={title.toLocaleLowerCase()}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`flex flex-col gap-2 border rounded-sm p-2 md:p-4 min-h-full transition-all duration-75 hover:bg-brand-100 dark:hover:bg-brand-800 shadow-sm hover:shadow-md ${
        isDimmed ? "opacity-30 blur-xs dark:opacity-40 " : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-heading font-semibold leading-snug tracking-tight uppercase text-lg lg:text-xl">
          {title}
        </h3>
        <span className="text-lg lg:text-xl tracking-tight leading-snug font-semibold">
          {score}/10
        </span>
      </div>
      <div className="flex flex-col gap-6">
        {cardInfo.map((info) => (
          <div key={info.heading} className="flex flex-col">
            <h5 className="text-foreground/50 text-sm lg:text-md">
              {info.heading}
            </h5>
            <p className="pl-2 mt-0.5 text-sm md:text-lg">{info.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoastBreakDown({
  roast,
  sectionType,
  heading,
}: RoastBreakDownProps) {
  const categories: { title: string; data: CategoryResult; score: number }[] = [
    { title: "Clarity", data: roast.clarity, score: roast.clarity.score },
    { title: "Copy", data: roast.copy, score: roast.copy.score },
    { title: "CTA", data: roast.cta, score: roast.cta.score },
    { title: "Trust", data: roast.trust, score: roast.trust.score },
    { title: "Mobile", data: roast.mobile, score: roast.mobile.score },
    { title: "Overall", data: roast.overall, score: roast.overall.score },
  ];
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const overallScore = Math.round(
    categories
      .filter((c) => c.title !== "Overall")
      .reduce((sum, field) => sum + (field.score ?? 0), 0) / 5,
  );

  return (
    <SectionLayout
      className="bg-background-alt"
      sectionType={sectionType}
      heading={heading}
      headingAndSubHeadingClassName="flex flex-col text-center justify-center items-center"
      childrenClassName="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-11 lg:gap-12 flex-1"
    >
      {categories.map(({ title, data, score }) => (
        <CategoryCard
          key={title}
          title={title}
          data={data}
          score={title === "Overall" ? overallScore : score}
          isDimmed={hoveredTitle !== null && hoveredTitle !== title}
          onHover={() => setHoveredTitle(title)}
          onLeave={() => setHoveredTitle(null)}
        ></CategoryCard>
      ))}
    </SectionLayout>
  );
}
