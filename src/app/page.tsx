import { ComponentType } from "react";
import { AllSectionData, AllSectionDataInterface } from "@/data/AllSections";
import Hero from "@/components/homepage/Hero";
import Examples from "@/components/homepage/Examples";
import AboutVex from "@/components/homepage/AboutVex";
import QuestionsYouMightAsk from "@/components/homepage/QuestionsYouMightAsk";

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
  {
    sectionID: "about",
    Component: AboutVex as ComponentType<AllSectionDataInterface>,
  },
  {
    sectionID: "questionsYouMightAsk",
    Component: QuestionsYouMightAsk as ComponentType<AllSectionDataInterface>,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 md:gap-0 gap-16  ">
      {sections.map(({ sectionID, Component }) => {
        const data = AllSectionData.find(
          // See if hero/examples and examples have a match inside the AllSections Data
          (i: AllSectionDataInterface) => i.sectionType === sectionID,
        );
        if (!data) return null;
        return <Component key={sectionID} {...data} />;
      })}
    </div>
  );
}
