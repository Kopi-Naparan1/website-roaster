import SectionLayout from "@/components/ui/Section";
import { RoastDataType } from "./RoastBreakDown";

interface OverviewProps {
  roast: RoastDataType;
  sectionType: "expiredID";
  heading: string;
}

export default function ExpiredID({ sectionType, heading }: OverviewProps) {
  return (
    <SectionLayout
      headingAndSubHeadingClassName="text-center flex flex-col justify-center items-center"
      sectionType={sectionType}
      className="flex flex-col"
      childrenClassName="flex flex-col flex-1  "
      heading={heading}
    ></SectionLayout>
  );
}
