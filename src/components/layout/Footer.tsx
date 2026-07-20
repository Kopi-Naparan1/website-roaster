"use client";
import {
  getNavigationForThePage,
  useNavigationClick,
} from "../layout/navigationUtility";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";

import Link from "next/link";
import { useTheme } from "@/app/lib/useTheme";

export default function Footer() {
  const { activeNavigationButton, handleNavigationButtonClick } =
    useNavigationClick();

  const { isDark, toggleTheme } = useTheme();

  const pathname = usePathname();
  const currentNav = getNavigationForThePage(pathname);
  const router = useRouter();

  function handleGoToContactPage() {
    router.push("/contact");
  }

  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pathname]);

  return (
    <div
      className={`mobileHeadingLayout md:desktopHeadingLayout md:min-h-40 min-h-60 bg-brand-100 md:p-4 flex flex-col justify-center items-center dark:bg-brand-800`}
    >
      <ul className="flex flex-row md:gap-4 l xl:gap-6 mt-4 md:mt-2 flex-wrap md:flex-nowrap justify-center items-center ">
        {currentNav.map((nav) => {
          return (
            <li key={nav.label}>
              <Link
                href={nav.link}
                onClick={(e) =>
                  handleNavigationButtonClick(e, nav.label, nav.link)
                }
                className={`md:text-xs cursor-pointer  rounded-sm px-2 border transition-all duration-75 ease-in-out border-brand-400/0 py-1 ${activeNavigationButton === nav.label ? "dark:bg-brand-600  bg-brand-300" : "dark:hover:border-brand-400 hover:border-brand-200"}`}
              >
                {nav.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col justify-center items-center mt-6">
        <div className="flex flex-col justify-center items-center">
          <p className="text-sm underline">Kopi Anan Naparan</p>
          <p className="text-xs opacity-70">Developer</p>
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <a className="text-xs px-1 py-0.5 flex justify-center items-center  text-background bg-brand-400 rounded-sm hover:bg-brand-500 duration-75 ease-in-out transition-colors cursor-pointer">
            View GitHub Code Repo
          </a>
          <button
            type="button"
            onClick={handleGoToContactPage}
            className="text-xs dark:hover:text-background px-1 py-0.5 flex justify-center items-center text-foreground border border-brand-400 rounded-sm cursor-pointer hover:bg-brand-200 duration-75 ease-in-out transition-colors"
          >
            Contact Me
          </button>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="text-xs px-1 mt-4 py-0.5 flex dark:hover:text-background justify-center items-center text-foreground border border-brand-400 rounded-sm cursor-pointer hover:bg-brand-200 duration-75 ease-in-out transition-colors"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <p className="text-xs opacity-50 mt-6">
          © 2026 VEX. All rights reserved.
        </p>
      </div>
    </div>
  );
}
