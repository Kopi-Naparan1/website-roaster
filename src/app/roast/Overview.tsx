import SectionLayout from "@/components/ui/Section";
import { RoastDataType } from "./RoastBreakDown";

interface OverviewProps {
  roast: RoastDataType;
  sectionType: "overviewResultPage";
  heading: string;
  subHeading?: string;
}

interface CategoriesProps {
  category: string;
  data: string;
}

function CardMaker({ category, data }: { category: string; data: string }) {
  return (
    <div>
      <h3>{category}</h3>

      <p> {data}</p>
    </div>
  );
}

export default function Overview({
  roast,
  sectionType,
  heading,
  subHeading,
}: OverviewProps) {
  const overviewData = roast.overall;

  const categories: CategoriesProps[] = [
    { category: "comment", data: overviewData.comment },
    { category: "evidence", data: overviewData.evidence },
    { category: "tip", data: overviewData.tip },
  ];
  return (
    <SectionLayout
      sectionType={sectionType}
      heading={heading}
      subHeading={subHeading}
    >
      <div className="flex flex-col justify-center items-center">
        <div className="rounded-full p-4">{overviewData.score}</div>
      </div>
      <div>
        {categories.map(({ category, data }) => (
          <CardMaker key={category} data={data} category={category}></CardMaker>
        ))}
      </div>
    </SectionLayout>
  );
}
