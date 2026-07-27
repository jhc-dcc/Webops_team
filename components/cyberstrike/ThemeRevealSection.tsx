"use client";

import { useEffect, useRef, useState } from "react";
import { useGlitch } from 'react-powerglitch';

export const ThemeRevealSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [intense, setIntense] = useState(false);

  // Initialize glitch effect with slower, more subtle options
  const glitch = useGlitch({
    playMode: "always",
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 4000,
      iterations: Infinity,
    },
    glitchTimeSpan: {
      start: 0.3,
      end: 0.5,
    },
    shake: {
      velocity: 8,
      amplitudeX: 0.1,
      amplitudeY: 0.1,
    },
    slice: {
      count: 4,
      velocity: 8,
      minHeight: 0.02,
      maxHeight: 0.12,
      hueRotate: true,
    },
    pulse: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIntense(true);
            glitch.startGlitch();
          } else {
            setIntense(false);
            glitch.stopGlitch();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [glitch]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-6 py-24 text-white"
    >
      <style jsx global>{`
        @import url('https://fonts.cdnfonts.com/css/anurati');

        html, body, h1 {
          padding: 0;
          margin: 0;
          font-family: "Anurati", sans-serif;
        }

        .theme-reveal-section {
          background: #0a0a0a;
          height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(rgba(10, 10, 10, 0.6), rgba(0, 0, 0, 0.9)), 
                      repeating-linear-gradient(0, transparent, transparent 2px, black 3px, black 3px), 
                      url(https://media0.giphy.com/media/2shBNJSPTrpWvoXfpD/giphy.gif);
          background-size: cover;
          background-position: center;
          z-index: 1;
        }

        .theme-reveal-wrapper {
          text-align: center;
        }

        .theme-reveal-submsg {
          color: #64dcdc;
          letter-spacing: 1em;
          font-family: "quicksand", sans-serif;
          font-size: 2.5em;
        }

        .theme-reveal-submsg, .glitch-wrapper {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .glitch-wrapper {
          font-family: "Anurati", sans-serif;
          font-weight: bold;
          font-size: clamp(3em, 8vw, 9em);
          letter-spacing: 0.5em;
          color: white;
        }

        .glitch-wrapper .text-red-500 {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .theme-reveal-submsg {
            font-size: 1.5em;
            letter-spacing: 0.5em;
          }
        }
      `}</style>
      
      <div className="theme-reveal-section">
        <div className="theme-reveal-wrapper">
          <div className="glitch-wrapper" ref={glitch.ref} data-text="ERROR 404" data-intense={intense}>
            ERROR <span className="text-red-500">404</span>
          </div>
          <span className="theme-reveal-submsg">BEYOND THE LIMITS</span>
        </div>
      </div>
    </section>
  );
};