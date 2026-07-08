import { ComponentType } from "react";
import { AllSectionData, AllSectionDataInterface } from "@/data/AllSections";
import Hero from "@/components/homepage/Hero";
import Examples from "@/components/homepage/Examples";

interface Section {
  sectionID: string;
  Component: ComponentType<AllSectionDataInterface>;
}

const sections: Section[] = [
  {
    sectionID: "hero",
    Component: Hero as ComponentType<AllSectionDataInterface>,
  },
  {
    sectionID: "examples",
    Component: Examples as ComponentType<AllSectionDataInterface>,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1  ">
      {sections.map(({ sectionID, Component }) => {
        const data = AllSectionData.find(
          (i: AllSectionDataInterface) => i.sectionType === sectionID,
        );
        if (!data) return null;
        return <Component key={sectionID} {...data} />;
      })}
    </div>
  );
}
