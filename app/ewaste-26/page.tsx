"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Recycle,
  Users,
  TrendingUp,
  Award,
  Crown,
  Medal,
  ChevronRight,
  Laptop,
  Smartphone,
  Monitor,
  Cable,
  Cpu,
  Building,
  Calendar,
  Layers
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line
} from "recharts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SegmentedControl } from "@/components/ui/segmented-control";

// ==========================================
// CHART CONFIGURATION
// ==========================================
const CHART_TOOLTIP_CONTENT_STYLE = {
  background: "#0a0a0a",
  borderColor: "#1f1f1f",
  borderRadius: "12px",
  fontSize: "11px",
  color: "#f5f5f5",
  padding: "8px 10px",
  lineHeight: 1.25,
};

const CHART_TOOLTIP_LABEL_STYLE = {
  margin: 0,
  padding: 0,
  lineHeight: 1.2,
};

const CHART_TOOLTIP_ITEM_STYLE = {
  margin: 0,
  padding: 0,
  lineHeight: 1.2,
};

// ==========================================
// UNIFIED ENTRY INTERFACE
// ==========================================
interface UnifiedEntry {
  rank: number;
  name: string;
  weight: number;
  category: string;
  submittedAt: number;
  isOrg: boolean;
  extraInfo?: string;
}

// ==========================================
// COUNT UP ANIMATION COMPONENT
// ==========================================
function CountUp({ end, duration = 1500, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  const formattedValue = Number.isInteger(end)
      ? Math.round(count).toLocaleString()
      : count.toFixed(1);

  return <span>{formattedValue}{suffix}</span>;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
const getInitials = (name: string) => {
  if (!name) return "";
  return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
};

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case "laptop":
      return <Laptop className="w-3.5 h-3.5" />;
    case "mobile":
      return <Smartphone className="w-3.5 h-3.5" />;
    case "monitor":
    case "screen":
      return <Monitor className="w-3.5 h-3.5" />;
    case "cables":
      return <Cable className="w-3.5 h-3.5" />;
    case "keyboard":
      return <Cpu className="w-3.5 h-3.5" />;
    default:
      return <Layers className="w-3.5 h-3.5" />;
  }
};

