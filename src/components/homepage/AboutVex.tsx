"use client";

import SectionLayout from "../ui/Section";
import { Button } from "../ui/Button";
import { vexProgressStore } from "../utils/VexProgress";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState, useRef, useSyncExternalStore } from "react";
import {
  VexStoryChaptersData,
  VexStoryChapterInterface,
} from "@/data/VexStoryChaptersData";
import Image from "next/image";

interface AboutVexInterface {
  sectionType: "about";
  heading: string;
  subHeading: string;
}
interface ChapterMakerProps {
  chapter: VexStoryChapterInterface;
  isUnlocked: boolean;
  roastedSites: number;
}

function ChapterMaker({
  chapter,
  isUnlocked,
  roastedSites,
}: ChapterMakerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isUnlocked) {
    return (
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-6 md:gap-0 lg:min-h-[70%]">
        <div className="flex flex-col w-full md:w-3/5 md:pr-12 gap-4">
          <h3 className="font-semibold text-xl">
            Chapter {chapter.chapterNumber}: {chapter.title}
          </h3>
          <p className="whitespace-pre-line">{chapter.lockedTeaser}</p>
          <p>(You roasted {roastedSites} sites so far.)</p>
        </div>
        <div className="w-full md:w-2/5 bg-brand-100 rounded-sm flex justify-end items-center">
          <div className="relative w-full h-48 md:h-72 lg:h-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-6 lg:gap-10 lg:min-h-[70%]">
      <div className="flex flex-col w-full lg:w-3/5 gap-4 lg:min-h-[90%]">
        <h3 className="font-semibold text-xl lg:text-2xl">
          S{chapter.season} Chapter {chapter.chapterNumber}: {chapter.title}
        </h3>

        <p
          className={`whitespace-pre-line font-sans font-normal leading-relaxed tracking-normal text-foreground/80 md:columns-2 lg:columns-1 md:gap-8 lg:pr-24 ${
            !isExpanded ? "line-clamp-6 md:line-clamp-none" : ""
          }`}
        >
          {chapter.content}
        </p>

        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="md:hidden justify-center flex items-center gap-1 text-xs font-medium text-brand-600 cursor-pointer"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Read more <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center md:justify-start">
        <div className="relative w-full  lg:max-w-full h-74 md:h-120 lg:h-100 rounded-sm shadow-md overflow-hidden">
          <Image
            src={chapter.supportingImage}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover"
            alt={chapter.title}
          />
        </div>
      </div>
    </div>
  );
}
function useHoldScroll(
  viewportRef: React.RefObject<HTMLDivElement | null>,
  direction: 1 | -1,
) {
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    intervalRef.current = window.setInterval(() => {
      viewportRef.current?.scrollBy({ top: direction * 8 });
    }, 16);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return { onPointerDown: start, onPointerUp: stop, onPointerLeave: stop };
}

function SelectingChapters({
  currentIndex,
  setCurrentIndex,
}: {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollUp = useHoldScroll(viewportRef, -1);
  const scrollDown = useHoldScroll(viewportRef, 1);
  return (
    <Select.Root
      value={String(currentIndex)}
      onValueChange={(v) => setCurrentIndex(Number(v))}
    >
      <Select.Trigger
        aria-label="choose chapter"
        className="border rounded px-2 py-1 text-xs lg:text-md flex items-center gap-1 hover:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600"
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown size={14} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="bg-background rounded-md shadow-lg border z-50 overflow-hidden"
          position="popper"
        >
          <div
            {...scrollUp}
            className="flex items-center justify-center h-6 cursor-default"
          >
            <ChevronUp size={14} />
          </div>

          <Select.Viewport
            ref={viewportRef}
            className="p-1 md:max-h-50 overflow-y-auto"
          >
            {VexStoryChaptersData.map((chapter, index) => (
              <Select.Item
                key={chapter.chapterNumber}
                value={String(index)}
                className="px-3 py-2 text-xs cursor-pointer outline-none flex items-center justify-between data-highlighted:bg-brand-100 data-highlighted:text-brand-900 data-[state=checked]:font-semibold"
              >
                <Select.ItemText>
                  S{chapter.season} Chapter {chapter.chapterNumber}:{" "}
                  {chapter.title}
                </Select.ItemText>
                <Select.ItemIndicator className="ml-2">
                  <Check size={12} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>

          <div
            {...scrollDown}
            className="flex items-center justify-center h-6 cursor-default"
          >
            <ChevronDown size={14} />
          </div>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export default function AboutVex({
  sectionType,
  heading,
  subHeading,
}: AboutVexInterface) {
  const count = useSyncExternalStore(
    vexProgressStore.subscribe,
    vexProgressStore.getSnapshot,
    vexProgressStore.getServerSnapshot,
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentChapter = VexStoryChaptersData[currentIndex];

  const lastIndex = VexStoryChaptersData.length - 1;
  function GoNext() {
    setCurrentIndex((i) => Math.min(i + 1, lastIndex));
  }

  function GoBack() {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <SectionLayout
      sectionType={sectionType}
      heading={heading}
      subHeading={subHeading}
      headingAndSubHeadingClassName="text-center md:text-left justify-center items-center"
      childrenClassName="flex flex-col"
    >
      <ChapterMaker
        key={currentChapter.chapterNumber}
        chapter={currentChapter}
        roastedSites={count}
        isUnlocked={
          currentChapter.unlockCondition.type === "always" ||
          count >= (currentChapter.unlockCondition.threshold ?? Infinity)
        }
      ></ChapterMaker>

      <div className="flex flex-row items-center justify-between md:flex-col md:justify-start md:items-start lg:flex-row lg:items-center lg:justify-start md:gap-2 lg:gap-4 mt-8 md:w-1/2 lg:w-3/5 min-h-14 md:min-h-24 lg:min-h-14">
        <Button
          onClick={GoBack}
          disabled={currentIndex === 0}
          buttonClassName={`${currentIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          variant="back"
        ></Button>
        <SelectingChapters
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        ></SelectingChapters>
        <Button
          onClick={GoNext}
          variant="next"
          buttonClassName={`${currentIndex === lastIndex ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          disabled={currentIndex === lastIndex}
        ></Button>
      </div>
    </SectionLayout>
  );
}
