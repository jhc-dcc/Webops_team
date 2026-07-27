"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  layoutId?: string;
  className?: string;
  activeBgClass?: string;
  activeTextColorClass?: string;
  inactiveTextColorClass?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  layoutId = "segmented-control-active-pill",
  className,
  activeBgClass = "bg-emerald-500 shadow-md shadow-emerald-500/20",
  activeTextColorClass = "text-neutral-950 font-bold",
  inactiveTextColorClass = "text-neutral-400 hover:text-neutral-200",
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "relative flex items-center bg-neutral-950 p-1 rounded-2xl border border-neutral-900 min-w-0 select-none",
        className
      )}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex-1 sm:flex-initial min-w-0 px-3 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-colors duration-100 flex items-center justify-center gap-1 sm:gap-2 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
              isActive ? activeTextColorClass : inactiveTextColorClass
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={cn("absolute inset-0 rounded-xl", activeBgClass)}
                transition={{
                  duration: 0.1, // 100ms transition
                  ease: "easeInOut",
                }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 truncate">
              {option.icon}
              <span>{option.label}</span>
              {option.count !== undefined && (
                <span className="opacity-90">({option.count})</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
