type SectionType =
  | "hero"
  | "examples"
  | "overviewResultPage"
  | "share"
  | "roastBreakDown"
  | "reroast"
  | "expiredID";

type SectionLayoutProps = Readonly<{
  sectionType: SectionType;
  children?: React.ReactNode;
  className?: string;
  heading?: string;
  subHeading?: string;
  childrenClassName?: string;
  headingAndSubHeadingClassName?: string;
  headingUrl?: string;
}>;

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
    <div className={`${className} min-h-screen  mobileLayout md:desktopLayout`}>
      {/* Normal Sections*/}
      {sectionType !== "hero" && sectionType !== "overviewResultPage" ? (
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
          <h1 className="flex flex-col font-heading text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight lg:leading-none tracking-tight max-w-4xl mb-6">
            {sectionType !== "overviewResultPage" ? (
              heading
            ) : (
              <>
                <span>{heading}</span>
                <span className="block text-xl md:text-xl lg:text-2xl break-all text-foreground/80">
                  {headingUrl}
                </span>
              </>
            )}
          </h1>
          <p className="font-sans text-lg lg:text-xl font-normal   leading-relaxed tracking-normal mb-10 max-w-xl">
            {subHeading}
          </p>
        </div>
      )}

      <div className={childrenClassName}> {children}</div>
    </div>
  );
}
