// src/app/roast/ReRoast.tsx
"use client";
import SectionLayout from "@/components/ui/Section";
import { HeroUrlInputUI } from "@/components/ui/HeroUrlInputUI";
import { useUrlRoastForm } from "@/app/lib/useUrlRoastForm";
import { usePathname } from "next/navigation";

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
  const pathName = usePathname();
  const isAlreadyRoastedpage = isAlreadyRoastedPageFunction();
  function isAlreadyRoastedPageFunction() {
    if (pathName.startsWith("/r/")) {
      return true;
    }
  }

  return (
    <SectionLayout
      sectionType={sectionType}
      className={`flex flex-1 flex-col justify-center items-center text-center   ${isAlreadyRoastedpage ? "bg-background" : "bg-background-alt"}`}
      headingAndSubHeadingClassName="flex flex-col justify-center items-center"
      childrenClassName="md:max-w-[50vw] w-full"
      heading={heading}
      subHeading={subHeading}
    >
      <HeroUrlInputUI {...form} isResultPage={isResultPage} />
    </SectionLayout>
  );
}
