"use client";

import { satoshi, zentry } from "@/fonts/font";
import { getGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type TimeMap = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const TARGET_DATE = new Date("2025-12-10T09:00:00+05:30").getTime();

export const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState<TimeMap>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const distance = TARGET_DATE - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const gsap = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 70 },
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

  const timerBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#060606] px-6 pb-24 pt-12 text-white"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 text-center">
        <div className="space-y-4">
          <h2
            className={cn(
              "text-3xl font-semibold uppercase text-white sm:text-4xl md:text-5xl",
              zentry.className
            )}
          >
            Countdown to Cyberstrike Arena
          </h2>
          <p
            className={cn(
              "max-w-2xl text-base text-gray-300 sm:text-lg",
              satoshi.className
            )}
          >
            Circle 10 December on your calendar. That&apos;s when the outage
            becomes real and the city joins us inside the simulation.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          {timerBlocks.map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-500/40 bg-black/40 px-4 py-8 shadow-[0_14px_40px_rgba(0,0,0,0.45)]"
            >
              <span
                className={cn(
                  "text-4xl font-semibold text-white sm:text-5xl",
                  zentry.className
                )}
              >
                {value.toString().padStart(2, "0")}
              </span>
              <span className="text-xs uppercase tracking-[0.45em] text-gray-400">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};