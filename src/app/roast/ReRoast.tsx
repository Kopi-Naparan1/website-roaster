// src/app/roast/ReRoast.tsx
"use client";
import SectionLayout from "@/components/ui/Section";
import { HeroUrlInputUI } from "@/components/ui/HeroUrlInputUI";
import { useUrlRoastForm } from "@/app/lib/useUrlRoastForm";

interface ReRoastProps {
  sectionType: "reroast";
  heading: string;
  subHeading?: string;
  isResultPage: boolean;
}

export default function ReRoast({
  sectionType,
  heading,
  subHeading,
  isResultPage,
}: ReRoastProps) {
  const form = useUrlRoastForm();

  return (
    <SectionLayout
      sectionType={sectionType}
      className="flex flex-1 flex-col justify-center items-center text-center"
      headingAndSubHeadingClassName="flex flex-col justify-center items-center"
      childrenClassName="md:max-w-[50vw] w-full"
      heading={heading}
      subHeading={subHeading}
    >
      <HeroUrlInputUI {...form} isResultPage={isResultPage} />
    </SectionLayout>
  );
}
