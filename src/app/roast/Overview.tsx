import SectionLayout from "@/components/ui/Section";
import { RoastDataType } from "./RoastBreakDown";

interface OverviewProps {
  roast: RoastDataType;
  sectionType: "overviewResultPage";
  heading: string;
  subHeading?: string;
}
export default function Overview({
  roast,
  sectionType,
  heading,
  subHeading,
}: OverviewProps) {
  const overviewData = roast.overall;
  return (
    <SectionLayout
      sectionType={sectionType}
      heading={heading}
      subHeading={subHeading}
    >
      <div className="flex flex-col justify-center items-center">
        <div className="rounded-full p-4">{overviewData.score}</div>
      </div>
      <div></div>
    </SectionLayout>
  );
}
// Focus on overview first. Next, make a card to all neat and clean. Except the score
