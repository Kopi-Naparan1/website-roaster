import { ShareButton } from "@/components/ui/ShareButton";
import SectionLayout from "@/components/ui/Section";
import VexWink from "../../../public/vex/wink.webp";
import Image from "next/image";

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

interface ShareProps {
  roast: RoastDataType;
  sectionType: "share";
  heading: string;
  subHeading?: string;
  shareId: string;
}

interface CategoryFieldProps {
  category: string;
  score?: number;
}

function OverViewCard({ category, score }: CategoryFieldProps) {
  return (
    <div className="flex flex-col justify-center items-center mt-4 w-6">
      <p className="rounded-full py-2 px-2 bg-foreground/60 text-background font-semibold text-lg md:text-lg lg:text-xl  shadow-sm hover:shadow-md hover:scale-105 ease-in-out transition-all duration-75 ">
        {score}
      </p>
      <p className="lowercase text-xxs mt-1 md:text-xs font-medium text-foreground/70 font-sans">
        {category}
      </p>
    </div>
  );
}

export default function Share({
  roast,
  sectionType,
  subHeading,
  heading,
  shareId,
}: ShareProps) {
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
      sectionType={sectionType}
      heading={heading}
      className="flex flex-col justify-center items-center"
      subHeading={subHeading}
      childrenClassName="  flex flex-col w-[80vw] md:w-[35vw] lg:w-[40vw] flex-1 min-h-[60vh] "
      headingAndSubHeadingClassName="flex flex-col text-center justify-center items-center"
    >
      <div className="flex flex-col group justify-center items-center overflow-hidden border rounded-sm shadow-sm">
        <div className="group-hover:animate-bounce-small">
          <Image alt="Vex Winking" src={VexWink} />
        </div>
        <div className="flex flex-col justify-center items-center py-2">
          <h3 className="text-2xl font-bold">Vex&apos;s Verdict</h3>
          <p className="text-sm text-center px-2">
            &quot;{overviewData.quote}&quot;
          </p>
        </div>

        <div className="flex flex-col justify-center items-center my-4 md:mb-8">
          <p className="rounded-full py-2 px-3 md:py-2 lg:py-5 md:px-3    shadow-sm hover:shadow-md hover:scale-105 ease-in-out transition-all duration-75   bg-foreground/80 text-background font-semibold text-3xl md:text-2xl lg:text-3xl">
            {overviewScore}
          </p>
          <p className="text-sm mt-1 font-regular">OVERALL</p>
          <p className=" text-xs  font-medium text-foreground/50 truncate">
            {overviewData.tier}
          </p>
        </div>
        <div className="flex flex-row  mb-4 px-4 w-full mx-auto  justify-evenly items-center">
          {Fields.map(({ category, score }) => (
            <OverViewCard
              key={category}
              category={category}
              score={score}
            ></OverViewCard>
          ))}
        </div>
        <ShareButton shareId={shareId}></ShareButton>
      </div>
    </SectionLayout>
  );
}
