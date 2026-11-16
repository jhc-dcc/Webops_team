"use client";

import { useEffect, useRef, ReactNode } from "react";

interface RevealHeadingProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  style?: React.CSSProperties;
}

export function RevealHeading({
  children,
  as: Component = "h2",
  className = "",
  style,
}: RevealHeadingProps) {
  const elRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Component ref={elRef} className={`hd rv ${className}`} style={style}>
      <span className="ln">
        <i>{children}</i>
      </span>
    </Component>
  );
}
