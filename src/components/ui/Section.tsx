import Image from "next/image";
import VexHeroDecorative from "../../../public/vex/vex-hero-decorative.webp";

type SectionType =
  | "hero"
  | "examples"
  | "overviewResultPage"
  | "share"
  | "roastBreakDown"
  | "expiredID"
  | "reroast"
  | "questionsYouMightAsk"
  | "about"
  | "donation"
  | "contact";

type SectionLayoutProps = Readonly<{
  sectionType: SectionType;
  children?: React.ReactNode;
  className?: string;
  heading?: string;
  subHeading?: string;
  childrenClassName?: string;
  headingAndSubHeadingClassName?: string;
  headingUrl?: string;
  isResultPage?: boolean;
}>;

function handleHeroSections(
  sectionType: string,
  heading?: string,
  headingUrl?: string,
) {
  if (sectionType == "hero") {
    return (
      <>
        {heading}
        {sectionType === "hero" && (
          <Image
            src={VexHeroDecorative}
            alt=""
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            width={64}
            height={64}
            className="inline-block align-middle w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 mb-5 "
          />
        )}
      </>
    );
  } else if (sectionType === "overviewResultPage") {
    return (
      <>
        <span>{heading}</span>
        <span className="block text-xl md:text-xl lg:text-2xl break-all text-foreground/80">
          {headingUrl}
        </span>
      </>
    );
  } else if (sectionType === "contact") {
    return <span>{heading}</span>;
  }
}

export default function SectionLayout({
  sectionType,
  children,
  className,
  childrenClassName,
  heading,
  subHeading,
  headingAndSubHeadingClassName,
  headingUrl,
}: SectionLayoutProps) {
  return (
    <div
      id={sectionType}
      className={`${className} min-h-screen  mobileLayout md:desktopLayout`}
    >
      {/* Normal Sections*/}
      {sectionType !== "hero" &&
      sectionType !== "overviewResultPage" &&
      sectionType !== "contact" ? (
        <div className={headingAndSubHeadingClassName}>
          <h2 className="font-heading text-4xl xl:text-5xl font-bold leading-tight  tracking-tight max-w-3xl mb-5 ">
            {heading}
          </h2>
          <p className="font-sans text-base lg:text-lg font-normal leading-relaxed tracking-normal max-w-xl mb-16">
            {subHeading}
          </p>
        </div>
      ) : (
        // Hero Sections
        <div className={headingAndSubHeadingClassName}>
          <h1
            className={`font-heading text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight lg:leading-none tracking-tight max-w-4xl mb-6 ${
              sectionType === "overviewResultPage" ? "flex flex-col" : ""
            }`}
          >
            {handleHeroSections(sectionType, heading, headingUrl)}
          </h1>
          <p className="font-sans text-lg lg:text-xl font-normal leading-relaxed tracking-normal mb-0 md:mb-10 max-w-xl">
            {subHeading}
          </p>
        </div>
      )}

      <div className={childrenClassName}> {children}</div>
    </div>
  );
}
