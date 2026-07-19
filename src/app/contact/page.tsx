"use client";
import SectionLayout from "@/components/ui/Section";
import { useState, useEffect, useRef } from "react";
import Tip from "./Tip";

type FloatingInputProps = {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function FloatingInput({
  name,
  label,
  type = "text",
  value,
  onChange,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative w-full">
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full h-12 bg-secondary rounded-lg px-4 pt-4 text-heading outline-none border-2 border-transparent focus:border-primary transition-all duration-200"
      />
      <label
        htmlFor={name}
        className={`absolute left-4 transition-all duration-200 pointer-events-none text-subtext
          ${isFloating ? "top-1 text-[10px] font-semibold text-primary" : "top-3 text-[14px]"}`}
      >
        {label}
      </label>
    </div>
  );
}

type FloatingTextareaProps = {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

function FloatingTextarea({
  name,
  label,
  value,
  onChange,
}: FloatingTextareaProps) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative w-full h-full">
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full h-full bg-secondary rounded-lg px-4 pt-6 text-heading outline-none border-2 border-transparent focus:border-primary transition-all duration-200 resize-none"
      />
      <label
        htmlFor={name}
        className={`absolute left-4 transition-all duration-200 pointer-events-none text-subtext
          ${isFloating ? "top-1 text-[10px] font-semibold text-primary" : "top-3 text-[14px]"}`}
      >
        {label}
      </label>
    </div>
  );
}

type FormState = {
  name: string;
  email: string;
  message: string;
};

const EMPTY_FORM: FormState = { name: "", email: "", message: "" };

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [indicator, setIndicator] = useState("Send");
  const [status, setStatus] = useState<Status>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetIndicator() {
    timeoutRef.current = setTimeout(() => {
      setStatus("idle");
      setIndicator("Send");
    }, 2500);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      setIndicator("Fill all fields");
      resetIndicator();
      return;
    }

    if (!EMAIL_REGEX.test(form.email)) {
      setStatus("error");
      setIndicator("Invalid email");
      resetIndicator();
      return;
    }

    setIndicator("Sending...");
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setStatus("success");
        setIndicator("Sent!");
        setForm(EMPTY_FORM);
        resetIndicator();
      } else {
        setStatus("error");
        setIndicator("Try Again");
        resetIndicator();
      }
    } catch {
      setStatus("error");
      setIndicator("Try Again");
      resetIndicator();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-120 md:max-w-130 mx-auto bg-brand-200 rounded-lg flex flex-col py-6 px-5 gap-4 shadow-md"
    >
      <h3 className="text-sm font-bold text-center opacity-80 text-foreground">
        Please not the &apos;Add dark mode!&apos;
      </h3>

      <div className="flex flex-col gap-3">
        <FloatingInput
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
        />
        <FloatingInput
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="h-62.5">
        <FloatingTextarea
          name="message"
          label="Message"
          value={form.message}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={status === "loading"}
          aria-live="polite"
          className="bg-primary text-background border-2 border-transparent hover:border-primary font-jakarta text-heading font-semibold py-2 px-6 rounded-lg hover:bg-primary/70 hover:text-background/80 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-50"
        >
          {indicator}
        </button>
      </div>
    </form>
  );
}

export default function Contact() {
  return (
    <>
      <SectionLayout
        sectionType="contact"
        heading="Talk to the Human Behind the Roasts"
        className="mt-[5vh]"
        headingAndSubHeadingClassName="flex flex-col justify-center items-center text-center"
        subHeading="Suggestions, feedback, or portfolio inquiries — all welcome."
      >
        <div>
          <ContactForm></ContactForm>
        </div>
      </SectionLayout>
      <Tip></Tip>
    </>
  );
}
