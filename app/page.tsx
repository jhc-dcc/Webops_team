"use client";

import { satoshi, zentry } from "@/fonts/font";
import { cn } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import NewsBanner from "@/components/NewsBanner";
import { Newsletter } from "@/components/Newsletter";

function AnimatedHeader() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/video/bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Darker overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>
    </div>
  );
}

export default function Home() {
  // Add state for active work
  const [activeWork, setActiveWork] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const EventHighlights = [
    {
      id: "tech-events",
      title: "Tech-Events",
      bg: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHndOyrTDsKPl6IUv1HWzAVsEdC935ahDBwYLZ7",
      images: [
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHn3sRdYKx6ATmFnyrJLoMa5KkZQRNUX1SfHcgi",
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnfY97GKNS5GuVe9sdcOyJDXB8FIRAZhQUNtTK",
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHn2YPqPojNqFg2XjCQhT6YrAJ07G4lm9D8dSzc",
      ],
    },
    {
      id: "cultural",
      title: "Cultural",
      bg: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnHBZjLEzMyvw6ORa1XgSAY9o7pB8hZTtslu2W",
      images: [
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnUXfTScpo38aqRiQK4nVdseNtuZhPf16M7lYx",
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnPC66Wst4QmRoEyiqMeBV8d19Cr0KkNcszZUW",
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHn6xmpVYftg7j1oEiGq25WcvZhVdB0kpsyL69C",
      ],
    },
    {
      id: "rampwalk",
      title: "RampWalk",
      bg: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnIoqCe4Pl5jBct46VPznEMd1hQDgXqiTmby29",
      images: [
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHns4GiJ1hI4RlzygBvWI9SCbiNEGPfOVMpdTYA",
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnh0LIOUD7wtEsA8bPRdHI0vpeYQC5JLhZul9a",
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnX0cnc3U2gsFTAP1tyHGuRz8qeCnQ47vxJ5Vi",
      ],
    },
    {
      id: "Conference",
      title: "Conference",
      bg: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnQALE23HhgqwtsZbNiYexoRHcSK9Jzl05rCnL",
      images: [
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHn5WJ1RjYZIrNFCglhHRbEYGXs2PMSayKVBQfp",
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnAeHyZeKCRIJ5vGjLaBkpyl7AEdowO8PDKCes",
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnYC0Z0JTxmECjQ4LzHrfNJSbP68dyVOeWiMAX",
      ],
    },
    {
      id: "ewaste-drive",
      title: "Ewaste Drive",
      bg: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnIugXBwPl5jBct46VPznEMd1hQDgXqiTmby29",
      images: [
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnSvUdwWuHaOIo6ybnErgczB3sT8A521mdZlYx",
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnIhUMjvPl5jBct46VPznEMd1hQDgXqiTmby29",
        "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnAcQDDgCRIJ5vGjLaBkpyl7AEdowO8PDKCesr",
      ],
    },
  ];

  // Effect to handle animations on hover
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Use a slight delay to ensure DOM is fully rendered
    setTimeout(() => {
      // Find elements once mounted
      videoRef.current = document.querySelector("video");
      titleRef.current = document.querySelector(".hero-title");
      buttonRef.current = document.querySelector(".hero-button-container");

      // Check if GSAP is available
      if (window.gsap) {
        gsap.defaults({ ease: "power2.inOut" });

        // Remove loading class when ready
        document.body.classList.remove("loading");
      }
    }, 100);
  }, []);

  // Function to handle mouse enter
  const handleMouseEnter = (workId: string) => {
    setActiveWork(workId);

    if (typeof window !== "undefined" && window.gsap) {
      // Create array of elements that exist (filter out nulls)
      const elementsToAnimate = [
        videoRef.current,
        titleRef.current,
        buttonRef.current,
      ].filter(Boolean);

      // Only animate if we have elements
      if (elementsToAnimate.length > 0) {
        gsap.to(elementsToAnimate, {
          duration: 0.5,
          opacity: 0,
          ease: "power2.inOut",
        });
      }

      // Show current work content
      const currentWork = document.getElementById(`content-${workId}`);
      const currentBg = document.getElementById(`bg-${workId}`);

      if (currentWork && currentBg) {
        gsap.set(currentWork, { zIndex: 5, visibility: "visible" });

        // Make sure all background images are hidden first
        document.querySelectorAll(".background__image").forEach((bg) => {
          gsap.set(bg, { opacity: 0 });
        });

        // Then animate the current background image
        gsap.to(currentBg, {
          duration: 0.8,
          opacity: 1,
          ease: "power2.inOut",
        });
        // Animate title
        const title = currentWork.querySelector("h2");
        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              delay: 0.2,
              ease: "power3.out",
            }
          );
        }

        // Animate images
        const images = currentWork.querySelectorAll("[data-position]");
        if (images.length) {
          gsap.fromTo(
            images,
            {
              opacity: 0,
              y: (i) => (i === 0 ? -50 : i === 1 ? -50 : 50),
              x: (i) => (i === 0 ? -50 : i === 1 ? 50 : 0),
              scale: 0.8,
              rotation: (i) => (i === 0 ? -5 : i === 1 ? 5 : -2),
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              rotation: (i) => (i === 0 ? -3 : i === 1 ? 3 : -1),
              duration: 1,
              stagger: 0.15,
              ease: "power3.out",
            }
          );
        }
      }
    }
  };

  // Function to handle mouse leave
  const handleMouseLeave = () => {
    const currentWork = activeWork
      ? document.getElementById(`content-${activeWork}`)
      : null;
    const currentBg = activeWork
      ? document.getElementById(`bg-${activeWork}`)
      : null;

    if (typeof window !== "undefined" && window.gsap) {
      // Create array of elements that exist (filter out nulls)
      const elementsToAnimate = [
        videoRef.current,
        titleRef.current,
        buttonRef.current,
      ].filter(Boolean);

      // Only animate if we have elements
      if (elementsToAnimate.length > 0) {
        gsap.to(elementsToAnimate, {
          duration: 0.5,
          opacity: 1,
          ease: "power2.inOut",
        });
      }

      // Hide current work content
      if (currentWork && currentBg) {
        // Animate background out
        gsap.to(currentBg, {
          duration: 0.5,
          opacity: 0,
          ease: "power2.inOut",
        });
        // Animate images out
        const images = currentWork.querySelectorAll("[data-position]");
        if (images.length) {
          gsap.to(images, {
            opacity: 0,
            y: (i) => i * 20 - 20,
            scale: 0.9,
            duration: 0.3,
            stagger: 0.1,
            ease: "power2.in",
          });
        }

        // Animate title out
        const title = currentWork.querySelector("h2");
        if (title) {
          gsap.to(title, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(currentWork, { zIndex: -1, visibility: "hidden" });
            },
          });
        }
      }
    }

    setActiveWork(null);
  };

  // Video Section Component for E-waste YouTube video
  const VideoSection = () => {
    return (
      <section className="mb-24">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl overflow-hidden bg-black border-2 border-red-500/30 shadow-[0_0_30px_rgba(255,0,0,0.15)]">
            <div className="p-6 border-b border-red-500/20">
              <h2 className="text-3xl font-bold text-red-500 tracking-wider text-center">
                E-Waste Drive &apos;25{" "}
                <span
                  className={cn("tracking-wide text-3xl", zentry.className)}
                ></span>
                Aftermovie
              </h2>
              <p className="text-gray-300 mt-2 text-center">
                Watch the aftermovie of our E-Waste Drive 2025.
              </p>
            </div>
            <div className="p-6">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/orFJSBbqOyM?si=SwMDYKqIXd3vqfJc"
                  title="E-Waste Drive 2025 Aftermovie"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Countdown Component
  const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    useEffect(() => {
      // Target date: November 11, 2025 at 10:00 AM
      const targetDate = new Date("2025-11-11T10:00:00").getTime();

      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;
        if (difference > 0) {
          const newTimeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };

          setTimeLeft(newTimeLeft);
        } else {
          // Event has passed, set everything to 0
          console.log("Event has passed");
          setTimeLeft({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
        }
      };

      // Calculate immediately
      calculateTimeLeft();

      // Update every second
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => {
        console.log("Cleaning up timer");
        clearInterval(timer);
      };
    }, []); // Empty dependency array - effect runs once on mount

    return (
      <section
        className={cn("mb-16 sm:mb-24 px-3 sm:px-6 lg:px-8", satoshi.className)}
      >
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white px-2 sm:px-4 leading-tight">
            Countdown to{" "}
            <span
              className={cn("text-red-500 tracking-wide", zentry.className)}
            >
              Pre Event 2025
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 font-circularweb max-w-3xl mx-auto px-2 sm:px-4 leading-relaxed">
            Mark your calendars for our Pre Event 2025.
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5">
            <div className="flex flex-col items-center justify-center p-2 xs:p-3 sm:p-4 bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-lg sm:rounded-xl text-white min-h-[80px] xs:min-h-[100px] sm:min-h-[120px]">
              <span className="countdown font-mono text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-none">
                {timeLeft.days.toString().padStart(2, "0")}
              </span>
              <span className="text-gray-300 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
                days
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 xs:p-3 sm:p-4 bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-lg sm:rounded-xl text-white min-h-[80px] xs:min-h-[100px] sm:min-h-[120px]">
              <span className="countdown font-mono text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-none">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-gray-300 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
                hours
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 xs:p-3 sm:p-4 bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-lg sm:rounded-xl text-white min-h-[80px] xs:min-h-[100px] sm:min-h-[120px]">
              <span className="countdown font-mono text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-none">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-gray-300 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
                min
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 xs:p-3 sm:p-4 bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-lg sm:rounded-xl text-white min-h-[80px] xs:min-h-[100px] sm:min-h-[120px]">
              <span className="countdown font-mono text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-none">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-gray-300 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
                sec
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="bg-black">
      {/* News Banner */}
      <NewsBanner
        newsUrl="https://www.thehindu.com/news/cities/mumbai/mumbai-college-students-collect-2-tonnes-of-e-waste-spread-awareness-among-schools/article69885016.ece"
        title="DCC's E-Waste Drive featured in major news!"
        description="Read about our environmental impact and sustainability efforts."
        autoHideDuration={15000}
        showOnlyOnce={true}
      />
      {/* Import GSAP library */}


      {/* Hero section */}
      <div className="relative h-screen w-full overflow-hidden">
        <AnimatedHeader />

        {/* Background images for hover effects */}
        <div className="background absolute inset-0 z-0 pointer-events-none">
          <div className="background__video absolute inset-0">
            {/* Video is already rendered by AnimatedHeader */}
          </div>

          {EventHighlights.map((work) => (
            <div
              key={work.id}
              id={`bg-${work.id}`}
              className="background__image absolute inset-0 opacity-0"
            >
              {/* Image background with darker shadow */}
              <div className="absolute inset-0 w-full h-full bg-black">
                <Image
                  src={work.bg}
                  alt={`${work.title} background`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/80"></div>
              </div>
            </div>
          ))}

          {/* Hidden content containers for hover animations */}
          {EventHighlights.map((work) => (
            <div
              key={work.id}
              id={`content-${work.id}`}
              className="content absolute inset-0 pointer-events-none z-0 invisible"
            >
              {" "}
              <h2
                className={cn(
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl md:text-7xl lg:text-8xl font-bold text-white opacity-0 uppercase text-center w-full max-w-[80%] z-10 leading-none drop-shadow-2xl tracking-wide",
                  zentry.className
                )}
              >
                {work.title}
              </h2>
              <div className="content__images relative w-full h-full">
                {work.images.map((img, i) => (
                  <div
                    key={i}
                    className={`absolute opacity-0 ${
                      i === 0
                        ? "top-[40%] left-[25%] -translate-x-1/2 -translate-y-1/2 -rotate-[5deg]"
                        : i === 1
                        ? "top-[35%] right-[25%] translate-x-1/2 -translate-y-1/2 -rotate-[3deg]"
                        : "bottom-[20%] left-1/2 -translate-x-1/2 -rotate-[2deg]"
                    }`}
                    data-position={
                      i === 0
                        ? "top-left"
                        : i === 1
                        ? "top-right"
                        : "bottom-left"
                    }
                  >
                    <div
                      className={`relative rounded-md shadow-2xl ${
                        i === 0
                          ? "w-[280px] h-[280px]"
                          : i === 1
                          ? "w-[240px] h-[240px]"
                          : "w-[200px] h-[200px]"
                      } max-md:!w-[180px] max-md:!h-[180px]`}
                    >
                      <Image
                        src={img}
                        alt={`${work.title} image ${i + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Centered logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pb-32 md:pb-0">
          <h1
            className={cn(
              "hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-6 md:mb-8 tracking-wide text-center px-4",
              zentry.className
            )}
          >
            DOT{" "}
            <span className={cn("text-red-500", zentry.className)}>COM</span>{" "}
            CLUB
          </h1>

          <div className="mt-4 md:mt-12 hero-button-container flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 w-full max-w-md sm:max-w-none sm:w-auto">
            <Link
              href="/cyberstrike-25"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-500/20 text-center text-sm sm:text-base"
            >
              CYBERSTRIKE 25
            </Link>
            <Link
              href="/cyberstrike-25/cl"
              className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-red-500 text-white rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg text-center text-sm sm:text-base"
            >
              CL REGISTRATION
            </Link>
          </div>
        </div>

        {/* Recent Works - Bottom Left */}
        <div className="frame__works absolute bottom-4 left-4 md:bottom-16 md:left-8 lg:left-16 z-20 max-w-[90vw] md:max-w-xs">
          <div className="mb-2 md:mb-4">
            <h3 className="text-xs md:text-sm font-medium uppercase tracking-wider text-gray-400">
              Event Highlights
            </h3>
          </div>
          <ul className="space-y-1 md:space-y-2">
            {EventHighlights.map((work, index) => (
              <li key={index} className="group">
                <a
                  href="#"
                  className="text-white hover:text-red-400 transition-colors text-base md:text-lg lg:text-xl font-bold tracking-wide"
                  onMouseEnter={() => handleMouseEnter(work.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {work.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CountdownTimer />

      <main className="flex-grow container mx-auto px-4 py-16">
        <section className="mb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-center">
              Innovate. Create.{" "}
              <span
                className={cn("text-red-500 tracking-wide", zentry.className)}
              >
                Collaborate.
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-circularweb leading-relaxed">
              Exploring the frontiers of technology and innovation at Jai Hind
              College. Join us in our journey to push the boundaries of
              what&apos;s possible.
            </p>
          </div>
        </section>

        {/* Video Section */}
        <VideoSection />

        {/* Featured Events Section */}
        <section id="events" className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white text-center">
              Upcoming{" "}
              <span
                className={cn("text-red-500 tracking-wide", zentry.className)}
              >
                Events
              </span>
            </h2>
            <p className="text-xl text-gray-300 font-circularweb max-w-3xl mx-auto">
              Join us for our exciting lineup of tech events, workshops, and
              conferences designed to inspire and educate.
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Cyberstrike 2025-26",
                image:
                  "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnIZmLNDPl5jBct46VPznEMd1hQDgXqiTmby29",
                featured: true,
              },
              {
                title: "Hackathon",
                image:
                  "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnLw8onMA5Ba8Mi5Hfh0TCJrvp3b2t7WcgQGN1",
              },
            ].map((event, index) => (
              <div
                key={index}
                className={`rounded-xl overflow-hidden bg-gradient-to-br from-red-900/10 to-black border-2 ${
                  event.featured ? "border-red-500/50" : "border-red-900/30"
                } hover:border-red-500/70 transition-all duration-300 group h-full max-w-sm mx-auto w-full`}
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400/333/white?text=Event+Image";
                    }}
                  />
                  {event.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        FEATURED
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 text-center">
                    {event.title}
                  </h3>
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center w-full py-2 mt-2 bg-red-600/20 text-red-500 hover:bg-red-600/30 rounded-lg transition-colors group-hover:text-white group-hover:bg-red-600"
                  >
                    <span className="mr-2">View Details</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/events"
              className="px-8 py-3 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              View All Events
            </Link>
          </div>
        </section>

        {/* Meet Our Elite Squad Section - Moved below Events */}
        <section className="mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl overflow-hidden bg-black border-2 border-red-500/30 shadow-[0_0_30px_rgba(255,0,0,0.15)]">
              <div className="p-6 border-b border-red-500/20">
                <h2 className="text-3xl font-bold text-red-500 tracking-wider text-center">
                  MEET OUR ELITE SQUAD
                </h2>
                <p className="text-gray-300 mt-2 text-center">
                  The talented team behind DCC&apos;s innovation and success.
                </p>
              </div>
              <div className="p-6">
                <div className="relative rounded-lg overflow-hidden h-[400px]">
                  <Image
                    src="https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnbcHyjcS829BIDWbLY6NSFQdrag4cGE7poilX"
                    alt="Our Elite Squad"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Newsletter Section */}
        <Newsletter />
      </main>
    </div>
  );
}
