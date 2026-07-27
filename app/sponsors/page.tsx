"use client";

import SponsorCarousel from "@/components/ui/sponsor-carousel";
import ParticleBackground from "@/components/ui/particle-background";
import PageAnimatedGradient from "@/components/ui/page-animated-gradient";
import WaveAnimation from "@/components/ui/wave-animation";
import AnimatedHeader from "@/components/ui/animated-header";
import { cn } from "@/lib/utils";
import { zentry, satoshi } from "@/fonts/font";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Astronaut } from "@/components/Astronaut";
import { Float } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { easing } from "maath";
import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import Loader from "@/components/Loader";

const sponsorRowsData24 = [
  [
    {
      id: "s1",
      src: "/2024/Sponsor01.webp",
      alt: "Sponsor Alpha",
      hint: "Dreq",
    },
    {
      id: "s2",
      src: "/2024/Sponsor02.png",
      alt: "Sponsor Beta",
      hint: "The Pastel Castle",
    },
    {
      id: "s3",
      src: "/2024/Sponsor03.png",
      alt: "Sponsor Gamma",
      hint: "Archies Table",
    },
    {
      id: "s4",
      src: "/2024/Sponsor04.jpg",
      alt: "Sponsor Delta",
      hint: "Big Scoop Cafe",
    },
    {
      id: "s5",
      src: "/2024/Sponsor05.png",
      alt: "Sponsor Epsilon",
      hint: "Art Esthetique",
    },
    {
      id: "s6",
      src: "/2024/Sponsor06.jpeg",
      alt: "Sponsor Zeta",
      hint: "Bora Haely",
    },
  ],
  [
    {
      id: "s7",
      src: "/2024/Sponsor07.jpeg",
      alt: "Sponsor Eta",
      hint: "Cafe 2.o",
    },
    {
      id: "s8",
      src: "/2024/Sponsor08.jpeg",
      alt: "Sponsor Theta",
      hint: "Bounce INC",
    },
    {
      id: "s9",
      src: "/2024/Sponsor09.png",
      alt: "Sponsor Iota",
      hint: "Cane Juice",
    },
    {
      id: "s10",
      src: "/2024/Sponsor10.webp",
      alt: "Sponsor Kappa",
      hint: "Carnival Cinemas",
    },
    {
      id: "s11",
      src: "/2024/Sponsor11.jpg",
      alt: "Sponsor Lambda",
      hint: "Mind Faces",
    },
    {
      id: "s12",
      src: "/2024/Sponsor12.jpeg",
      alt: "Sponsor Mu",
      hint: "Chatore",
    },
  ],
  [
    {
      id: "s13",
      src: "/2024/Sponsor13.png",
      alt: "Sponsor Nu",
      hint: "Coding Blocks",
    },
    {
      id: "s14",
      src: "/2024/Sponsor14.jpg",
      alt: "Sponsor Xi",
      hint: "College Rivals",
    },
    {
      id: "s15",
      src: "/2024/Sponsor15.jpg",
      alt: "Sponsor Omicron",
      hint: "YouTube FanFest",
    },
    {
      id: "s16",
      src: "/2024/Sponsor16.jpeg",
      alt: "Sponsor Pi",
      hint: "Zero Degree Gelato",
    },
    {
      id: "s17",
      src: "/2024/Sponsor17.png",
      alt: "Sponsor Rho",
      hint: "Gamer's Retreat",
    },
    {
      id: "s18",
      src: "/2024/Sponsor18.png",
      alt: "Sponsor Sigma",
      hint: "Heli CupCakes",
    },
  ],
  [
    {
      id: "s22",
      src: "/2024/Sponsor22.png",
      alt: "Sponsor Alpha",
      hint: "Chip'n Dip",
    },
    {
      id: "s23",
      src: "/2024/Sponsor23.jpeg",
      alt: "Sponsor Beta",
      hint: "Kalopsia",
    },
    {
      id: "s24",
      src: "/2024/Sponsor24.png",
      alt: "Sponsor Gamma",
      hint: "KIKXX",
    },
    {
      id: "s25",
      src: "/2024/Sponsor25.jpg",
      alt: "Sponsor Delta",
      hint: "Makeonit",
    },
    {
      id: "s26",
      src: "/2024/Sponsor26.jpg",
      alt: "Sponsor Epsilon",
      hint: "Mini Map",
    },
    {
      id: "s27",
      src: "/2024/Sponsor27.png",
      alt: "Sponsor Zeta",
      hint: "Mona Lisa",
    },
  ],
  [
    {
      id: "s29",
      src: "/2024/Sponsor29.jpeg",
      alt: "Sponsor Alpha",
      hint: "Mukesh Metal",
    },
    {
      id: "s30",
      src: "/2024/Sponsor30.png",
      alt: "Sponsor Beta",
      hint: "Nitya Yadav",
    },
    {
      id: "s31",
      src: "/2024/Sponsor31.webp",
      alt: "Sponsor Gamma",
      hint: "No Escape",
    },
    {
      id: "s32",
      src: "/2024/Sponsor32.png",
      alt: "Sponsor Delta",
      hint: "Nutorio",
    },
    {
      id: "s33",
      src: "/2024/Sponsor33.png",
      alt: "Sponsor Epsilon",
      hint: "Peculiar Photobooths",
    },
    {
      id: "s34",
      src: "/2024/Sponsor34.jpeg",
      alt: "Sponsor Zeta",
      hint: "The Pilot.in",
    },
  ],
  [
    {
      id: "s36",
      src: "/2024/Sponsor36.png",
      alt: "Sponsor Alpha",
      hint: "The Ranch",
    },
    {
      id: "s37",
      src: "/2024/Sponsor37.jpeg",
      alt: "Sponsor Beta",
      hint: "Red Bull",
    },
    {
      id: "s38",
      src: "/2024/Sponsor38.png",
      alt: "Sponsor Gamma",
      hint: "Rio",
    },
    {
      id: "s39",
      src: "/2024/Sponsor39.png",
      alt: "Sponsor Delta",
      hint: "Sagar",
    },
    {
      id: "s40",
      src: "/2024/Sponsor40.png",
      alt: "Sponsor Epsilon",
      hint: "Seasons",
    },
    {
      id: "s41",
      src: "/2024/Sponsor41.png",
      alt: "Sponsor Zeta",
      hint: "SMAAASH",
    },
  ],
  [
    {
      id: "s43",
      src: "/2024/Sponsor43.webp",
      alt: "Sponsor Alpha",
      hint: "Suffderma",
    },
    {
      id: "s44",
      src: "/2024/Sponsor44.jpeg",
      alt: "Sponsor Beta",
      hint: "Zero Degrees",
    },
    {
      id: "s45",
      src: "/2024/Sponsor45.jpg",
      alt: "Sponsor Gamma",
      hint: "Zero Latency",
    },
    {
      id: "s19",
      src: "/2024/Sponsor19.png",
      alt: "Sponsor Delta",
      hint: "Omen",
    },
    {
      id: "s20",
      src: "/2024/Sponsor20.png",
      alt: "Sponsor Epsilon",
      hint: "iCover Creations",
    },
    {
      id: "s21",
      src: "/2024/Sponsor21.jpeg",
      alt: "Sponsor Zeta",
      hint: "The J",
    },
  ],
  [
    {
      id: "s35",
      src: "/2024/Sponsor35.jpeg",
      alt: "Sponsor Zeta",
      hint: "education platform",
    },
    {
      id: "s42",
      src: "/2024/Sponsor42.png",
      alt: "Sponsor Zeta",
      hint: "SportsQVest",
    },
    {
      id: "s28",
      src: "/2024/Sponsor28.avif",
      alt: "Sponsor Zeta",
      hint: "Moody Girl",
    },
  ],
];

