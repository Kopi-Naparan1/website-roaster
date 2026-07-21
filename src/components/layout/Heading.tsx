"use client";

import Logo from "../../../public/vex/vex-logo.webp";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  getNavigationForThePage,
  useNavigationClick,
} from "../layout/navigationUtility";

export default function Heading() {
  const { activeNavigationButton, handleNavigationButtonClick } =
    useNavigationClick();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const currentNav = getNavigationForThePage(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pathname]);

  return (
    <div
      className={`mobileHeadingLayout md:desktopHeadingLayout fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-opacity min-h-[5vh] duration-200 ease-in-out dark:bg-brand-700 bg-brand-100 ${scrolled ? "md:opacity-60" : "md:opacity-100"}`}
    >
      <Link
        href={"/"}
        className=" hover:opacity-70 duration-75 ease-in-out transition-opacity cursor-pointer  py-1 flex flex-row justify-center items-center "
      >
        <div className="relative w-8 h-8 md:w-8 md:h-6 lg:w-10 lg:h-9">
          <Image height={34} width={38} alt="Vex Logo Image" src={Logo}></Image>
        </div>
        <span className="tracking-tight md:text-xs font-bold flex ">Vex</span>
      </Link>
      <ul className="hidden md:flex flex-row md:gap-4 l xl:gap-6">
        {currentNav.map((nav) => {
          return (
            <li key={nav.label}>
              <Link
                href={nav.link}
                onClick={(e) =>
                  handleNavigationButtonClick(e, nav.label, nav.link)
                }
                className={`md:text-sm cursor-pointer  rounded-sm px-2 border transition-all duration-75 ease-in-out border-brand-400/0 py-1 ${activeNavigationButton === nav.label ? "dark:bg-brand-600  bg-brand-300" : "dark:hover:border-brand-400 hover:border-brand-200"}`}
              >
                {nav.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        className="md:hidden "
        aria-label="Open Menu"
        onClick={() => setMenuOpen(true)}
      >
        <Menu size={24}></Menu>
      </button>

      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-64 bg-brand-100  dark:bg-brand-700  z-50 flex flex-col p-6 transition-transform duration-200 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="self-end mb-6"
          aria-label="Close menu"
        >
          <X size={24}></X>
        </button>
        <ul className="flex flex-col gap-8">
          {currentNav.map((nav) => {
            return (
              <li key={nav.label}>
                <Link
                  href={nav.link}
                  onClick={(e) => {
                    handleNavigationButtonClick(e, nav.label, nav.link);
                    setMenuOpen(false);
                  }}
                  className={`text-lg cursor-pointer w-full flex justify-center items-center  rounded-sm px-2 border transition-all duration-75 ease-in-out border-brand-400/0 py-1 ${activeNavigationButton === nav.label ? "dark:bg-brand-600  bg-brand-300" : "dark:hover:border-brand-400 hover:border-brand-200"}`}
                >
                  {nav.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
