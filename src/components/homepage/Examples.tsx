"use client";

import { useRouter } from "next/navigation";
import SectionLayout from "../ui/Section";
import { examplesData } from "@/data/ExamplesData";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useTransition } from "react";
import { Button } from "../ui/Button";
import VexTyping from "../../../public/vex/vex-roasting.webp";

interface ExampleProps {
  sectionType: "examples";
  heading: string;
  subHeading: string;
}
interface CardMakerPropts {
  shareId: string;
  siteUrl: string;
  screenshotImage: StaticImageData;
  ogImage: StaticImageData;
}

function CardMaker({
  shareId,
  siteUrl,
  screenshotImage,
  ogImage,
}: CardMakerPropts) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleOnClick() {
    startTransition(() => {
      router.push(`/r/${shareId}`);
    });
  }

  return (
    <div className="group w-[80%] md:w-[32%] lg:w-[32.5%] flex flex-col  justify-center items0  bg-card shadow-sm hover:shadow-md border rounded-sm p-2">
      <a
        href={siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm truncate text-center w-[80%] mx-auto mb-4 cursor-pointer bg-[linear-gradient(to_right,transparent,var(--color-foreground)_20%,var(--color-foreground)_80%,transparent)] bg-size-[100%_1px] bg-no-repeat bg-bottom opacity-40 group-hover:opacity-100 transition-opacity duration-300"
      >
        {siteUrl}
      </a>
      <div className=" relative aspect-video mb-6">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          className="absolute inset-0 object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
          src={screenshotImage}
          alt={`Screenshot of ${siteUrl}`}
        />
        <Image
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          className="absolute inset-0 object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          src={ogImage}
          alt={`OpenGraph preview of ${siteUrl}`}
        />
      </div>
      <Button
        onClick={handleOnClick}
        variant="card"
        disabled={isPending}
        buttonClassName="relative"
      >
        <span>View roast</span>
        {isPending && (
          <div className="animate-pulse absolute right-2 top-1/2 -translate-y-1/2 w-[2em] h-[2em] overflow-hidden">
            <Image
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              src={VexTyping}
              alt="Vex logo typing his keyboard"
              fill
              className="object-contain"
            />
          </div>
        )}
      </Button>
    </div>
  );
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
      headingAndSubHeadingClassName="text-center md:text-left justify-center items-center"
      subHeading={subHeading}
      childrenClassName="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0"
    >
      {examplesData.map((item) => (
        <CardMaker key={item.siteUrl} {...item}></CardMaker>
      ))}
    </SectionLayout>
  );
}