// ==========================================
// GALLERY COMPONENT
// ==========================================
function ParallaxGallery() {
  const galleryImages = [
    {
      id: 1,
      url: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnd3RFIksKPl6IUv1HWzAVsEdC935ahDBwYLZ7",
      title: "E-Waste Collection Drive 2024",
      description: "Students actively participating in our previous drive",
    },
    {
      id: 55,
      url: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnIhUMjvPl5jBct46VPznEMd1hQDgXqiTmby29",
      title: "Massive Collection Success",
      description: "Our collection bins overflowing with donated electronics",
    },
    {
      id: 2,
      url: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnIhUMjvPl5jBct46VPznEMd1hQDgXqiTmby29",
      title: "Massive Collection Success",
      description: "Our collection bins overflowing with donated electronics",
    },
    {
      id: 3,
      url: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnO5tblcVjRsp9kwWCv5hnx4u2tP6JbTKoyUBZ",
      title: "E-Waste Awareness Session",
      description: "Students attending the e-waste awareness event.",
    },
    {
      id: 4,
      url: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnY7C0CXTxmECjQ4LzHrfNJSbP68dyVOeWiMAX",
      title: "Fun Games",
      description: "Guess the ewaste in the box",
    },
    {
      id: 5,
      url: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnO5tblcVjRsp9kwWCv5hnx4u2tP6JbTKoyUBZ",
      title: "Green India Seminar",
      description: "Seminar by Green India to speread awareness about e-waste",
    },
    {
      id: 6,
      url: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnAcQDDgCRIJ5vGjLaBkpyl7AEdowO8PDKCesr",
      title: "Campus Transformation",
      description: "The remarkable transformation achieved",
    },
  ];

  return (
      <div className="relative py-16 md:py-24 bg-neutral-950 border-t border-neutral-900">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
              Gallery Archive
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-neutral-100">
              E-Waste Drive Gallery
            </h2>
            <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
              Witness the journey of environmental transformation through past drives.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
              {/* Large image - spans 2 columns */}
              <div className="lg:col-span-2 lg:row-span-2">
                <div className="relative group overflow-hidden rounded-3xl shadow-lg border border-neutral-900 bg-neutral-900/40">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                        src={galleryImages[6].url || "/placeholder.svg"}
                        alt={galleryImages[6].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg font-bold mb-1">
                        {galleryImages[6].title}
                      </h3>
                      <p className="text-xs text-neutral-300">
                        {galleryImages[6].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small image */}
              <div className="lg:col-span-1">
                <div className="relative group overflow-hidden rounded-3xl shadow-lg border border-neutral-900 bg-neutral-900/40">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                        src={galleryImages[1].url || "/placeholder.svg"}
                        alt={galleryImages[1].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-base font-bold mb-1">
                        {galleryImages[1].title}
                      </h3>
                      <p className="text-xs text-neutral-300">
                        {galleryImages[1].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medium image */}
              <div className="lg:col-span-1">
                <div className="relative group overflow-hidden rounded-3xl shadow-lg border border-neutral-900 bg-neutral-900/40">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                        src={galleryImages[2].url || "/placeholder.svg"}
                        alt={galleryImages[2].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-base font-bold mb-1">
                        {galleryImages[2].title}
                      </h3>
                      <p className="text-xs text-neutral-300">
                        {galleryImages[2].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small image */}
              <div className="lg:col-span-1">
                <div className="relative group overflow-hidden rounded-3xl shadow-lg border border-neutral-900 bg-neutral-900/40">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                        src={galleryImages[3].url || "/placeholder.svg"}
                        alt={galleryImages[3].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-base font-bold mb-1">
                        {galleryImages[3].title}
                      </h3>
                      <p className="text-xs text-neutral-300">
                        {galleryImages[3].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Large horizontal image - spans 2 columns */}
              <div className="lg:col-span-2">
                <div className="relative group overflow-hidden rounded-3xl shadow-lg border border-neutral-900 bg-neutral-900/40">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img
                        src={galleryImages[4].url || "/placeholder.svg"}
                        alt={galleryImages[4].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg font-bold mb-2">
                        {galleryImages[4].title}
                      </h3>
                      <p className="text-xs text-neutral-300">
                        {galleryImages[4].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medium vertical image */}
              <div className="lg:col-span-1">
                <div className="relative group overflow-hidden rounded-3xl shadow-lg border border-neutral-900 bg-neutral-900/40">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                        src={galleryImages[5].url || "/placeholder.svg"}
                        alt={galleryImages[5].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-base font-bold mb-1">
                        {galleryImages[5].title}
                      </h3>
                      <p className="text-xs text-neutral-300">
                        {galleryImages[5].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function EWasteDrive2026() {
  const [activeTab, setActiveTab] = useState<"individuals" | "organizations">("individuals");
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Setup SSR check to avoid hydration issues with recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  // ==========================================
  // LIVE CONVEX DATA
  // ==========================================
  const individualsData = useQuery(
      api.ewaste.getIndividualLeaderboard,
      { limit: 100 }
  );

  const organizationsData = useQuery(
      api.ewaste.getOrganizationLeaderboard,
      { limit: 100 }
  );

  const statsData = useQuery(api.ewaste.getEwasteStats);

  // Convex returns undefined while a query is loading.
  const isLeaderboardLoading =
      individualsData === undefined ||
      organizationsData === undefined ||
      statsData === undefined;

  // Convert live individual records into the format used by the existing UI.
  const individuals = useMemo<UnifiedEntry[]>(() => {
    if (!individualsData) return [];

    return individualsData.map((item, index) => ({
      rank: item.rank ?? index + 1,
      name: item.name,
      weight: item.wasteWeight,
      category: item.wasteTypes?.[0] || "Mixed Waste",
      submittedAt: item.submittedAt,
      isOrg: false,
    }));
  }, [individualsData]);

  // Convert live organization records into the same UI format.
  const organizations = useMemo<UnifiedEntry[]>(() => {
    if (!organizationsData) return [];

    return organizationsData.map((item, index) => ({
      rank: item.rank ?? index + 1,
      name: item.organizationName,
      weight: item.totalWeight,
      category: "Organization",
      submittedAt: item.lastSubmission,
      isOrg: true,
      extraInfo: `${item.entries} ${item.entries === 1 ? "entry" : "entries"}`,
    }));
  }, [organizationsData]);

  const stats = useMemo(
      () =>
          statsData ?? {
            totalWeight: 0,
            individualCount: 0,
            organizationCount: 0,
          },
      [statsData]
  );

  // Build the device-type chart from live individual records.
  // When an entry has several waste types, its weight is divided equally
  // so the same contribution is not counted multiple times.
  const deviceData = useMemo(() => {
    const totals = new Map<string, number>();
    const colors = ["#10B981", "#059669", "#34D399", "#6EE7B7", "#A7F3D0"];

    for (const item of individualsData ?? []) {
      const wasteTypes =
          item.wasteTypes && item.wasteTypes.length > 0
              ? item.wasteTypes
              : ["Other"];

      const distributedWeight = item.wasteWeight / wasteTypes.length;

      for (const wasteType of wasteTypes) {
        const label = wasteType.trim() || "Other";
        totals.set(label, (totals.get(label) ?? 0) + distributedWeight);
      }
    }

    const sorted = Array.from(totals.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const totalWeight = sorted.reduce((sum, [, weight]) => sum + weight, 0);

    return sorted.map(([name, weight], index) => ({
      name,
      value:
          totalWeight > 0
              ? Number(((weight / totalWeight) * 100).toFixed(1))
              : 0,
      color: colors[index % colors.length],
    }));
  }, [individualsData]);

  // Keep the same horizontal bar-chart design using live Convex totals.
  const departmentData = useMemo(
      () => [
        {
          name: "Individuals",
          weight: individuals.reduce((sum, item) => sum + item.weight, 0),
        },
        {
          name: "Organizations",
          weight: organizations.reduce((sum, item) => sum + item.weight, 0),
        },
      ],
      [individuals, organizations]
  );

  // Build a lightweight live trend using the dates returned by Convex.
  const trendData = useMemo(() => {
    const dailyTotals = new Map<string, number>();

    for (const item of [...individuals, ...organizations]) {
      if (!Number.isFinite(item.submittedAt)) continue;

      const date = new Date(item.submittedAt);
      if (Number.isNaN(date.getTime())) continue;

      const key = date.toISOString().slice(0, 10);
      dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + item.weight);
    }

    return Array.from(dailyTotals.entries())
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .slice(-8)
        .map(([date, weight]) => ({
          date: new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
          weight: Number(weight.toFixed(1)),
        }));
  }, [individuals, organizations]);

  // Extract Podium & List items
  const podiumItems = useMemo<UnifiedEntry[]>(() => {
    const list = activeTab === "individuals" ? individuals : organizations;
    return list.slice(0, 3);
  }, [activeTab, individuals, organizations]);

  const listItems = useMemo<UnifiedEntry[]>(() => {
    const list = activeTab === "individuals" ? individuals : organizations;
    const offset = 3;
    return isExpanded ? list.slice(offset) : list.slice(offset, 10);
  }, [activeTab, individuals, organizations, isExpanded]);

  const hasMoreItems = useMemo(() => {
    const list = activeTab === "individuals" ? individuals : organizations;
    return list.length > 10;
  }, [activeTab, individuals, organizations]);

  return (
      <div className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#050505] text-neutral-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        {/* Modern Premium Background Layer System */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          {/* 1. Subtle 1px grid pattern (1.5-2% opacity) */}
          <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
                backgroundSize: "40px 40px"
              }}
          />

          {/* 2. Fine grain/noise texture overlay (2% opacity) */}
          <div
              className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}
          />

          {/* 3. Soft vignette overlay keeping deep pitch black edges */}
          <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, transparent 40%, rgba(5, 5, 5, 0.95) 100%)"
              }}
          />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 min-h-[48vh] flex items-center justify-center pt-16 overflow-hidden border-b border-neutral-900">
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 scale-105 filter blur-[2px]"
              style={{
                backgroundImage: `url('https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnd3RFIksKPl6IUv1HWzAVsEdC935ahDBwYLZ7')`,
              }}
          />
          {/* Soft Dark Gradients Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />

          <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                Eco-Drive 2026
              </Badge>
            </motion.div>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent break-words"
            >
              E-WASTE DRIVE 2026
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-base md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed"
            >
              Track real-time contributions, ranked list, and collection analytics.
              Join our effort to responsibly recycle old electronics.
            </motion.p>
          </div>
        </section>

        {/* Main Leaderboard & Analytics Grid */}
        <section className="relative z-10 py-12 md:py-16 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-w-0">

              {/* LEFT COLUMN: LEADERBOARD (65% = lg:col-span-8) */}
              <div className="lg:col-span-8 space-y-8 min-w-0">

                {/* Tab Selector & Controls */}
                <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 bg-neutral-900/40 border border-neutral-900 rounded-3xl p-2.5 sm:p-3 backdrop-blur-md min-w-0">
                  <SegmentedControl
                      options={[
                        {
                          value: "individuals",
                          label: "Individuals",
                          count: stats.individualCount,
                          icon: <Users className="w-4 h-4" />,
                        },
                        {
                          value: "organizations",
                          label: "Organizations",
                          count: stats.organizationCount,
                          icon: <Building className="w-4 h-4" />,
                        },
                      ]}
                      value={activeTab}
                      onChange={(val) => {
                        setActiveTab(val as "individuals" | "organizations");
                        setIsExpanded(false);
                      }}
                      layoutId="ewaste-26-segmented-pill"
                  />
                </div>

                {/* PODIUM (Top 3 Contributors) */}
                <div className="w-full relative">
                  {/* Hero Podium Ambient Emerald Glow — Strongest focal spotlight */}
                  <div
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(650px,95%)] h-[400px] bg-emerald-500/25 rounded-full blur-[110px] z-0"
                      aria-hidden="true"
                  />

                  <div className="relative z-10">
                    {isLeaderboardLoading ? (
                        <div className="text-center py-16 bg-neutral-900/20 border border-neutral-900 rounded-3xl">
                          <Recycle className="w-12 h-12 text-emerald-500 mx-auto mb-4 animate-spin" />
                          <p className="text-neutral-400">Loading live leaderboard...</p>
                        </div>
                    ) : podiumItems.length === 0 ? (
                        <div className="text-center py-16 bg-neutral-900/20 border border-neutral-900 rounded-3xl">
                          <Recycle className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                          <p className="text-neutral-400">No verified entries recorded yet.</p>
                        </div>
                    ) : (
                        <>
                          {/* Podium (Ranks 2, 1, 3) — same layout on all screen sizes */}
                          <div className="grid grid-cols-3 gap-1.5 sm:gap-4 md:gap-6 items-end pt-8 sm:pt-10 md:pt-12 pb-2 min-w-0">

                            {/* 2nd Place */}
                            {podiumItems[1] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="flex flex-col items-center min-w-0"
                                >
                                  <div className="relative group w-full text-center flex flex-col items-center min-w-0">
                                    <div className="relative mb-2 sm:mb-3 md:mb-4">
                                      <div className="w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-neutral-900 border-2 border-neutral-700/60 overflow-hidden flex items-center justify-center text-xs sm:text-lg md:text-xl font-bold shadow-md shadow-neutral-950/50">
                                        {getInitials(podiumItems[1].name)}
                                      </div>
                                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-neutral-800 border border-neutral-700 p-0.5 sm:p-1.5 rounded-full text-slate-300 shadow-lg">
                                        <Medal className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                      </div>
                                    </div>

                                    <div className="text-[10px] sm:text-xs md:text-sm font-semibold truncate max-w-full px-1 sm:px-2 text-neutral-300">
                                      {podiumItems[1].name}
                                    </div>
                                    <div className="text-[9px] sm:text-xs text-neutral-500 mb-2 sm:mb-3 md:mb-4 flex items-center justify-center gap-0.5 sm:gap-1">
                                      <Recycle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500 shrink-0" />
                                      <span>2nd Rank</span>
                                    </div>

                                    {/* Podium Base */}
                                    <div className="w-full bg-gradient-to-b from-neutral-900/60 to-neutral-950/80 border border-neutral-900 rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl pt-4 sm:pt-8 md:pt-12 pb-3 sm:pb-5 md:pb-6 px-1 sm:px-3 md:px-4 shadow-xl flex flex-col items-center h-[72px] sm:h-[110px] md:h-[140px] justify-between">
                                      <div className="text-sm sm:text-lg md:text-2xl font-bold text-neutral-100 tracking-tight">
                                        <CountUp end={podiumItems[1].weight} suffix=" kg" />
                                      </div>
                                      <Badge className="bg-neutral-800 text-neutral-400 text-[8px] sm:text-[10px] font-medium border border-neutral-700/50 py-0.5 rounded-md truncate max-w-full">
                                        {podiumItems[1].category}
                                      </Badge>
                                    </div>
                                  </div>
                                </motion.div>
                            )}

                            {/* 1st Place (Center and slightly taller) */}
                            {podiumItems[0] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="flex flex-col items-center min-w-0"
                                >
                                  <div className="relative group w-full text-center flex flex-col items-center z-10 min-w-0">
                                    <div className="absolute -top-5 sm:-top-7 md:-top-10 text-amber-400 flex items-center justify-center animate-bounce">
                                      <Crown className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 fill-amber-400/20" />
                                    </div>

                                    <div className="relative mb-2 sm:mb-3 md:mb-4">
                                      <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-neutral-900 border-2 border-emerald-500/40 overflow-hidden flex items-center justify-center text-sm sm:text-xl md:text-2xl font-bold shadow-xl shadow-emerald-950/10">
                                        {getInitials(podiumItems[0].name)}
                                      </div>
                                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-emerald-500 border border-emerald-400 p-1 sm:p-2 rounded-full text-neutral-950 shadow-lg">
                                        <Crown className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-neutral-950" />
                                      </div>
                                    </div>

                                    <div className="text-[10px] sm:text-sm md:text-base font-bold truncate max-w-full px-1 sm:px-2 text-white">
                                      {podiumItems[0].name}
                                    </div>
                                    <div className="text-[9px] sm:text-xs text-emerald-400 mb-2 sm:mb-3 md:mb-4 flex items-center justify-center gap-0.5 sm:gap-1 font-semibold">
                                      <span>1st Rank</span>
                                    </div>

                                    {/* Podium Base */}
                                    <div className="w-full bg-gradient-to-b from-emerald-950/20 via-neutral-900/60 to-neutral-950/90 border border-emerald-500/20 rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl pt-5 sm:pt-10 md:pt-16 pb-3 sm:pb-6 md:pb-8 px-1 sm:px-3 md:px-4 shadow-2xl flex flex-col items-center h-[88px] sm:h-[130px] md:h-[180px] justify-between relative overflow-hidden">
                                      <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none" />
                                      <div className="text-base sm:text-2xl md:text-3xl font-extrabold text-emerald-400 tracking-tight">
                                        <CountUp end={podiumItems[0].weight} suffix=" kg" />
                                      </div>
                                      <Badge className="bg-emerald-500/10 text-emerald-400 text-[8px] sm:text-[10px] font-semibold border border-emerald-500/20 py-0.5 rounded-md truncate max-w-full">
                                        {podiumItems[0].category}
                                      </Badge>
                                    </div>
                                  </div>
                                </motion.div>
                            )}

                            {/* 3rd Place */}
                            {podiumItems[2] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="flex flex-col items-center min-w-0"
                                >
                                  <div className="relative group w-full text-center flex flex-col items-center min-w-0">
                                    <div className="relative mb-2 sm:mb-3 md:mb-4">
                                      <div className="w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-neutral-900 border-2 border-neutral-700/60 overflow-hidden flex items-center justify-center text-xs sm:text-lg md:text-xl font-bold shadow-md shadow-neutral-950/50">
                                        {getInitials(podiumItems[2].name)}
                                      </div>
                                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-neutral-800 border border-neutral-700 p-0.5 sm:p-1.5 rounded-full text-amber-600 shadow-lg">
                                        <Award className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                      </div>
                                    </div>

                                    <div className="text-[10px] sm:text-xs md:text-sm font-semibold truncate max-w-full px-1 sm:px-2 text-neutral-300">
                                      {podiumItems[2].name}
                                    </div>
                                    <div className="text-[9px] sm:text-xs text-neutral-500 mb-2 sm:mb-3 md:mb-4 flex items-center justify-center gap-0.5 sm:gap-1">
                                      <Recycle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500 shrink-0" />
                                      <span>3rd Rank</span>
                                    </div>

                                    {/* Podium Base */}
                                    <div className="w-full bg-gradient-to-b from-neutral-900/60 to-neutral-950/80 border border-neutral-900 rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl pt-3 sm:pt-6 md:pt-8 pb-3 sm:pb-5 md:pb-6 px-1 sm:px-3 md:px-4 shadow-xl flex flex-col items-center h-[60px] sm:h-[90px] md:h-[110px] justify-between">
                                      <div className="text-xs sm:text-lg md:text-xl font-bold text-neutral-200 tracking-tight">
                                        <CountUp end={podiumItems[2].weight} suffix=" kg" />
                                      </div>
                                      <Badge className="bg-neutral-800 text-neutral-400 text-[8px] sm:text-[10px] font-medium border border-neutral-700/50 py-0.5 rounded-md truncate max-w-full">
                                        {podiumItems[2].category}
                                      </Badge>
                                    </div>
                                  </div>
                                </motion.div>
                            )}
                          </div>
                        </>
                    )}
                  </div>
                </div>

                {/* RANKED LIST (Positions 4–10) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-bold text-neutral-200">
                      Ranked Standings
                    </h3>
                    <span className="text-xs text-neutral-500">Positions {listItems[0] ? listItems[0].rank : 4} and onwards</span>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {listItems.length === 0 ? (
                          <div className="text-center py-8 text-neutral-500 text-xs">
                            No additional rankings to show.
                          </div>
                      ) : (
                          listItems.map((item, idx) => {
                            return (
                                <motion.div
                                    key={`${activeTab}-${item.rank}-${item.name}`}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                                    className="group flex items-center justify-between gap-2 bg-neutral-900/25 border border-neutral-900 hover:border-emerald-500/20 hover:bg-neutral-900/40 rounded-2xl p-4 transition-all duration-300 shadow-sm min-w-0"
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="w-6 text-sm font-bold text-neutral-500 text-center">
                                #{item.rank}
                              </span>

                                    <div className="w-10 h-10 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-300">
                                      {getInitials(item.name)}
                                    </div>

                                    <div className="min-w-0">
                                      <div className="text-sm font-semibold text-neutral-200 truncate group-hover:text-white transition-colors">
                                        {item.name}
                                      </div>
                                      <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                                        <Calendar className="w-3 h-3 text-neutral-600" />
                                        <span>{new Date(item.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                                    <Badge className="inline-flex bg-neutral-950 text-neutral-400 hover:bg-neutral-950 border border-neutral-800/80 text-[9px] sm:text-[10px] font-medium py-0.5 sm:py-1 px-1.5 sm:px-2.5 rounded-lg items-center gap-1 max-w-[72px] sm:max-w-none truncate">
                                      {getCategoryIcon(item.category)}
                                      {item.category}
                                    </Badge>

                                    <div className="text-right">
                                      <div className="text-sm font-bold text-emerald-400">
                                        {item.weight.toFixed(1)} kg
                                      </div>
                                      <div className="text-[9px] text-neutral-500">
                                        Weight
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                            );
                          })
                      )}
                    </AnimatePresence>
                  </div>

                  {/* View Full Leaderboard Button */}
                  {hasMoreItems && (
                      <div className="pt-2 text-center">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:border-emerald-500/20 hover:bg-neutral-900/60 transition-all duration-300 shadow-sm"
                        >
                          <span>{isExpanded ? "Show Top 10 Only" : "View Full Leaderboard"}</span>
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: ANALYTICS PANEL (35% = lg:col-span-4) */}
              <div className="lg:col-span-4 space-y-6 min-w-0 relative">
                {/* Analytics Panel Medium Glow — Secondary focal glow */}
                <div
                    className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 w-[min(450px,95%)] h-[400px] bg-emerald-500/15 rounded-full blur-[100px] z-0"
                    aria-hidden="true"
                />

                <div className="relative z-10 space-y-6">

                  {/* Analytics Panel Header */}
                  <div className="flex items-center gap-2 px-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-lg font-bold text-neutral-200">Drive Analytics</h3>
                  </div>

                  {/* Total E-Waste Collected Card */}
                  <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/80 border border-neutral-900 backdrop-blur-md rounded-3xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-xl group-hover:bg-emerald-500/[0.04] transition-colors" />
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-neutral-500 font-medium mb-1.5">Total E-Waste Collected</p>
                        <div className="text-3xl font-extrabold text-neutral-100 flex items-baseline gap-1 tracking-tight">
                          <CountUp end={stats.totalWeight} suffix="" />
                          <span className="text-xs text-emerald-400 font-bold">kg</span>
                        </div>
                      </div>
                      <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
                        <Recycle className="w-6 h-6 animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Total Contributors Card */}
                  <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/80 border border-neutral-900 backdrop-blur-md rounded-3xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-xl group-hover:bg-emerald-500/[0.04] transition-colors" />
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-neutral-500 font-medium mb-1.5">Total Active Contributors</p>
                        <div className="text-3xl font-extrabold text-neutral-100 tracking-tight">
                          <CountUp end={stats.individualCount + stats.organizationCount} suffix="" />
                        </div>
                      </div>
                      <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
                        <Users className="w-6 h-6" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Donut Chart: Collection by Device Type */}
                  <Card className="bg-neutral-900/25 border border-neutral-900 backdrop-blur-md rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">By Device Type</h4>
                      <Badge className="bg-neutral-950 text-neutral-400 border border-neutral-800 text-[9px] font-medium py-0.5 px-2">Shares</Badge>
                    </div>

                    <div className="h-[200px] w-full min-w-0 overflow-hidden flex items-center justify-center relative">
                      {mounted && deviceData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                  data={deviceData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={55}
                                  outerRadius={75}
                                  paddingAngle={3}
                                  dataKey="value"
                              >
                                {deviceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip
                                  cursor={false}
                                  contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                                  labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                                  itemStyle={{ ...CHART_TOOLTIP_ITEM_STYLE, color: "#10b981" }}
                                  formatter={(value) => [`${value}%`, "Contribution"]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                      ) : (
                          <div className="text-xs text-neutral-600">{mounted ? "No device data yet." : "Loading chart..."}</div>
                      )}

                      {/* Inside Text for Donut Chart */}
                      <div className="absolute flex flex-col items-center">
                        <span className="text-[10px] text-neutral-500 font-medium">Top Category</span>
                        <span className="text-sm font-bold text-neutral-200">{deviceData[0]?.name ?? "No Data"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {deviceData.map((device) => (
                          <div key={device.name} className="flex items-center gap-1.5 text-xs text-neutral-400">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: device.color }} />
                            <span className="truncate">{device.name} ({device.value}%)</span>
                          </div>
                      ))}
                    </div>
                  </Card>

                  {/* Horizontal Bar Chart: Collection by Department */}
                  <Card className="bg-neutral-900/25 border border-neutral-900 backdrop-blur-md rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">By Participant Type</h4>
                      <Badge className="bg-neutral-950 text-neutral-400 border border-neutral-800 text-[9px] font-medium py-0.5 px-2">kg</Badge>
                    </div>

                    <div className="h-[220px] w-full min-w-0 overflow-hidden">
                      {mounted && departmentData.some((item) => item.weight > 0) ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmentData} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" stroke="#666" fontSize={10} tickLine={false} axisLine={false} width={80} />
                              <Bar dataKey="weight" radius={[0, 4, 4, 0]} barSize={8}>
                                {departmentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#059669"} />
                                ))}
                              </Bar>
                              <RechartsTooltip
                                  cursor={false}
                                  contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                                  labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                                  itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                                  formatter={(value) => [`${value} kg`, "Weight"]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                      ) : (
                          <div className="text-xs text-neutral-600">{mounted ? "No contribution data yet." : "Loading chart..."}</div>
                      )}
                    </div>
                  </Card>

                  {/* Line Chart: Daily Collection Trend */}
                  <Card className="bg-neutral-900/25 border border-neutral-900 backdrop-blur-md rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Daily Trend</h4>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold py-0.5 px-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Growth
                      </Badge>
                    </div>

                    <div className="h-[120px] w-full min-w-0 overflow-hidden">
                      {mounted && trendData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ left: 5, right: 5, top: 10, bottom: 5 }}>
                              <XAxis dataKey="date" stroke="#555" fontSize={9} tickLine={false} axisLine={false} />
                              <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 3, stroke: "#10b981", strokeWidth: 1, fill: "#0a0a0a" }} activeDot={{ r: 5 }} />
                              <RechartsTooltip
                                  cursor={false}
                                  contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                                  labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                                  itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                      ) : (
                          <div className="text-xs text-neutral-600">{mounted ? "No trend data yet." : "Loading chart..."}</div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <ParallaxGallery />
      </div>
  );
}
