"use client";

import Image from "next/image";
import SectionLayout from "@/components/ui/Section";
import { RoastDataType } from "./RoastBreakDown";
import VexOverview from "../../../public/vex/vex-overview.webp";
import Link from "next/link";

interface OverviewProps {
  roast: RoastDataType;
  sectionType: "overviewResultPage";
  heading: string;
  subHeading?: string;
  headingUrl?: string;
  isShareIdExpired?: boolean;
}

interface CategoryFieldProps {
  category: string;
  score?: number;
}

function OverViewCard({ category, score }: CategoryFieldProps) {
  const scrollToCategory = () => {
    document
      .getElementById(category.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <div className="flex flex-col justify-center items-center mt-4">
      <button
        onClick={scrollToCategory}
        className="rounded-full py-2 px-3.5 bg-foreground/60 text-background font-semibold text-2xl md:text-3xl lg:text-4xl  shadow-sm hover:shadow-md hover:scale-105 ease-in-out transition-all duration-75 cursor-pointer"
      >
        {score}
      </button>
      <p className="uppercase text-xs mt-1 md:text-sm font-medium text-foreground/70 font-sans">
        {category}
      </p>
    </div>
  );
}

export default function Overview({
  roast,
  sectionType,
  heading,
  headingUrl,
}: OverviewProps) {
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

  const OverallScrollToCategory = () => {
    document
      .getElementById("overall")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <SectionLayout
      headingUrl={headingUrl}
      headingAndSubHeadingClassName="text-center flex flex-col justify-center items-center"
      sectionType={sectionType}
      className="flex flex-col  "
      childrenClassName="flex flex-col flex-1  "
      heading={heading}
    >
      <div className="flex flex-col justify-start items-center md:justify-center md:flex-1 mt-24 ">
        {/* score + image, side by side */}
        <div className="flex flex-row items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8 relative">
          <div className="flex flex-col justify-center items-center">
            <button
              onClick={OverallScrollToCategory}
              className="rounded-full py-4 px-6 md:py-6 lg:py-8 md:px-8 shadow-sm hover:shadow-md hover:scale-105 ease-in-out transition-all duration-75 cursor-pointer bg-foreground/80 text-background font-semibold text-6xl md:text-5xl lg:text-6xl"
            >
              {overviewScore}
            </button>
            <p className="text-lg mt-1 font-semibold">OVERALL</p>
            <p className="text-xs md:text-sm font-medium text-foreground/50 truncate">
              {overviewData.tier}
            </p>
          </div>

          <div className="absolute left-full top-1/2 -translate-y-1/2  ml-2 w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 pointer-events-none ">
            <Image
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className="object-contain"
              src={VexOverview}
              alt=""
              fill
            />
          </div>
        </div>

        <div className="flex flex-row gap-6 md:gap-8 lg:gap-10 max-w-3xl w-full mx-auto justify-center items-center">
          {Fields.map(({ category, score }) => (
            <OverViewCard key={category} category={category} score={score} />
          ))}
        </div>
      </div>

      {overviewData.quote && (
        <blockquote className="md:pt-6 pt-0 mt-[20vh] px-12   md:mt-auto md:px-14 lg:px-40   text-center italic text-sm md:text-md font-heading text-foreground/80">
          “{overviewData.quote}”
        </blockquote>
      )}
    </SectionLayout>
  );
}
