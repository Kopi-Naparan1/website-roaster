import SectionLayout from "@/components/ui/Section";
import { RoastDataType } from "./RoastBreakDown";

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
  return (
    <div className="flex flex-col justify-center items-center mt-4">
      <button className="rounded-full py-2 px-3.5 bg-foreground/60 text-background font-semibold text-2xl md:text-3xl lg:text-4xl  shadow-sm hover:shadow-md hover:scale-105 ease-in-out transition-all duration-75 cursor-pointer">
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

  return (
    <SectionLayout
      headingUrl={headingUrl}
      headingAndSubHeadingClassName="text-center flex flex-col justify-center items-center"
      sectionType={sectionType}
      className="flex flex-col"
      childrenClassName="flex flex-col flex-1  "
      heading={heading}
    >
      <div className={` flex flex-col justify-center items-center flex-1`}>
        <div className="flex flex-col justify-center items-center mb-6 md:mb-8">
          <button className="rounded-full py-4 px-6 md:py-6 lg:py-8 md:px-8   shadow-sm hover:shadow-md hover:scale-105 ease-in-out transition-all duration-75 cursor-pointer bg-foreground/80 text-background font-semibold text-6xl md:text-5xl lg:text-6xl">
            {overviewScore}
          </button>
          <p className="text-lg mt-1 font-semibold">OVERALL</p>
          <p className=" text-xs md:text-sm font-medium text-foreground/50 truncate">
            {overviewData.tier}
          </p>
        </div>
        <div className="flex flex-row gap-6 md:gap-8 lg:gap-10 max-w-3xl w-full mx-auto  justify-center items-center">
          {Fields.map(({ category, score }) => (
            <OverViewCard
              key={category}
              category={category}
              score={score}
            ></OverViewCard>
          ))}
        </div>
      </div>

      {overviewData.quote && (
        <blockquote className="pt-6 px-12 mt-auto   text-center italic text-sm md:text-md font-heading text-foreground/80">
          “{overviewData.quote}”
        </blockquote>
      )}
    </SectionLayout>
  );
}
