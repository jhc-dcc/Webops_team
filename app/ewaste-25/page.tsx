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
// CONFIGURATION & DUMMY DATA FOR LOCALHOST
// ==========================================
const USE_MOCK_DATA = true; // Set to false to use Convex database queries

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

const MOCK_INDIVIDUALS = [
  { rank: 1, name: "Rudra Sharma", wasteWeight: 85.5, wasteTypes: ["Laptops", "Mobiles"], submittedAt: Date.now() - 2 * 24 * 3600 * 1000, category: "Laptop", department: "Computer Science" },
  { rank: 2, name: "Vaishnovee Iyer", wasteWeight: 72.3, wasteTypes: ["Mobiles", "Cables"], submittedAt: Date.now() - 3 * 24 * 3600 * 1000, category: "Mobile", department: "Information Technology" },
  { rank: 3, name: "Nigel D'Souza", wasteWeight: 68.0, wasteTypes: ["Mixed Waste"], submittedAt: Date.now() - 1 * 24 * 3600 * 1000, category: "Mixed", department: "Electronics" },
  { rank: 4, name: "Aarav Mehta", wasteWeight: 55.2, wasteTypes: ["Mobiles"], submittedAt: Date.now() - 4 * 24 * 3600 * 1000, category: "Mobile", department: "Information Technology" },
  { rank: 5, name: "Ishaan Verma", wasteWeight: 48.1, wasteTypes: ["Laptops"], submittedAt: Date.now() - 5 * 24 * 3600 * 1000, category: "Laptop", department: "Computer Science" },
  { rank: 6, name: "Ananya Iyer", wasteWeight: 42.0, wasteTypes: ["Keyboards"], submittedAt: Date.now() - 2 * 24 * 3600 * 1000, category: "Keyboard", department: "Science" },
  { rank: 7, name: "Kabir Sen", wasteWeight: 39.8, wasteTypes: ["Batteries"], submittedAt: Date.now() - 6 * 24 * 3600 * 1000, category: "Battery", department: "Commerce" },
  { rank: 8, name: "Meera Nair", wasteWeight: 35.4, wasteTypes: ["Cables", "Chargers"], submittedAt: Date.now() - 7 * 24 * 3600 * 1000, category: "Cables", department: "Computer Science" },
  { rank: 9, name: "Diya Joshi", wasteWeight: 31.2, wasteTypes: ["Mixed Waste"], submittedAt: Date.now() - 8 * 24 * 3600 * 1000, category: "Mixed", department: "Commerce" },
  { rank: 10, name: "Rohan Kapoor", wasteWeight: 28.7, wasteTypes: ["Screens"], submittedAt: Date.now() - 9 * 24 * 3600 * 1000, category: "Screen", department: "Science" },
  { rank: 11, name: "Sanya Malhotra", wasteWeight: 25.1, wasteTypes: ["Mobiles"], submittedAt: Date.now() - 10 * 24 * 3600 * 1000, category: "Mobile", department: "Information Technology" },
  { rank: 12, name: "Vikram Seth", wasteWeight: 21.0, wasteTypes: ["Cables"], submittedAt: Date.now() - 11 * 24 * 3600 * 1000, category: "Cables", department: "Electronics" },
  { rank: 13, name: "Pooja Hegde", wasteWeight: 18.5, wasteTypes: ["Keyboards"], submittedAt: Date.now() - 12 * 24 * 3600 * 1000, category: "Keyboard", department: "Science" }
];

const MOCK_ORGANIZATIONS = [
  { rank: 1, organizationName: "Beta Biotech Association", representativeName: "Dr. A. K. Sen", totalWeight: 450.5, entries: 8, lastSubmission: Date.now() - 1 * 24 * 3600 * 1000, department: "Science" },
  { rank: 2, organizationName: "IT Student Council", representativeName: "Siddharth Roy", totalWeight: 385.2, entries: 12, lastSubmission: Date.now() - 2 * 24 * 3600 * 1000, department: "Information Technology" },
  { rank: 3, organizationName: "Electronics Club", representativeName: "Neha Gupta", totalWeight: 310.0, entries: 6, lastSubmission: Date.now() - 3 * 24 * 3600 * 1000, department: "Electronics" },
  { rank: 4, organizationName: "CSI Student Chapter", representativeName: "Rohan Malhotra", totalWeight: 275.8, entries: 9, lastSubmission: Date.now() - 4 * 24 * 3600 * 1000, department: "Computer Science" },
  { rank: 5, organizationName: "Commerce Association", representativeName: "Priya Shah", totalWeight: 210.3, entries: 5, lastSubmission: Date.now() - 5 * 24 * 3600 * 1000, department: "Commerce" },
  { rank: 6, organizationName: "Physics Forum", representativeName: "Amit Trivedi", totalWeight: 145.6, entries: 4, lastSubmission: Date.now() - 6 * 24 * 3600 * 1000, department: "Science" }
];

const MOCK_DEVICE_DATA = [
  { name: "Laptops", value: 45, color: "#10B981" }, // Emerald 500
  { name: "Mobiles", value: 25, color: "#059669" }, // Emerald 600
  { name: "Monitors", value: 15, color: "#34D399" }, // Emerald 400
  { name: "Cables/Chargers", value: 10, color: "#6EE7B7" }, // Emerald 300
  { name: "Others", value: 5, color: "#A7F3D0" } // Emerald 200
];

