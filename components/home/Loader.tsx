"use client";

import { useEffect, useState, useRef } from "react";

const URL_STRING = "www.dotcomclub.com";
const STORAGE_KEY = "dcc_home_loader_seen";

interface LoaderProps {
  onLoaded?: () => void;
}

export function Loader({ onLoaded }: LoaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [percentage, setPercentage] = useState("0%");

  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Check if loader was already shown in this session
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Ignore storage access restrictions
    }

    if (prefersReducedMotion || alreadySeen) {
      onLoadedRef.current?.();
      return;
    }

    // Activate loader and lock body scroll
    setIsVisible(true);
    document.body.classList.add("lock");

    let k = 0;
    const timeouts: NodeJS.Timeout[] = [];

    const interval = setInterval(() => {
      k++;
      setTypedText(URL_STRING.slice(0, k));
      setPercentage(`${Math.round((k / URL_STRING.length) * 100)}%`);

      if (k >= URL_STRING.length) {
        clearInterval(interval);

        // Hold full text briefly before opening radial mask
        const t1 = setTimeout(() => {
          setIsOpen(true);

          // Mark session and signal loaded
          const t2 = setTimeout(() => {
            document.body.classList.remove("lock");
            try {
              sessionStorage.setItem(STORAGE_KEY, "1");
            } catch {
              // Ignore storage errors
            }
            onLoadedRef.current?.();

            // Remove loader from DOM after mask animation completes (1.15s)
            const t3 = setTimeout(() => {
              setIsVisible(false);
            }, 850);
            timeouts.push(t3);
          }, 450);
          timeouts.push(t2);
        }, 450);
        timeouts.push(t1);
      }
    }, 85);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
      document.body.classList.remove("lock");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`ld ${isOpen ? "open" : ""}`}
      id="ld"
      aria-hidden="true"
    >
      <div className="bar">
        <b />
        <span id="ty">{typedText}</span>
        <u />
      </div>
      <div className="pc" id="pc">
        {percentage}
      </div>
    </div>
  );
}
