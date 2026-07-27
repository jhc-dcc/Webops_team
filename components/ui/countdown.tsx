'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type CountdownProps = {
  // Target date/time. Examples:
  // new Date('2025-01-01T00:00:00Z') or '2025-01-01T00:00:00Z'
  target?: Date | string;
  className?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

function parseTarget(target?: Date | string): Date {
  if (!target) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // default: 7 days
  if (target instanceof Date) return target;
  const d = new Date(target);
  if (isNaN(d.getTime())) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return d;
}

function getTimeLeft(target: Date): TimeLeft {
  const now = Date.now();
  const totalMs = Math.max(0, target.getTime() - now);
  const days = Math.floor(totalMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((totalMs / (60 * 60 * 1000)) % 24);
  const minutes = Math.floor((totalMs / (60 * 1000)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);
  return { days, hours, minutes, seconds, totalMs };
}

function pad(num: number, min = 2) {
  return String(num).padStart(min, '0');
}

export default function Countdown({
  target: targetInput,
  className,
}: CountdownProps) {
  const target = useMemo(() => parseTarget(targetInput), [targetInput]);
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(target));
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        const next = getTimeLeft(target);
        if (next.totalMs === 0 && prev.totalMs === 0) {
          clearInterval(t);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [target]);

  useEffect(() => {
    if (!rootRef.current || reduceMotion) return;
    const el = rootRef.current;

    const setRand = () => {
      const rx = ((Math.random() - 0.5) * 2).toFixed(2);
      const ry = ((Math.random() - 0.5) * 2).toFixed(2);
      const bx = ((Math.random() - 0.5) * 4).toFixed(2);
      const by = ((Math.random() - 0.5) * 4).toFixed(2);
      const moshX = `${(Math.random() - 0.5) * 18}px`;
      const moshSkew = `${(Math.random() - 0.5) * 1.6}deg`;
      const chromaR = `${(Math.random() - 0.5) * 3}px`;
      const chromaB = `${(Math.random() - 0.5) * 3}px`;
      const pixelScale = Math.random() > 0.92 ? (0.98 + Math.random() * 0.04).toFixed(3) : '1';
      const pixelSkew = Math.random() > 0.9 ? `${(Math.random() - 0.5) * 2}deg` : '0deg';
      
      el.style.setProperty('--glitch-rx', `${rx}px`);
      el.style.setProperty('--glitch-ry', `${ry}px`);
      el.style.setProperty('--glitch-bx', `${bx}px`);
      el.style.setProperty('--glitch-by', `${by}px`);
      el.style.setProperty('--mosh-x', moshX);
      el.style.setProperty('--mosh-skew', moshSkew);
      el.style.setProperty('--chroma-r', chromaR);
      el.style.setProperty('--chroma-b', chromaB);
      el.style.setProperty('--pixel-scale', pixelScale);
      el.style.setProperty('--pixel-skew', pixelSkew);
      el.style.setProperty('--flicker', Math.random() > 0.94 ? '0.65' : '1');
      el.style.setProperty('--scan-jump', `${Math.random() * 100}%`);
    };

    const id = setInterval(setRand, 120);
    setRand();
    return () => clearInterval(id);
  }, [reduceMotion]);

  const display = `${pad(time.days)} : ${pad(time.hours)} : ${pad(time.minutes)} : ${pad(time.seconds)}`;

  return (
    <div ref={rootRef} className={`dcc-countdown ${className ?? ''}`} data-text={display} aria-live="polite">
      <div className="time-grid">
        <div className="time-unit">
          <div className="digit">{pad(time.days)}</div>
          <div className="label">Days</div>
        </div>
        <div className="separator">:</div>
        <div className="time-unit">
          <div className="digit">{pad(time.hours)}</div>
          <div className="label">Hours</div>
        </div>
        <div className="separator">:</div>
        <div className="time-unit">
          <div className="digit">{pad(time.minutes)}</div>
          <div className="label">Minutes</div>
        </div>
        <div className="separator">:</div>
        <div className="time-unit">
          <div className="digit">{pad(time.seconds)}</div>
          <div className="label">Seconds</div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Share+Tech+Mono&display=swap');
        
        :global(body) {
          background: #000;
          margin: 0;
          padding: 0;
        }

        .dcc-countdown {
          --red: #ff0000;
          --text: var(--red);
          --flicker: 1;
          --chroma-r: 0px;
          --chroma-b: 0px;
          --pixel-scale: 1;
          --pixel-skew: 0deg;
          --mosh-x: 0px;
          --mosh-skew: 0deg;

          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .time-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 2vw, 16px);
          flex-wrap: wrap;
        }

        .time-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(6px, 1.5vw, 12px);
          min-width: clamp(50px, 12vw, 90px);
        }

        .digit {
          position: relative;
          z-index: 2;
          font-family: 'Orbitron', 'Share Tech Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
          font-variant-numeric: tabular-nums;
          font-weight: 700;
          font-size: clamp(32px, 8vw, 80px);
          letter-spacing: 0.06em;
          text-align: center;
          color: var(--text);
          text-shadow:
            0 0 1px rgba(255, 0, 0, 0.8),
            0 0 6px rgba(255, 0, 0, 0.7),
            0 0 16px rgba(255, 0, 0, 0.4);
          filter: drop-shadow(0 0 2px rgba(255, 0, 0, 0.5));
          user-select: none;
          will-change: opacity, transform, filter;
          opacity: var(--flicker);
          line-height: 1;
          animation: flickerPulse 3.2s steps(20, end) infinite;
        }

        .separator {
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          font-size: clamp(28px, 7vw, 72px);
          color: var(--red);
          text-shadow:
            0 0 1px rgba(255, 0, 0, 0.8),
            0 0 6px rgba(255, 0, 0, 0.7);
          opacity: 0.8;
          line-height: 1;
          margin: 0 clamp(-4px, -1vw, 0px);
        }

        .label {
          font-family: 'Share Tech Mono', ui-monospace, monospace;
          font-size: clamp(9px, 2.2vw, 13px);
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.55);
          text-transform: uppercase;
          text-align: center;
          opacity: 0.9;
          white-space: nowrap;
        }

        @keyframes flickerPulse {
          0%, 100% { filter: brightness(1) }
          48% { filter: brightness(0.96) }
          50% { filter: brightness(1.04) }
        }

        @media (prefers-reduced-motion: reduce) {
          .digit {
            animation: none !important;
          }
        }

        @media (max-width: 640px) {
          .time-grid {
            gap: clamp(4px, 1.5vw, 8px);
          }
          .separator {
            margin: 0 clamp(-6px, -2vw, -4px);
          }
        }
      `}</style>
    </div>
  );
}
