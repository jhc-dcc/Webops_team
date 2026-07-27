"use client";

import { zentry } from "@/fonts/font";
import { getGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { BackgroundPaths } from "@/components/ui/background-paths"


export function DemoBackgroundPaths() {
  return <BackgroundPaths title="Background Paths" />
}

export const IntroSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  const gsap = getGsap();
  if (!sectionRef.current || !gsap) return;

  const ctx = gsap.context(() => {
    const headingLines =
    sectionRef.current?.querySelectorAll(".cyberstrike-line");

    if (!headingLines) return;

    gsap.set(headingLines, { opacity: 0, yPercent: 110 });

    gsap
    .timeline({ delay: 0.2 })
    .to(headingLines, {
      opacity: 1,
      yPercent: 0,
      duration: 0.85,
      ease: "power3.out",
      stagger: 0.12,
    })
    .from(
      ".cyberstrike-tagline",
      {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: "power3.out",
      },
      "-=0.35"
    )
    .from(
      [".cyberstrike-meta", ".cyberstrike-scroll"],
      {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
      },
      "-=0.25"
    );
  }, sectionRef);

  return () => ctx.revert();
  }, []);

  return (
  <section
    ref={sectionRef}
    className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-6 py-24 text-white"
  >
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div className="h-[520px] w-[520px] rounded-full border border-red-500/10 opacity-10" />
    <div className="absolute h-[720px] w-[720px] rounded-full border border-red-500/5 opacity-5" />
    </div>

    <div className="relative z-[1] mx-auto flex w-full max-w-5xl flex-col items-center text-center">
    <span className="cyberstrike-meta mb-6 text-base uppercase tracking-[0.6em] text-red-400/80">
      Dot Com Club Presents
    </span>

    <h1
      className={cn(
      "flex flex-wrap items-center justify-center gap-4 text-[100px] font-bold text-white sm:text-[110px] md:text-[115px] lg:text-[135px]",
      zentry.className
      )}
    >
      <div>
      <span className="cyberstrike-line inline-block">CYBERSTRIKE</span>
      </div>
      <div>
      <span className="cyberstrike-line inline-block text-red-500">
      25
      </span>
      </div>
    </h1>


    <div className="cyberstrike-scroll mt-20 flex flex-col items-center gap-3 text-base uppercase tracking-[0.3em] text-gray-400">
      <span>Scroll to reveal this year&apos;s mystery</span>
      <div className="h-12 w-px bg-red-500/50" />
    </div>
    </div>
  </section>
  );
};

