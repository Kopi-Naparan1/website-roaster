import SectionLayout from "@/components/ui/Section";

type CategoryResult = {
  score: number;
  comment: string;
  evidence: string;
  strength: string;
  tip: string;
  quote?: string;
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
}: {
  title: string;
  data: CategoryResult;
}) {
  return (
    <div className="border rounded-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-heading font-bold uppercase text-sm">{title}</h3>
        <span className="text-lg font-bold">{data.score}/10</span>
      </div>
      <p className="font-semibold mb-3">{data.comment}</p>
      <p className="text-sm text-foreground/70 mb-3">📌 {data.evidence}</p>
      <p className="text-sm text-foreground/70 mb-3">📌 {data.strength}</p>
      <p className="text-sm text-foreground/70">💡 {data.tip}</p>
      <p className="text-sm text-foreground/70 mb-3">📌 {data.quote}</p>
    </div>
  );
}

export default function RoastBreakDown({
  roast,
  sectionType,
  heading,
  subHeading,
}: RoastBreakDownProps) {
  const categories: { title: string; data: CategoryResult }[] = [
    { title: "Clarity", data: roast.clarity },
    { title: "Copy", data: roast.copy },
    { title: "CTA", data: roast.cta },
    { title: "Trust", data: roast.trust },
    { title: "Mobile", data: roast.mobile },
  ];
  return (
    <SectionLayout
      sectionType={sectionType}
      heading={heading}
      subHeading={subHeading}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
    >
      {categories.map(({ title, data }) => (
        <CategoryCard key={title} title={title} data={data}></CategoryCard>
      ))}
    </SectionLayout>
  );
}
