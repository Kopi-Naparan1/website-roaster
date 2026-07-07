type SectionType =
  | "hero"
  | "examples"
  | "overview"
  | "share"
  | "finalCta"
  | "cardBreakdown";

type SectionLayoutProps = Readonly<{
  sectionType: SectionType;
  children?: React.ReactNode;
  className?: string;
  heading?: string;
  subHeading?: string;
  childrenClassName?: string;
  headingAndSubHeadingClassName?: string;
}>;

export default function SectionLayout({
  sectionType,
  children,
  className,
  childrenClassName,
  heading,
  subHeading,
  headingAndSubHeadingClassName,
}: SectionLayoutProps) {
  return (
    <div className={`${className} mobileLayout md:desktopLayout`}>
      {/* Normal Sections */}
      {sectionType !== "hero" && sectionType !== "overview" ? (
        <div className={headingAndSubHeadingClassName}>
          <h2 className="font-heading text-4xl xl:text-5xl font-bold leading-tight  tracking-tight max-w-3xl mb-16 ">
            {heading}
          </h2>
        </div>
      ) : (
        <div className={headingAndSubHeadingClassName}>
          <h1 className="font-heading text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight lg:leading-none  tracking-tight lg:tracking-tighter max-w-4xl mb-6 ">
            {heading}
          </h1>
          <p className="font-sans text-lg lg:text-xl font-normal leading-relaxed tracking-normal mb-10 ">
            {subHeading}
          </p>
        </div>
      )}

      <div className={childrenClassName}> {children}</div>
    </div>
  );
}