const sponsorRowsData25 = [
  [
    {
      id: "s001",
      src: "/2025/Sp01.png",
      alt: "Sponsor Alpha",
      hint: "Alpha Juice",
    },
    {
      id: "s002",
      src: "/2025/Sp02.png",
      alt: "Sponsor Beta",
      hint: "Amity University",
    },
    {
      id: "s003",
      src: "/2025/Sp03.png",
      alt: "Sponsor Gamma",
      hint: "HelitHubs.com",
    },
    {
      id: "s004",
      src: "/2025/Sp04.jpeg",
      alt: "Sponsor Delta",
      hint: "The Waffle Wings",
    },
    {
      id: "s005",
      src: "/2025/Sp05.png",
      alt: "Sponsor Epsilon",
      hint: "Amara & Co.",
    },
    {
      id: "s006",
      src: "/2025/Sp06.jpeg",
      alt: "Sponsor Zeta",
      hint: "Aesthetically Crystals",
    },
  ],
  [
    {
      id: "s007",
      src: "/2025/Sp07.jpeg",
      alt: "Sponsor Eta",
      hint: "Mac Bites",
    },
    {
      id: "s008",
      src: "/2025/Sp08.jpeg",
      alt: "Sponsor Theta",
      hint: "Miya Kebabs",
    },
    {
      id: "s009",
      src: "/2025/Sp09.jpg",
      alt: "Sponsor Iota",
      hint: "Parabolica Social Gaming",
    },
    {
      id: "s010",
      src: "/2025/Sp10.jpeg",
      alt: "Sponsor Kappa",
      hint: "Red Bubble Cafe",
    },
    {
      id: "s011",
      src: "/2025/Sp11.jpeg",
      alt: "Sponsor Lambda",
      hint: "Luna- Simply Moonstruck",
    },
    {
      id: "s012",
      src: "/2025/Sp12.jpg",
      alt: "Sponsor Mu",
      hint: "Youtube FanFest",
    },
  ],
];

