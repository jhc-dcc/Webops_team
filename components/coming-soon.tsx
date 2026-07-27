"use client";

import { satoshi, zentry } from "@/fonts/font";
import { cn } from "@/lib/utils";

export const CommingSoon = () => {
  return (
    <div
      className={cn(
        "relative w-full h-screen flex flex-col items-center justify-center gradient-inferno-edge overflow-hidden",
        satoshi.className
      )}
    >
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      {/* Wrapper div with isolation to create a new stacking context */}
      <div className="relative z-10 isolation-auto text-center px-4">
        <h1
          className={cn(
            "text-7xl md:text-9xl font-bold mb-6 mix-blend-difference",
            zentry.className
          )}
        >
          Coming Soon
        </h1>
        <p className="text-3xl md:text-3xl text-foreground/80 max-w-2xl mx-auto">
          We&apos;re working on something exciting! Our website is under
          construction.
        </p>
      </div>
    </div>
  );
};