const MOCK_DEPARTMENT_DATA = [
  { name: "Science", weight: 596.1 },
  { name: "Computer Sci.", weight: 585.8 },
  { name: "Info. Tech.", weight: 457.5 },
  { name: "Electronics", weight: 378.0 },
  { name: "Commerce", weight: 241.5 }
];

const MOCK_DAILY_TREND = [
  { date: "15 Jul", weight: 120 },
  { date: "16 Jul", weight: 180 },
  { date: "17 Jul", weight: 150 },
  { date: "18 Jul", weight: 290 },
  { date: "19 Jul", weight: 210 },
  { date: "20 Jul", weight: 350 },
  { date: "21 Jul", weight: 420 },
  { date: "22 Jul", weight: 304.1 }
];

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

  // Convex API Queries (Ready for database integration)
  const individualsData = useQuery(api.ewaste.getIndividualLeaderboard, { limit: 100 });
  const organizationsData = useQuery(api.ewaste.getOrganizationLeaderboard, { limit: 100 });
  const statsData = useQuery(api.ewaste.getEwasteStats);

  // Determine active data source and normalize to UnifiedEntry type
  const individuals = useMemo<UnifiedEntry[]>(() => {
    const raw = (USE_MOCK_DATA || !individualsData) ? MOCK_INDIVIDUALS : individualsData.map((item, idx) => ({
      rank: idx + 1,
      name: item.name,
      wasteWeight: item.wasteWeight,
      wasteTypes: item.wasteTypes,
      submittedAt: item.submittedAt,
      category: item.wasteTypes[0] || "Mixed",
      department: "Computer Science"
    }));

    return raw.map((item) => ({
      rank: item.rank,
      name: item.name,
      weight: item.wasteWeight,
      category: item.wasteTypes?.[0] || item.category || "Mixed",
      submittedAt: item.submittedAt,
      isOrg: false
    }));
  }, [individualsData]);

  const organizations = useMemo<UnifiedEntry[]>(() => {
    const raw = (USE_MOCK_DATA || !organizationsData) ? MOCK_ORGANIZATIONS : organizationsData.map((item, idx) => ({
      rank: idx + 1,
      organizationName: item.organizationName,
      representativeName: item.representativeName,
      totalWeight: item.totalWeight,
      entries: item.entries,
      lastSubmission: item.lastSubmission,
      department: "Science"
    }));

    return raw.map((item) => ({
      rank: item.rank,
      name: item.organizationName,
      weight: item.totalWeight,
      category: item.department || "Organization",
      submittedAt: item.lastSubmission,
      isOrg: true,
      extraInfo: `${item.entries} entries`
    }));
  }, [organizationsData]);

  const stats = useMemo(() => {
    if (USE_MOCK_DATA || !statsData) {
      return {
        totalWeight: 2024.1,
        individualCount: 51,
        organizationCount: 15
      };
    }
    return statsData;
  }, [statsData]);

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

  // Calculate dynamic analytics data based on active tab list
  const deviceData = MOCK_DEVICE_DATA;
  const departmentData = MOCK_DEPARTMENT_DATA;
  const trendData = MOCK_DAILY_TREND;

  return (
    <div className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Dynamic Ambient Background Elements — clipped so they don't widen the page */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[min(500px,100vw)] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[min(400px,80vw)] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
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
                  layoutId="ewaste-25-segmented-pill"
                />
              </div>

              {/* PODIUM (Top 3 Contributors) */}
              <div className="w-full">
                {podiumItems.length === 0 ? (
                  <div className="text-center py-16 bg-neutral-900/20 border border-neutral-900 rounded-3xl">
                    <Recycle className="w-12 h-12 text-neutral-700 mx-auto mb-4 animate-spin" />
                    <p className="text-neutral-400">No entries recorded yet.</p>
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
                            key={item.rank}
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
            <div className="lg:col-span-4 space-y-6 min-w-0">
              
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
                  {mounted ? (
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
                    <div className="text-xs text-neutral-600">Loading chart...</div>
                  )}

                  {/* Inside Text for Donut Chart */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[10px] text-neutral-500 font-medium">Top Category</span>
                    <span className="text-sm font-bold text-neutral-200">Laptops</span>
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">By Department</h4>
                  <Badge className="bg-neutral-950 text-neutral-400 border border-neutral-800 text-[9px] font-medium py-0.5 px-2">kg</Badge>
                </div>

                <div className="h-[220px] w-full min-w-0 overflow-hidden">
                  {mounted ? (
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
                    <div className="text-xs text-neutral-600">Loading chart...</div>
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
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData} margin={{ left: 5, right: 5, top: 10, bottom: 5 }}>
                        <XAxis dataKey="date" stroke="#555" fontSize={9} tickLine={false} axisLine={false} />
                        <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 3, stroke: "#10b981", strokeWidth: 1, fill: "#0a0a0a" }} activeDot={{ r: 5 }} />
                        <RechartsTooltip
                          cursor={false}
                          contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                          labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                          itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                          formatter={(value) => [`${value} kg`, "Collected"]}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-xs text-neutral-600">Loading chart...</div>
                  )}
                </div>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <ParallaxGallery />
    </div>
  );
}