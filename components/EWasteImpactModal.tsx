"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
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
import { Recycle, Users, Building, Trophy, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
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

  // Compute final stats with fallback
  const stats = useMemo(() => {
    if (statsData && statsData.totalWeight > 0) {
      return {
        totalWeight: statsData.totalWeight,
        individualCount: statsData.individualCount,
        organizationCount: statsData.organizationCount,
      };
    }
    return {
      totalWeight: 2304.1,
      individualCount: 13,
      organizationCount: 6,
    };
  }, [statsData]);

  // Compute top 3 contributors with fallback
  const topContributors = useMemo(() => {
    if (topFiveData?.individuals && topFiveData.individuals.length >= 3) {
      return topFiveData.individuals.slice(0, 3).map((item, idx) => ({
        rank: idx + 1,
        name: item.name,
        wasteWeight: item.wasteWeight,
        medal: idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉",
      }));
    }
    return DEFAULT_TOP_CONTRIBUTORS;
  }, [topFiveData]);

  // Check LocalStorage & Trigger 2s Delay
  useEffect(() => {
    const isDismissed = localStorage.getItem("dcc_ewaste_modal_dont_show") === "true";
    const hasBeenSeen = localStorage.getItem("dcc_ewaste_modal_seen") === "true";

    if (isDismissed || hasBeenSeen) {
      return;
    }

    const timer = setTimeout(() => {
      setOpen(true);
      localStorage.setItem("dcc_ewaste_modal_seen", "true");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
    hidden: { opacity: 0, scale: 0.92, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn(
        "sm:max-w-lg max-w-[92vw] p-6 sm:p-8 rounded-[32px]",
        "bg-neutral-950/95 border border-emerald-500/30",
        "shadow-[0_0_60px_rgba(16,185,129,0.18)] backdrop-blur-2xl",
        "text-white overflow-hidden max-h-[90vh] flex flex-col justify-between focus:outline-none"
      )}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5 overflow-y-auto pr-1 custom-scrollbar"
        >
          {/* Header */}
          <DialogHeader className="text-center sm:text-center space-y-2">
            <motion.div variants={itemVariants} className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Recycle className="w-3.5 h-3.5 animate-spin-slow" />
                E-Waste Collection Drive
              </span>
            </motion.div>

            <DialogTitle asChild>
              <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Our Environmental Impact 🌍
              </motion.h2>
            </DialogTitle>

            <DialogDescription asChild>
              <motion.p variants={itemVariants} className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto">
                Join our mission to build a greener and cleaner community through responsible recycling.
              </motion.p>
            </DialogDescription>
          </DialogHeader>

          {/* Stats Cards (3 Cards Grid) */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {/* Card 1: Individuals */}
            <div className="bg-neutral-900/60 border border-neutral-800/90 hover:border-emerald-500/30 rounded-2xl p-2.5 sm:p-3 text-center transition-all duration-300 group shadow-md">
              <div className="flex justify-center mb-1.5 text-emerald-400">
                <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-medium">Individuals</p>
              <p className="text-base sm:text-lg font-bold text-neutral-100 mt-0.5">
                <CountUp end={stats.individualCount} />
              </p>
            </div>

            {/* Card 2: Organizations */}
            <div className="bg-neutral-900/60 border border-neutral-800/90 hover:border-emerald-500/30 rounded-2xl p-2.5 sm:p-3 text-center transition-all duration-300 group shadow-md">
              <div className="flex justify-center mb-1.5 text-emerald-400">
                <Building className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-medium">Organizations</p>
              <p className="text-base sm:text-lg font-bold text-neutral-100 mt-0.5">
                <CountUp end={stats.organizationCount} />
              </p>
            </div>

            {/* Card 3: Total Collected */}
            <div className="bg-gradient-to-b from-emerald-950/40 to-neutral-900/60 border border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl p-2.5 sm:p-3 text-center transition-all duration-300 group shadow-md">
              <div className="flex justify-center mb-1.5 text-emerald-400">
                <Recycle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-medium">Total Collected</p>
              <p className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5">
                <CountUp end={stats.totalWeight} suffix=" kg" />
              </p>
            </div>
          </motion.div>

          {/* Leaderboard Section */}
          <motion.div variants={itemVariants} className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-3.5 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-200">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Top 3 Individual Contributors</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">Drive &apos;26</span>
            </div>

            <div className="space-y-2.5">
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
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.3 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm">{user.medal}</span>
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                          {initials}
                        </div>
                        <span className="font-semibold text-neutral-200 truncate max-w-[140px] sm:max-w-[180px]">{user.name}</span>
                      </div>
                      <span className="font-bold text-emerald-400">{user.wasteWeight} kg</span>
                    </div>

                    {/* Progress Bar relative to #1 */}
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${relativeWidth}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + idx * 0.1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Collection Progress Section */}
          <motion.div variants={itemVariants} className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-3.5 sm:p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-200">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Collection Progress</span>
              </div>
              <span className="text-emerald-400 font-extrabold">{progressPercentage.toFixed(1)}%</span>
            </div>

            {/* Main Animated Progress Bar */}
            <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-neutral-700/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
              <span>Collected: <strong className="text-neutral-200">{stats.totalWeight.toLocaleString()} kg</strong></span>
              <span>Goal: <strong className="text-neutral-200">{TARGET_GOAL_KG.toLocaleString()} kg</strong></span>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.p variants={itemVariants} className="text-center text-[11px] sm:text-xs text-neutral-400 flex items-center justify-center gap-1 pt-1">
            🌱 Every device recycled helps build a cleaner and greener future.
          </motion.p>

          {/* CTA & Checkbox Container */}
          <motion.div variants={itemVariants} className="space-y-3 pt-2">
            <button
              onClick={handleExplore}
              className={cn(
                "w-full py-3 px-6 rounded-full font-bold text-sm text-white",
                "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
                "shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40",
                "transition-all duration-300 flex items-center justify-center gap-2 group"
              )}
            >
              <span>♻ Explore E-Waste Drive</span>
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
              <label htmlFor="dont-show" className="cursor-pointer select-none text-[11px] text-neutral-400 hover:text-neutral-300">
                Don&apos;t show this again
              </label>
            </div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
