import SectionLayout from "../ui/Section";

export default function Overview(overviewData: {
  sectionType: string;
  heading: string;
  subHeading: string;
}) {
  const { sectionType, heading, subHeading } = overviewData;
  return (
    <SectionLayout
      sectionType={sectionType}
      heading={heading}
      subHeading={subHeading}
    />
  );
}
