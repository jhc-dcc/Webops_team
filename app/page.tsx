"use client";

import { useState, useCallback } from "react";
import { anton, dmSans } from "@/fonts/font";
import { Loader } from "@/components/home/Loader";
import { BackgroundCanvas } from "@/components/home/BackgroundCanvas";
import { Navbar } from "@/components/home/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { CountdownSection } from "@/components/home/CountdownSection";
import { StatementSection } from "@/components/home/StatementSection";
import { AftermovieSection } from "@/components/home/AftermovieSection";
import { EventsSection } from "@/components/home/EventsSection";
import { SquadSection } from "@/components/home/SquadSection";
import { FooterSection } from "@/components/home/FooterSection";
import { CustomCursor } from "@/components/home/CustomCursor";
import { SoundToggle } from "@/components/home/SoundToggle";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      data-loaded={isLoaded ? "true" : "false"}
      className={`home-root ${isLoaded ? "go" : ""} ${anton.variable} ${dmSans.variable} bg-[var(--bg)] text-[var(--tx)] relative`}
    >
      {/* Background Organic Drift & Brush Canvas */}
      <BackgroundCanvas />

      {/* Screen-Filling Circular Loader */}
      <Loader onLoaded={handleLoaded} />

      {/* Editorial Navigation with Color Tracking & Mobile Menu */}
      <Navbar />

      {/* Ambient Sound Synthesizer Toggle */}
      <SoundToggle />

      {/* Main Content Sections in Exact Order */}
      <div className="home-sections">
        {/* 1. Hero with #hg canvas, rotating badge & marquee tapes */}
        <HeroSection />

        {/* 2. Event Highlights */}
        <HighlightsSection />

        {/* 3. Countdown to Pre Event 2026 */}
        <CountdownSection />

        {/* 4. Scroll-Driven Word-by-Word Statement */}
        <StatementSection />

        {/* 5. E-Waste Drive 2025 Aftermovie */}
        <AftermovieSection />

        {/* 6. Upcoming Events (Stacked Sticky Cards) */}
        <EventsSection />

        {/* 7. Meet Our Elite Squad */}
        <SquadSection />
      </div>

      {/* 8. Editorial Footer with Auto-Fit Wordmark */}
      <FooterSection />

      {/* Custom Comet Cursor & Particles (Desktop Only) */}
      <CustomCursor />
    </div>
  );
}
