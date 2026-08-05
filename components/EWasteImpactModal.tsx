"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Recycle, Users, Building, Trophy, TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// CountUp Helper for animated numbers
function CountUp({ end, duration = 1200, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easedProgress * end);
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  const formattedValue = Number.isInteger(end)
    ? Math.round(count).toLocaleString()
    : count.toFixed(1);

  return <span>{formattedValue}{suffix}</span>;
}

// Fallback Mock Data matching ewaste-26
const DEFAULT_TOP_CONTRIBUTORS = [
  { rank: 1, name: "Rudra Sharma", wasteWeight: 85.5, medal: "🥇" },
  { rank: 2, name: "Vaishnovee Iyer", wasteWeight: 72.3, medal: "🥈" },
  { rank: 3, name: "Nigel D'Souza", wasteWeight: 68.0, medal: "🥉" },
];

const TARGET_GOAL_KG = 3000;

export default function EWasteImpactModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Convex Data Queries
  const statsData = useQuery(api.ewaste.getEwasteStats);
  const topFiveData = useQuery(api.ewaste.getTopFive);

  // Use real Convex data only — no fake fallbacks
  const stats = useMemo(() => {
    return {
      totalWeight: statsData?.totalWeight ?? 0,
      individualCount: statsData?.individualCount ?? 0,
      organizationCount: statsData?.organizationCount ?? 0,
    };
  }, [statsData]);

  // Use real top contributors from Convex (show whatever exists, even if < 3)
  const topContributors = useMemo(() => {
    if (topFiveData?.individuals && topFiveData.individuals.length > 0) {
      return topFiveData.individuals.slice(0, 3).map((item, idx) => ({
        rank: idx + 1,
        name: item.name,
        wasteWeight: item.wasteWeight,
        medal: idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉",
      }));
    }
    return [];
  }, [topFiveData]);

  // Check LocalStorage & Trigger 2s Delay
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Expose reset helper on window object for testing / manual reset
      (window as any).resetEWasteModal = () => {
        localStorage.removeItem("dcc_ewaste_modal_dont_show");
        localStorage.removeItem("dcc_ewaste_modal_seen");
        sessionStorage.removeItem("dcc_ewaste_modal_seen");
        console.log("EWasteImpactModal state reset!");
        window.location.reload();
      };
    }

    const isDismissed = localStorage.getItem("dcc_ewaste_modal_dont_show") === "true";

    if (isDismissed) {
      return;
    }

    setOpen(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleDontShowChange = (checked: boolean) => {
    setDontShowAgain(checked);
    if (checked) {
      localStorage.setItem("dcc_ewaste_modal_dont_show", "true");
    } else {
      localStorage.removeItem("dcc_ewaste_modal_dont_show");
    }
  };

  const handleExplore = () => {
    setOpen(false);
    router.push("/ewaste-26");
  };

  const progressPercentage = Math.min((stats.totalWeight / TARGET_GOAL_KG) * 100, 100);
  const maxContributorWeight = topContributors[0]?.wasteWeight || 100;

  // Variants for Framer Motion
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "sm:max-w-[540px] max-w-[92vw] p-5 sm:p-7 rounded-[32px]",
          "bg-black/85 backdrop-blur-2xl border border-white/15",
          "shadow-[0_0_80px_rgba(0,0,0,0.95)] text-white focus:outline-none",
          "max-h-[85vh] flex flex-col justify-between overflow-hidden z-[100000]"
        )}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 sm:space-y-5 overflow-y-auto pr-1 custom-scrollbar"
        >
          {/* Compact Header */}
          <DialogHeader className="text-center sm:text-center space-y-1.5 pt-0">
            <motion.div variants={itemVariants} className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-white/5 text-neutral-300 border border-white/10">
                <Recycle className="w-3 h-3 text-emerald-400 animate-spin-slow" />
                E-Waste Collection Drive
              </span>
            </motion.div>

            <DialogTitle asChild>
              <motion.h2
                variants={itemVariants}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight"
              >
                Our Environmental Impact 🌍
              </motion.h2>
            </DialogTitle>

            <DialogDescription asChild>
              <motion.p
                variants={itemVariants}
                className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-normal font-normal"
              >
                Join our mission to build a cleaner community through responsible recycling.
              </motion.p>
            </DialogDescription>
          </DialogHeader>

          {/* Compact Key Impact Stats Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 sm:p-4"
          >
            {/* Primary Focus: Total Collected Hero Metric */}
            <div className="text-center pb-2.5 mb-2.5 border-b border-white/10">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-0.5">
                <Recycle className="w-3 h-3 text-emerald-400" />
                <span>Total Collected</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
                <CountUp end={stats.totalWeight} suffix=" kg" />
              </div>
            </div>

            {/* Sub Stats: Individuals & Organizations */}
            <div className="grid grid-cols-2 divide-x divide-white/10 text-center">
              <div className="px-2">
                <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-400 font-medium mb-0.5">
                  <Users className="w-3 h-3 text-neutral-400" />
                  <span>Individuals</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-neutral-100">
                  <CountUp end={stats.individualCount} />
                </p>
              </div>

              <div className="px-2">
                <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-400 font-medium mb-0.5">
                  <Building className="w-3 h-3 text-neutral-400" />
                  <span>Organizations</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-neutral-100">
                  <CountUp end={stats.organizationCount} />
                </p>
              </div>
            </div>
          </motion.div>

          {/* Compact Top 3 Contributors Leaderboard Section */}
          <motion.div variants={itemVariants} className="space-y-2.5">
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Top 3 Individual Contributors</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-medium bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                Drive &apos;26
              </span>
            </div>

            <div className="space-y-2.5 pt-0.5">
              {topContributors.map((user, idx) => {
                const relativeWidth = Math.max((user.wasteWeight / maxContributorWeight) * 100, 15);
                const initials = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + idx * 0.06, duration: 0.25 }}
                    className="space-y-1.5"
                  >
                    {/* Top Row: Medal + Avatar + Name | Weight */}
                    <div className="flex items-center justify-between text-xs sm:text-sm flex-nowrap">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm leading-none">{user.medal}</span>
                        <div className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[10px] font-bold text-neutral-200 shrink-0">
                          {initials}
                        </div>
                        <span className="font-semibold text-neutral-200 text-xs sm:text-sm truncate whitespace-nowrap">
                          {user.name}
                        </span>
                      </div>
                      <span className="font-bold text-emerald-400 text-xs sm:text-sm shrink-0 ml-2 whitespace-nowrap">
                        {user.wasteWeight} kg
                      </span>
                    </div>

                    {/* Progress Bar below row */}
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${relativeWidth}%` }}
                        transition={{ duration: 0.7, delay: 0.2 + idx * 0.08, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Compact Collection Progress Section */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Collection Goal</span>
              </div>
              <span className="text-sm font-extrabold text-emerald-400">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>

            {/* Compact Progress Bar */}
            <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 px-0.5">
              <span>
                Collected: <strong className="text-neutral-200 font-semibold">{stats.totalWeight.toLocaleString()} kg</strong>
              </span>
              <span>
                Goal: <strong className="text-neutral-200 font-semibold">{TARGET_GOAL_KG.toLocaleString()} kg</strong>
              </span>
            </div>
          </motion.div>

          {/* Footer Helper Note */}
          <motion.p
            variants={itemVariants}
            className="text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1 pt-0.5"
          >
            🌱 Every device recycled helps build a cleaner and greener future.
          </motion.p>

          {/* Compact CTA & Checkbox Container */}
          <motion.div variants={itemVariants} className="space-y-2.5 pt-1">
            <button
              onClick={handleExplore}
              className={cn(
                "w-full py-3 sm:py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white",
                "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500",
                "hover:from-emerald-500 hover:to-teal-400",
                "shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.5)]",
                "hover:scale-[1.01] active:scale-[0.99]",
                "transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              )}
            >
              <span>Explore E-Waste Drive</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Don't Show Again Checkbox */}
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
              <Checkbox
                id="dont-show"
                checked={dontShowAgain}
                onCheckedChange={(checked) => handleDontShowChange(Boolean(checked))}
                className="border-neutral-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <label
                htmlFor="dont-show"
                className="cursor-pointer select-none text-[11px] sm:text-xs text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                Don&apos;t show this again
              </label>
            </div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
