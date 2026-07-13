import { Button } from "./Button";
import { X, Archive, Trash2 } from "lucide-react";
import { useRecentRoasts } from "@/app/lib/useRecentRoasts";
import { useState, useRef, useEffect } from "react";

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
  const { roasts, clearRoasts } = useRecentRoasts();
  const [showArchive, setShowArchive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowArchive(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
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
        <div className="w-full max-w-auto flex-flex-col   ">
          <div ref={containerRef} className="relative w-full ">
            <input
              value={url}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Input the URL of the site"
              className="relative w-full md:max-w-auto md:flex-1 rounded-sm border border-foreground/60 bg-input pl-3 pr-18 h-11   md:mb-0 focus:border-foreground focus:outline-none text-base font-normal leading-normal tracking-normal placeholder:text-base lg:placeholder:text-sm placeholder:font-normal placeholder:leading-normal placeholder:tracking-normal"
            ></input>
            <div className="absolute flex flex-row gap-2 right-3 top-1/2 -translate-y-1/2 text-foreground/60 z-20">
              <button
                className="cursor-pointer duration-75 ease-in-out transition-opacity hover:text-foreground"
                type="button"
                onClick={() => handleChange("")}
              >
                <X size={20}></X>
              </button>

              {showArchive && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-sm border border-foreground/80 bg-white shadow-md z-10">
                  {roasts.length === 0 ? (
                    <p className="text-xs text-foreground/60 p-3">
                      {" "}
                      No recent roast yet. Try google.com.
                    </p>
                  ) : (
                    <>
                      {" "}
                      <div className="flex justify-between p-2 text-xs font-semibold border-b">
                        <p>Previously roasted sites </p>
                        <p>{roasts.length}/10</p>
                      </div>
                      <ul className="max-h-60 overflow-y-auto">
                        {roasts.map((r, index) => (
                          <li key={r.url}>
                            <button
                              type="button"
                              className="w-full text-left p-2 text-xs hover:bg-foreground/10 cursor-pointer  duration-75 ease-in-out transition-colors "
                              onClick={() => {
                                handleChange(r.url);
                                setShowArchive(false);
                              }}
                            >
                              <span className="text-foreground/30 text-xs shrink-0 pr-2">
                                {index + 1}
                              </span>
                              <span className="truncate text-xs text-foreground/70">
                                {index === 0 ? `${r.url} (newest)` : r.url}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className="flex gap-2 cursor-pointer flex-row w-full text-left p-2 text-xs text-red-400/80 hover:text-red-500 duration-75 ease-in-out transition-colors hover:bg-red-200 border-t border-foreground/10"
                        onClick={clearRoasts}
                      >
                        <Trash2 size={12}></Trash2>
                        <p className="text-xs"> Delete entire archive</p>
                      </button>
                    </>
                  )}
                </div>
              )}
              <button
                className="cursor-pointer hover:text-foreground duration-75 ease-in-out transition-opacity"
                type="button"
                onClick={() => setShowArchive((prev) => !prev)}
              >
                <Archive size={20}></Archive>
              </button>
            </div>
          </div>

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
