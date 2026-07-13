import { Button } from "./Button";

interface HeroUrlInputUI {
  serverError: string | null;
  urlError: string;
  goodUrlIndicator: string;
  url: string;
  handleChange: (value: string) => void;
  loading: boolean;
  progress: number;
  elapsedSeconds: number;
  handleRoast: () => void;
  isDisabled: boolean;
  handleCancel: () => void;
  isResultPage?: boolean;
  handleBackToHome?: () => void;
}

export function HeroUrlInputUI({
  serverError,
  urlError,
  goodUrlIndicator,
  url,
  handleChange,
  loading,
  progress,
  elapsedSeconds,
  handleRoast,
  isDisabled,
  handleCancel,
  isResultPage,
  handleBackToHome,
}: HeroUrlInputUI) {
  return (
    <>
      {" "}
      <div className="min-h-5 md:min-h-6 mt-1">
        {serverError ? (
          <p className="text-xs md:text-sm text-red-600 mb-1" role="alert">
            {serverError}
          </p>
        ) : urlError ? (
          <p className="text-xs md:text-sm text-red-600 mb-1">{urlError}</p>
        ) : goodUrlIndicator ? (
          <p className="text-xs md:text-sm text-green-500 mb-1">
            {goodUrlIndicator}
          </p>
        ) : null}
      </div>
      <div className="mb-2   flex flex-col md:flex-row gap-2 md:gap-1 md:justify-center  items-center md:items-start ">
        <div className="w-full max-w-auto flex-flex-col ">
          <input
            value={url}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Input the URL of the site"
            className="w-full md:max-w-auto md:flex-1 rounded-sm border border-foreground/60 bg-input px-3 h-11   md:mb-0 focus:border-foreground focus:outline-none text-base font-normal leading-normal tracking-normal placeholder:text-base lg:placeholder:text-sm placeholder:font-normal placeholder:leading-normal placeholder:tracking-normal"
          ></input>
          <div
            className={`w-full max-w-auto my-1 ${loading ? "opacity-100" : "opacity-0"}`}
          >
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-foreground/60 mt-1">{elapsedSeconds}s</p>
          </div>
        </div>
      </div>
      <div className=" flex flex-row justify-center ">
        <div>
          {isResultPage && (
            <Button
              buttonClassName="mr-6"
              variant="secondary"
              text="Back to Home"
              onClick={handleBackToHome}
            ></Button>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="primary"
            onClick={() => handleRoast()}
            disabled={isDisabled}
          >
            {loading ? (
              <>
                Roasting <span className="animate-pulse">🔥</span>
              </>
            ) : (
              "Roast it!"
            )}
          </Button>

          <Button
            variant="ghost"
            buttonClassName={loading ? "" : "invisible "}
            onClick={handleCancel}
          >
            cancel
          </Button>
        </div>
      </div>
    </>
  );
}
