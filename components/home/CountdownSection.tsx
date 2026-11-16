"use client";

import { useEffect, useState } from "react";
import { RevealHeading } from "./RevealHeading";

const TARGET_TIME = new Date("2026-11-28T00:00:00+05:30").getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });

  useEffect(() => {
    const tick = () => {
      const t = Math.max(0, TARGET_TIME - Date.now());
      setTimeLeft({
        d: pad(Math.floor(t / 864e5)),
        h: pad(Math.floor((t % 864e5) / 36e5)),
        m: pad(Math.floor((t % 36e5) / 6e4)),
        s: pad(Math.floor((t % 6e4) / 1e3)),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="cnt" id="countdown">
      <div className="wrap">
        <RevealHeading>Countdown to Pre Event 2026</RevealHeading>
        <p style={{ fontWeight: 500, margin: 0 }}>
          Mark your calendars for our Pre Event on 28th November, 2026.
        </p>
        <div className="cd" role="timer">
          <div>
            <span id="d">{timeLeft.d}</span>
            <small>days</small>
          </div>
          <div>
            <span id="h">{timeLeft.h}</span>
            <small>hours</small>
          </div>
          <div>
            <span id="m">{timeLeft.m}</span>
            <small>min</small>
          </div>
          <div>
            <span id="s">{timeLeft.s}</span>
            <small>sec</small>
          </div>
        </div>
      </div>
    </section>
  );
}