// Rig component for camera movement
function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.mouse.x / 10, 1 + state.mouse.y / 10, 3],
      0.5,
      delta
    );
  });
}

// Custom Hero Component for Sponsors Page
const SponsorsHero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 853 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate random stars data with movement
  interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    animationDelay: number;
    duration: number;
    direction: 1 | -1;
    speed: number;
  }

  const generateStars = useCallback((count: number, seed: number): Star[] => {
    let currentSeed = seed;
    const seededRandom = () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom() * 100,
      y: seededRandom() * 100,
      size: seededRandom() * 3 + 1,
      animationDelay: seededRandom() * 10,
      duration: seededRandom() * 20 + 15,
      direction: seededRandom() > 0.5 ? 1 : -1,
      speed: seededRandom() * 0.5 + 0.2,
    }));
  }, []);

  const stars = useMemo(() => generateStars(150, 12345), [generateStars]);
  const sparkleStars = useMemo(() => 60, []);

  if (!isMounted) {
    return null;
  }

  return (
    <section className="relative flex items-center md:items-start md:justify-start justify-center min-h-screen overflow-x-hidden w-full">
      {/* Animated Stars Layer */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-hidden">
        {stars.slice(0, isMobile ? 80 : 150).map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-float-star"
            style={
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.animationDelay}s`,
                animationDuration: `${star.duration}s`,
                boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.6)`,
              } as React.CSSProperties
            }
          >
            <div className="absolute inset-0 rounded-full bg-white animate-twinkle opacity-60"></div>
          </div>
        ))}

        {/* Orbital stars */}
        <div className="absolute top-[20%] left-[15%] w-3 h-3 bg-white rounded-full animate-orbital-1 opacity-80">
          <div className="absolute inset-0 rounded-full bg-white animate-intense-twinkle"></div>
        </div>
        <div className="absolute top-[30%] right-[20%] w-2 h-2 bg-blue-200 rounded-full animate-orbital-2 opacity-70">
          <div className="absolute inset-0 rounded-full bg-blue-200 animate-twinkle"></div>
        </div>
        <div className="absolute top-[60%] left-[25%] w-2.5 h-2.5 bg-purple-200 rounded-full animate-orbital-3 opacity-75">
          <div className="absolute inset-0 rounded-full bg-purple-200 animate-intense-twinkle"></div>
        </div>

        {/* Falling stars */}
        <div className="absolute top-[-5%] left-[10%] w-1.5 h-1.5 bg-white opacity-90 animate-falling-star-1"></div>
        <div className="absolute top-[-5%] left-[50%] w-2 h-2 bg-blue-300 opacity-85 animate-falling-star-3"></div>
        <div className="absolute top-[-5%] left-[85%] w-1 h-1 bg-cyan-300 opacity-70 animate-falling-star-5"></div>

        {/* Twinkling background stars */}
        <div className="absolute inset-0 animate-sparkle opacity-40">
          {stars.slice(0, isMobile ? 30 : sparkleStars).map((star, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                animationDelay: `${star.animationDelay * 0.3}s`,
                animationDuration: `${2 + star.speed * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Text Content - Left Aligned */}
      <div className="relative z-20 px-4 sm:px-6 md:px-8 lg:pl-16 xl:pl-24 w-full md:w-1/2 lg:w-[45%] md:mt-32">
        <h1
          className={cn(
            "text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 text-white leading-tight tracking-wide",
            zentry.className
          )}
        >
          Where Vision Meets{" "}
          <span className={cn("text-red-500", zentry.className)}>SUPPORT</span>
        </h1>
        <p
          className={cn(
            "text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-10 leading-relaxed",
            satoshi.className
          )}
        >
          Behind every hackathon, workshop, and event,
          <br className="hidden sm:block" />
          there&apos;s a sponsor who made it happen.
        </p>
        <Link
          href="/contact-us"
          className={cn(
            "inline-block px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 bg-blue-600 text-white text-base sm:text-lg md:text-xl font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transform",
            satoshi.className
          )}
        >
          Become a Sponsor
        </Link>
        <p
          className={cn(
            "text-sm sm:text-base md:text-lg text-gray-400 mt-4 sm:mt-6",
            satoshi.className
          )}
        >
          Partner with us to shape what comes next.
        </p>
      </div>

      {/* 3D Astronaut - Hidden on Mobile */}
      {!isMobile && (
        <figure
          className="absolute right-0 top-0 bottom-0 z-30 hidden md:block md:w-1/2 lg:w-[55%]"
          style={{ height: "100vh" }}
        >
          <Canvas camera={{ position: [0, 1, 3] }}>
            <Suspense fallback={<Loader />}>
              <Float>
                <Astronaut scale={0.23} position={[-2.5, -1.5, 0]} />
              </Float>
              <Rig />
            </Suspense>
          </Canvas>
        </figure>
      )}
    </section>
  );
};

export default function Sponsors() {
  return (
    <>
      <SponsorsHero />
      <ParticleBackground />
      <WaveAnimation />
      <PageAnimatedGradient />
      <main className="relative z-0 flex min-h-screen w-full flex-col items-center justify-start py-12 sm:py-16 md:py-20 px-4 sm:px-8 bg-transparent overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto">
          {/* 2025 Sponsors Section */}
          <AnimatedHeader
            title={
              <>
                Our{" "}
                <span className={cn("text-red-500", zentry.className)}>
                  2025
                </span>{" "}
                Sponsors
              </>
            }
            subtitle="Thank you for believing in our vision and making innovation possible."
            titleClassName={zentry.className}
          />
          <SponsorCarousel
            rows={sponsorRowsData25}
            defaultAnimationDuration="20s"
          />

          <div className="my-16 sm:my-20 md:my-24" />

          {/* 2024 Sponsors Section */}
          <AnimatedHeader
            title={
              <>
                Our{" "}
                <span className={cn("text-red-500", zentry.className)}>
                  2024
                </span>{" "}
                Sponsors
              </>
            }
            subtitle="Celebrating our partners who helped make 2024 an incredible year."
            titleClassName={zentry.className}
          />
          <SponsorCarousel
            rows={sponsorRowsData24}
            defaultAnimationDuration="20s"
          />
        </div>
      </main>
    </>
  );
}