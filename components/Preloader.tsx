"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface PreloaderProps {
  onComplete: () => void;
  heroRef: React.RefObject<HTMLDivElement>;
}

export function Preloader({ onComplete, heroRef }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || !topRef.current || !bottomRef.current || !heroRef.current || !titleRef.current) {
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    timeline
      .set(heroRef.current, { opacity: 0, y: 40 })
      .set([topRef.current, bottomRef.current, titleRef.current], { opacity: 0, y: 20 })
      .to(titleRef.current, { opacity: 1, y: 0, duration: 0.85, ease: "power4.out" }, 0)
      .to(titleRef.current, { opacity: 0, duration: 0.25, ease: "power2.inOut" }, 0.8)
      .to(topRef.current, { yPercent: -110, duration: 0.9, ease: "power4.inOut" }, 0.9)
      .to(bottomRef.current, { yPercent: 110, duration: 0.9, ease: "power4.inOut" }, 0.9)
      .to(
        heroRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power4.out",
        },
        1.05
      )
      .to(containerRef.current, { autoAlpha: 0, duration: 0.2, ease: "power1.out" }, 1.55)
      .call(onComplete, [], 1.7);

    return () => {
      timeline.kill();
    };
  }, [heroRef, onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] overflow-hidden bg-[#0f9d58]">
      <div ref={topRef} className="absolute inset-x-0 top-0 h-1/2 bg-[#0f9d58]" />
      <div ref={bottomRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0d7f44]" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div ref={titleRef} className="text-center max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/80 mb-4">
            DCC E-Waste
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
            E-Waste 2026
          </h1>
          <p className="mt-4 text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto">
            A cinematic reveal for the future of electronics recycling.
          </p>
        </div>
      </div>
    </div>
  );
}
