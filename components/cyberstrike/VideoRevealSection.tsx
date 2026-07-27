"use client";

import { satoshi, zentry } from "@/fonts/font";
import { getGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef } from "react";

const VIDEO_ID = "k85mRPqvMbE"; // Placeholder trailer, replace with official link when ready.

export const VideoRevealSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const gsap = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black px-6 py-24 text-white"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="space-y-4 text-center">
          <h2
            className={cn(
              "text-3xl font-semibold text-white sm:text-4xl md:text-5xl",
              zentry.className
            )}
          >
            Witness the Breakdown
          </h2>
          <p
            className={cn(
              "mx-auto max-w-2xl text-base text-gray-300 sm:text-lg",
              satoshi.className
            )}
          >
            Dive into the teaser for Cyberstrike 25. Every frame carries a hint,
            every flicker is a breadcrumb for those who can decode failure.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-red-500/30 bg-[#080808] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=0&rel=0&modestbranding=1`}
              title="Cyberstrike 25 Teaser"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 text-sm uppercase tracking-[0.35em] text-gray-400 md:flex-row">
          <span>Systems compromised for 2025</span>
          <Link
            href="/events"
            className="rounded-full border border-red-500/60 px-6 py-3 text-xs font-semibold tracking-[0.4em] text-red-400 transition-colors duration-300 hover:border-red-400 hover:text-white"
          >
            Explore Events
          </Link>
        </div>
      </div>
    </section>
  );
};