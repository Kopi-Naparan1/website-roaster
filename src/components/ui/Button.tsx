// src\components\ui\Button.tsx

type ButtonProps = Readonly<{
  variant: "primary" | "secondary" | "card";
  text?: string;
  buttonClassName?: string;
  onClick?: () => void;
  disabled?: boolean;
}>;
function ButtonChooser({
  variant,
  text,
  buttonClassName,
  onClick,
  disabled,
}: ButtonProps) {
  if (variant === "primary") {
    return (
      <button
        type="button"
        className={` flex justify-center   items-center h-10 md:h-11 font-sans font-semibold text-primary-foreground tracking-wide px-5 lg:px-6 py-2.5   leading-none text-sm bg-primary rounded-sm  md:shrink-0 disabled:opacity-50 disabled:cursor-not-allowed   enabled:duration-75 enabled:ease-in-out enabled:transition-colors enabled:hover:bg-primary/90 enabled:cursor-pointer ${buttonClassName ?? ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        {text || "Roast it!"}
      </button>
    );
  } else if (variant === "secondary") {
    return (
      <button
        type="button"
        className={`flex justify-center items-center h-11 md:h-12 font-sans  font-semibold tracking-wide px-5 lg:px-6 py-2.5 leading-none text-sm bg-secondary text-white rounded-sm ${buttonClassName}`}
        onClick={onClick}
        disabled={disabled}
      >
        {text || "Roast another site"}
      </button>
    );
  } else if (variant === "card") {
    return (
      <button
        type="button"
        className={`flex justify-center items-center h-10 md:h-11 font-sans leading-none tracking-wide px-5 lg:px-6 py-2.5 font-semibold text-sm bg-card text-white rounded-sm ${buttonClassName}`}
        onClick={onClick}
        disabled={disabled}
      >
        {text || "View full breakdown"}
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
}: ButtonProps) {
  return (
    <ButtonChooser
      variant={variant}
      text={text}
      buttonClassName={buttonClassName}
      onClick={onClick}
      disabled={disabled}
    />
  );
}
