"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import HeroText from "./HeroText";
import { Astronaut } from "./Astronaut";
import { Float } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { easing } from "maath";
import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import Loader from "./Loader";

const Hero = () => {
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
    // Use a seeded random function for consistent server/client rendering
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
      duration: seededRandom() * 20 + 15, // 15-35 seconds
      direction: seededRandom() > 0.5 ? 1 : -1, // Random direction
      speed: seededRandom() * 0.5 + 0.2, // Different speeds
    }));
  }, []);

  // Use useMemo to generate stars with a fixed seed for SSR consistency
  const stars = useMemo(() => generateStars(150, 12345), [generateStars]);
  const sparkleStars = useMemo(() => 60, []);
  const twinkleStars = useMemo(() => 40, []);

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <section className=" flex items-center justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space sm:ml-[20rem] -ml-[7rem]">
      {/* Animated Stars Layer - Constantly Moving */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-hidden">
        {/* Continuously moving stars with twinkling */}
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
                ["--star-direction"]: star.direction,
                ["--star-speed"]: star.speed,
              } as React.CSSProperties
            }
          >
            {/* Twinkling overlay */}
            <div className="absolute inset-0 rounded-full bg-white animate-twinkle opacity-60"></div>
          </div>
        ))}

        {/* Large floating stars with orbital motion and enhanced twinkling */}
        <div className="absolute top-[20%] left-[15%] w-3 h-3 bg-white rounded-full animate-orbital-1 opacity-80">
          <div className="absolute inset-0 rounded-full bg-white animate-intense-twinkle"></div>
        </div>
        <div className="absolute top-[30%] right-[20%] w-2 h-2 bg-blue-200 rounded-full animate-orbital-2 opacity-70">
          <div className="absolute inset-0 rounded-full bg-blue-200 animate-twinkle"></div>
        </div>
        <div className="absolute top-[60%] left-[25%] w-2.5 h-2.5 bg-purple-200 rounded-full animate-orbital-3 opacity-75">
          <div className="absolute inset-0 rounded-full bg-purple-200 animate-intense-twinkle"></div>
        </div>
        <div className="absolute top-[45%] right-[35%] w-3.5 h-3.5 bg-white rounded-full animate-orbital-4 opacity-85">
          <div className="absolute inset-0 rounded-full bg-white animate-twinkle"></div>
        </div>
        <div className="absolute top-[70%] left-[60%] w-2 h-2 bg-cyan-200 rounded-full animate-orbital-5 opacity-65">
          <div className="absolute inset-0 rounded-full bg-cyan-200 animate-intense-twinkle"></div>
        </div>
        <div className="absolute top-[15%] right-[45%] w-2.5 h-2.5 bg-white rounded-full animate-orbital-6 opacity-75">
          <div className="absolute inset-0 rounded-full bg-white animate-twinkle"></div>
        </div>

        {/* Continuous shooting stars */}
        <div className="absolute top-[10%] left-[-5%] w-1 h-1 bg-white opacity-90 animate-continuous-shooting-1"></div>
        <div className="absolute top-[40%] left-[-5%] w-1 h-1 bg-cyan-300 opacity-80 animate-continuous-shooting-2"></div>
        <div className="absolute top-[75%] left-[-5%] w-1 h-1 bg-purple-300 opacity-70 animate-continuous-shooting-3"></div>
        <div className="absolute top-[25%] right-[-5%] w-1 h-1 bg-pink-300 opacity-75 animate-continuous-shooting-4"></div>

        {/* Falling Stars */}
        <div className="absolute top-[-5%] left-[10%] w-1.5 h-1.5 bg-white opacity-90 animate-falling-star-1"></div>
        <div className="absolute top-[-5%] left-[30%] w-1 h-1 bg-yellow-200 opacity-80 animate-falling-star-2"></div>
        <div className="absolute top-[-5%] left-[50%] w-2 h-2 bg-blue-300 opacity-85 animate-falling-star-3"></div>
        <div className="absolute top-[-5%] left-[70%] w-1.5 h-1.5 bg-purple-300 opacity-75 animate-falling-star-4"></div>
        <div className="absolute top-[-5%] left-[85%] w-1 h-1 bg-cyan-300 opacity-70 animate-falling-star-5"></div>
        <div className="absolute top-[-5%] left-[25%] w-1.5 h-1.5 bg-pink-300 opacity-80 animate-falling-star-6"></div>
        <div className="absolute top-[-5%] left-[60%] w-1 h-1 bg-white opacity-85 animate-falling-star-7"></div>

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

        {/* Enhanced twinkling overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {stars.slice(0, isMobile ? 20 : twinkleStars).map((star, i) => (
            <div
              key={`twinkle-${i}`}
              className="absolute rounded-full animate-intense-twinkle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size + 1}px`,
                height: `${star.size + 1}px`,
                backgroundColor: ["#ffffff", "#e0f2fe", "#f3e8ff", "#fef3c7"][
                  i % 4
                ],
                animationDelay: `${star.animationDelay * 0.4}s`,
                animationDuration: `${1.5 + star.speed * 2}s`,
                boxShadow: `0 0 ${
                  star.size * 3 + 5
                }px rgba(255, 255, 255, 0.8)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Text - Middle Layer */}
      <div className="relative z-20">
        <HeroText />
      </div>

      {/* 3D Astronaut - Top Layer */}
      <figure
        className="absolute inset-0 sm:z-30 z-10 ml-5"
        style={{ width: "100vw", height: "100vh" }}
      >
        <Canvas camera={{ position: [0, 1, 3] }}>
          <Suspense fallback={<Loader />}>
            <Float>
              <Astronaut
                scale={isMobile ? 0.23 : undefined}
                position={isMobile ? [0, -1.5, 0] : undefined}
              />
            </Float>
            <Rig />
          </Suspense>
        </Canvas>
      </figure>
    </section>
  );
};

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

export default Hero;