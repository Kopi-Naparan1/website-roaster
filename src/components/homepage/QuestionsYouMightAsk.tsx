"use client";
import SectionLayout from "../ui/Section";
import { Send, X, Trash2 } from "lucide-react";
import {
  useState,
  useSyncExternalStore,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import VexProfile from "../../../public/vex/vex-profile.webp";

import {
  faqByCategory,
  FAQEntry,
  DEFAULT_TYPING_DELAY_MS,
  faqById,
  FAQCategory,
} from "@/data/faq/index";

interface QuestionsYouMightAskInterface {
  sectionType: "questionsYouMightAsk";
  heading: string;
  subHeading: string;
}

type ChatMessage = {
  role: "vex" | "user";
  content: string;
};

function getSomeDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function QuestionsYouMightAsk({
  sectionType,
  heading,
  subHeading,
}: QuestionsYouMightAskInterface) {
  const [activeCategory, setActiveCategory] = useState<FAQCategory | null>(
    "meta",
  );

  const [activeQuestion, setActiveQuestion] = useState<string>("");
  const [currentEntry, setCurrentEntry] = useState<FAQEntry | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [lastAnsweredEntry, setLastAnsweredEntry] = useState<FAQEntry | null>(
    null,
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const categories = Object.keys(faqByCategory) as FAQCategory[];

  function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }

  function getSnapshot(): string {
    return localStorage.getItem("vex-chat-history") ?? "[]";
  }

  function getServerSnapshot(): string {
    return "[]";
  }

  const rawMessages = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function saveMessages(newMessages: ChatMessage[]) {
    localStorage.setItem("vex-chat-history", JSON.stringify(newMessages));
    window.dispatchEvent(new Event("storage"));
  }
  const message: ChatMessage[] = JSON.parse(rawMessages);

  function handleOnClickQuestion(entry: FAQEntry) {
    console.log(`handleclickQuestion: ${entry}`);
    setActiveQuestion(entry.question);
    setCurrentEntry(entry);
    setIsPanelOpen(false);
  }
  const handleSubmitQuestion = useCallback(
    (entry: FAQEntry) => {
      if (isTyping) return;
      const MAX_MESSAGES = 14;
      const question = entry.question;
      const userQuestion: ChatMessage = {
        role: "user",
        content: question,
      };
      setActiveQuestion("");
      setLastAnsweredEntry(null);

      const delay = entry.typingDelayMs || DEFAULT_TYPING_DELAY_MS;
      const updatedWithUser = [...message, userQuestion].slice(-MAX_MESSAGES);
      saveMessages(updatedWithUser);
      setIsTyping(true);

      const answer = entry.answer;
      const vexAnswer: ChatMessage = {
        role: "vex",
        content: answer,
      };

      setTimeout(
        () => {
          const current: ChatMessage[] = JSON.parse(getSnapshot());
          const updatedWithVex = [...current, vexAnswer].slice(-MAX_MESSAGES);
          saveMessages(updatedWithVex);
          setLastAnsweredEntry(entry);
          setIsTyping(false);
        },
        getSomeDelay(...delay),
      );
    },
    [isTyping, message],
  );

  function handleClickDeleteAllChat() {
    saveMessages([]);
  }

  const suggestedFollowUps =
    lastAnsweredEntry?.followUpIds
      ?.slice(0, 1)
      .map((id) => faqById[id])
      .filter(Boolean) ?? [];

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPanelOpen || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable[0]?.focus();
  }, [isPanelOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPanelOpen) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPanelOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && currentEntry) {
        handleSubmitQuestion(currentEntry);
        (document.activeElement as HTMLElement)?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentEntry, handleSubmitQuestion]);
  return (
    <SectionLayout
      childrenClassName="flex flex-col relative overflow-hidden md:flex-row md:h-[60vh] md:max-h-160 lg:h-[70vh] border border-foreground/50 rounded-sm"
      headingAndSubHeadingClassName="text-center md:text-left justify-center items-center"
      heading={heading}
      className="bg-background-alt"
      subHeading={subHeading}
      sectionType={sectionType}
    >
      {/* LEFT SIDE PANEL */}
      <div className="h-[70vh] relative  md:h-full w-full md:w-1/2 lg:w-3/5 bg-brand-50 border-r border-foreground/20 dark:bg-brand-800/40 lg:rounded-l-sm flex flex-col p-2">
        {/* MESSAGES */}
        <div className="flex-1  mb-4 overflow-y-auto  ">
          <ul className="flex flex-col justify-end h-full px-2">
            {message.map((m, index) => (
              <li className={`flex flex-row items-end `} key={index}>
                {m.role === "vex" && (
                  <div className="h-auto w-auto bg-brand-200/50 dark:bg-brand-200 p-1  rounded-full mr-1 md:mr-2  mb-2">
                    <div className="relative w-6 h-6 lg:w-5 lg:h-5  mb-1">
                      <Image
                        fill
                        className="object-contain "
                        alt=""
                        src={VexProfile}
                      ></Image>
                    </div>
                  </div>
                )}
                <span
                  className={`max-w-[60%] my-2 text-sm rounded-lg p-2 ${m.role === "user" ? "ml-auto bg-brand-300/70 dark:bg-brand-500" : "mr-auto  bg-brand-200/40"} `}
                >
                  {m.content}
                </span>
              </li>
            ))}
            {isTyping && (
              <li className="flex flex-row items-end">
                <div className="h-auto w-auto bg-brand-200 p-1 rounded-full mr-2 mb-2">
                  <div className="relative w-6 h-6 lg:w-5 lg:h-5  mb-1">
                    <Image
                      fill
                      className="object-contain"
                      alt=""
                      src={VexProfile}
                    ></Image>
                  </div>
                </div>
                <div className="max-w-[60%] my-2 rounded-lg p-2 mr-auto bg-brand-200/60 flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce"
                      style={{
                        animationDelay: `${i * 0.12}s`,
                        animationDuration: "0.9s",
                      }}
                    ></span>
                  ))}
                </div>
              </li>
            )}
          </ul>
        </div>
        <button
          onClick={handleClickDeleteAllChat}
          className="text-red-300 absolute right-1 top-2 flex  gap-1 bg-background rounded-sm opacity-40 px-2 py-0.5 cursor-pointer hover:text-red-400 duration-75 ease-in-out transition-all hover:opacity-100"
        >
          <span className="text-xs">Delete Entire Chat</span>
          <span>
            <Trash2 size={12}></Trash2>
          </span>
        </button>
        <button
          type="button"
          className="md:hidden bg-brand-600 text-background p-1 rounded-full mb-1 self-start text-xs dark:text-foreground/80    "
          onClick={() => setIsPanelOpen(true)}
        >
          Click: Browse Topics
        </button>

        {/* INPUT AND SEND */}
        <div className="relative flex flex-row">
          {lastAnsweredEntry && suggestedFollowUps.length > 0 && (
            <button
              onClick={() => handleOnClickQuestion(suggestedFollowUps[0])}
              className=" absolute bottom-full mb-2 left-1/2 max-w-[90%] -translate-x-1/2 bg-foreground/50 shadow-md hover:bg-foreground opacity-70 text-background dark:text-background dark:hover:text-background  dark:hover:bg-foreground dark:bg-foreground  cursor-pointer  transition-colors duration-150 text-left rounded-md   p-1 flex items-start gap-2 text-xs leading-snug"
              type="button"
            >
              {suggestedFollowUps[0].question}
            </button>
          )}
          <div className="w-full min-h-10   pl-2 pr-20 py-1.5 md:pr-20 border border-foreground/50 rounded-sm wrap-break-word whitespace-normal text-sm flex items-center">
            {activeQuestion}
          </div>

          <button
            type="button"
            onClick={() => handleSubmitQuestion(currentEntry as FAQEntry)}
            className="dark:bg-brand-600/80 dark:hover:bg-brand-600 group flex flex-row absolute top-1/2 -translate-y-1/2 right-2 lg:right-4 py-0.5 cursor-pointer justify-center items-center gap-1 bg-brand-200/80 rounded-full px-3 hover:bg-brand-200 duration-75 ease-in-out transition-colors"
          >
            <span className="lg:text-sm ">send</span>
            <Send className="group-hover:scale-105 " size={14}></Send>
          </button>
        </div>
      </div>
      {isPanelOpen && (
        <div
          onClick={() => setIsPanelOpen(false)}
          className="md:hidden absolute inset-0 z-10 bg-black/40"
        />
      )}

      {/* RIGHT SIDE PANEL */}
      <div
        className={`
      absolute inset-y-0 right-0 z-20 w-4/5 max-w-xs md:max-w-none
      transform transition-transform duration-300 ease-in-out
      ${isPanelOpen ? "translate-x-0" : "translate-x-full"}
      md:static md:translate-x-0 md:transition-none md:z-auto
      md:w-1/2 lg:w-2/5
      dark:bg-brand-500
      h-full bg-brand-100 lg:rounded-r-sm flex flex-col

    `}
      >
        <div className="relative lg:h-auto bg-brand-200 flex-wrap dark:bg-brand-800  py-2 flex flex-row gap-4 pl-4 pr-6 ">
          {categories.map((category) => (
            <button
              onClick={() => setActiveCategory(category)}
              className={`bg-brand-300 px-2 rounded-full py-0.5 capitalize text-sm font-medium whitespace-nowrap tracking-wide dark:text-background/70 dark:hover:text-foreground/80 text-foreground/90 cursor-pointer ${activeCategory === category ? "bg-brand-400 dark:text-foreground text-primary-foreground shadow-sm pointer-events-none" : "hover:bg-brand-400/70 hover:text-background/80 duration-75 ease-in-out transition-colors shadow-sm"}`}
              type="button"
              key={category}
            >
              {category.replaceAll("-", " ")}
            </button>
          ))}
          <button
            onClick={() => setIsPanelOpen(false)}
            className="md:hidden block md:pointer-events-none  absolute right-1 top-1  rounded-full border border-foreground/50 p-0.5 opacity-80"
          >
            <X size={14}></X>
          </button>
        </div>

        <div className="flex flex-1 min-h-0 flex-col gap-2 justify-start p-3 overflow-y-auto custom-scroll  ">
          {activeCategory &&
            faqByCategory[activeCategory]?.map((entry, index) => (
              <button
                onClick={() => handleOnClickQuestion(entry)}
                className="bg-brand-200/70 cursor-pointer hover:bg-brand-200 transition-colors duration-150 text-left rounded-md w-full p-3 flex items-start gap-2"
                key={entry.id}
              >
                <span className="text-foreground/40 dark:text-background/40 text-xs font-medium pt-0.5 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-snug dark:text-background/80">
                  {entry.question}
                </span>
              </button>
            ))}
        </div>
      </div>
    </SectionLayout>
  );
}
