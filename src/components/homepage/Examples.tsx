import SectionLayout from "../ui/Section";

interface ExampleProps {
  sectionType: "examples";
  heading: string;
  subHeading: string;
}

export default function Example({
  sectionType,
  heading,
  subHeading,
}: ExampleProps) {
  return (
    <SectionLayout
      sectionType={sectionType}
      heading={heading}
      subHeading={subHeading}
    />
  );
}
// This is wrong, fix it, this is a slug. Maybe import here the components section of result-page
