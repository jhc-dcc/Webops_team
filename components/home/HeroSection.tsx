"use client";

import Link from "next/link";
import { HeroCanvas } from "./HeroCanvas";

const TAPE_ITEMS = [
  "Tech-Events",
  "Cultural",
  "RampWalk",
  "Conference",
  "Ewaste Drive",
  "Cyberstrike 2026",
];

export function HeroSection() {
  // Repeating items twice for seamless infinite marquee loop (-50% translateX)
  const marqueeContent = (
    <div className="mq">
      {[...Array(2)].map((_, loopIdx) => (
        <span key={loopIdx} className="inline-flex">
          {TAPE_ITEMS.map((item, itemIdx) => (
            <span key={`${loopIdx}-${itemIdx}`}>
              <span>{item}</span>
              <span>●</span>
            </span>
          ))}
        </span>
      ))}
    </div>
  );

  return (
    <header className="hero" id="hero">
      <HeroCanvas />

      {/* Rotating Circular Badge SVG */}
      <svg className="bdg" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path
            id="cp"
            d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
          />
        </defs>
        <text
          fontSize="19"
          fontWeight="700"
          fill="#1B1030"
          fontFamily="DM Sans, sans-serif"
        >
          <textPath href="#cp" textLength="480" lengthAdjust="spacing">
            JAI HIND COLLEGE • EST. 2014 • TECH CLUB •
          </textPath>
        </text>
        <circle cx="100" cy="100" r="14" fill="#1B1030" />
      </svg>

      <div className="wrap">
        <h1 className="h1" aria-label="Dot Com Club">
          {/* Mobile view: stacked lines so DOT. and COM don't collide and have equal spacing */}
          <s className="h1-mob">
            <i>
              Dot<b className="od"></b>
            </i>
          </s>
          <s className="h1-mob">
            <i>Com</i>
          </s>

          {/* Desktop view: single line for DOT.COM matching the reference design */}
          <s className="h1-desk">
            <i>
              Dot<b className="od"></b>Com
            </i>
          </s>

          {/* Shared CLUB line */}
          <s>
            <i>Club</i>
          </s>
        </h1>

        <div className="c2">
          <p>
            Empowering digital creativity and innovation through technology.
          </p>
          <Link className="btn dk" href="/cyberstrike-26/cl">
            CL Registration
          </Link>
        </div>
      </div>

      {/* Crossing Infinite Marquee Tapes */}
      <div className="tp t1" aria-hidden="true">
        {marqueeContent}
      </div>
      <div className="tp t2" aria-hidden="true">
        {marqueeContent}
      </div>
    </header>
  );
}
