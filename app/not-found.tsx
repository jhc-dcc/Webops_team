"use client";

import { satoshi, zentry } from "@/fonts/font";
import { cn } from "@/lib/utils";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23dc2626 fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated 404 */}
          <div
            className={cn(
              "mb-8 transition-all duration-1000",
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            )}
          >
            <h1
              className={cn(
                "text-[10rem] md:text-[15rem] lg:text-[18rem] font-bold leading-none",
                "bg-gradient-to-br from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent",
                "drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]",
                zentry.className
              )}
            >
              404
            </h1>
          </div>

          {/* Error Message */}
          <div
            className={cn(
              "mb-8 transition-all duration-1000 delay-200",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <h2
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4",
                zentry.className
              )}
            >
              PAGE NOT <span className="text-red-500">FOUND</span>
            </h2>
            <p
              className={cn(
                "text-lg md:text-xl text-gray-400 max-w-2xl mx-auto",
                satoshi.className
              )}
            >
              Oops! Looks like you&apos;ve ventured into uncharted digital
              territory. The page you&apos;re looking for doesn&apos;t exist or
              has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-500",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
            >
              <Home className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Go Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
     </div>
  );
}