// src\components\ui\Button.tsx

type ButtonProps = Readonly<{
  variant: "primary" | "secondary" | "card" | "ghost" | "next" | "back";
  text?: string;
  buttonClassName?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}>;
function ButtonChooser({
  variant,
  text,
  buttonClassName,
  onClick,
  disabled,
  children,
}: ButtonProps) {
  if (variant === "primary") {
    return (
      <button
        type="button"
        className={`dark:text-foreground flex justify-center min-w-35  items-center h-10 md:h-11 font-sans font-semibold text-primary-foreground tracking-wide px-5 lg:px-6 py-2.5   leading-none text-sm bg-primary rounded-sm  md:shrink-0 disabled:opacity-50 disabled:cursor-not-allowed   enabled:duration-75 enabled:ease-in-out enabled:transition-colors enabled:hover:bg-primary/90 enabled:cursor-pointer ${buttonClassName ?? ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children || text || "Roast it!"}
      </button>
    );
  } else if (variant === "secondary") {
    return (
      <button
        type="button"
        className={`flex justify-center dark:text-foreground/70  dark:hover:bg-background  dark:hover:text-foreground items-center h-10 md:h-11 font-sans  font-semibold tracking-wide px-5 lg:px-6 py-2.5 leading-none text-sm border-primary border hover:bg-brand-50 cursor-pointer duration-75 ease-in-out text-secondary-foreground rounded-sm ${buttonClassName}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children || text || "Roast another site"}
      </button>
    );
  } else if (variant === "card") {
    return (
      <button
        type="button"
        className={`dark:text-background flex justify-center items-center font-sans leading-none tracking-wide px-5 lg:px-6 py-2 font-medium text-xs transition-colors hover:text-background bg-brand-300 hover:bg-brand-400 duration-75 cursor-pointer ease-in-out text-foreground rounded-sm ${buttonClassName}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children || text || "View Roast"}
      </button>
    );
  } else if (variant === "ghost") {
    return (
      <button
        type="button"
        className={`flex justify-center items-center font-sans leading-none tracking-wide cursor-pointer font-medium text-xs md:text-sm mt-1 ${buttonClassName}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children || text || "cancel"}
      </button>
    );
  } else if (variant === "back") {
    return (
      <button
        type="button"
        className={`dark:text-background/80 dark:bg-brand-300 flex justify-center items-center hover:bg-brand-200   lg:text-sm font-sans leading-none tracking-wide cursor-pointer font-medium text-xs md:text-sm   border border-foreground/50 px-2 py-1 bg-brand-50 rounded-sm  duration-75 ease-in-out transition-colors  ${buttonClassName}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children || text || "previous"}
      </button>
    );
  } else if (variant === "next") {
    return (
      <button
        type="button"
        className={`dark:text-background/80 dark:bg-brand-300 flex justify-center items-center lg:text-sm px-2 py-1 rounded-sm hover:bg-brand-200 duration-75 ease-in-out transition-colors font-sans border bg-brand-100 leading-none tracking-wide cursor-pointer font-medium text-xs md:text-sm ${buttonClassName}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children || text || "next"}
      </button>
    );
  }
}
export function Button({
  variant,
  text,
  buttonClassName,
  onClick,
  disabled,
  children,
}: ButtonProps) {
  return (
    <ButtonChooser
      variant={variant}
      text={text}
      buttonClassName={buttonClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </ButtonChooser>
  );
}
