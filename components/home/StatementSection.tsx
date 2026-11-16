"use client";

import { useEffect, useRef } from "react";

const STATEMENT_TEXT =
  "Innovate. Create. Collaborate. Exploring the frontiers of technology and innovation at Jai Hind College. Join us in our journey to push the boundaries of what's possible.";

export function StatementSection() {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const words = STATEMENT_TEXT.split(" ");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const spans = el.querySelectorAll<HTMLSpanElement>(".w");

    const handleScroll = () => {
      const a = el.getBoundingClientRect();
      let q = (window.innerHeight * 0.82 - a.top) / (a.height + window.innerHeight * 0.2);
      q = Math.max(0, Math.min(1, q));

      spans.forEach((w, i) => {
        w.classList.toggle("on", i < q * spans.length);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="st" id="statement">
      <div className="wrap">
        <p id="stm" ref={containerRef}>
          {words.map((word, index) => (
            <span key={index}>
              <span className="w">{word}</span>
              {index < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
