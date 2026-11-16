"use client";

import { useEffect, useRef } from "react";

interface DotDef {
  x: number;
  y: number;
  r: number;
  k: number;
  c: string;
  d: number;
}

interface BrushDef {
  p: [number, number][];
  w: number;
  c: [string, string, string];
  d: number;
  sp: number;
  ph: number;
  s: number;
}

const HD: DotDef[] = [
  { x: 0.12, y: 0.3, r: 13, k: 0, c: "#1B1030", d: 1.2 },
  { x: 0.9, y: 0.62, r: 36, k: 1, c: "#fff", d: 0.9 },
  { x: 0.58, y: 0.2, r: 9, k: 0, c: "#fff", d: 1.6 },
];

const HBR: BrushDef[] = [
  {
    p: [
      [-0.1, 0.88],
      [0.2, 0.52],
      [0.5, 0.78],
      [0.8, 0.36],
      [1.1, 0.42],
    ],
    w: 0.13,
    c: ["#B796FF", "#D6C5FF", "#EDE5FF"],
    d: 0.6,
    sp: 0.08,
    ph: 0,
    s: 1,
  },
  {
    p: [
      [0.08, -0.1],
      [0.34, 0.24],
      [0.62, 0.04],
      [0.96, 0.22],
      [1.1, 0.1],
    ],
    w: 0.1,
    c: ["#4A22A8", "#6638D6", "#7B4DEB"],
    d: 1,
    sp: 0.07,
    ph: 0.35,
    s: 3,
  },
  {
    p: [
      [1.1, 0.74],
      [0.78, 1.0],
      [0.5, 0.86],
      [0.2, 1.08],
    ],
    w: 0.09,
    c: ["#4A22A8", "#6638D6", "#7B4DEB"],
    d: 0.8,
    sp: 0.09,
    ph: 0.7,
    s: 5,
  },
];

function crv(P: [number, number][], n: number): [number, number][] {
  const o: [number, number][] = [];
  const m = P.length - 1;
  for (let i = 0; i < m; i++) {
    const a = P[Math.max(i - 1, 0)];
    const b = P[i];
    const c = P[i + 1];
    const d = P[Math.min(i + 2, m)];
    for (let j = 0; j < n; j++) {
      const t = j / n;
      const t2 = t * t;
      const t3 = t2 * t;
      o.push([
        0.5 *
          (2 * b[0] +
            (c[0] - a[0]) * t +
            (2 * a[0] - 5 * b[0] + 4 * c[0] - d[0]) * t2 +
            (3 * b[0] - a[0] - 3 * c[0] + d[0]) * t3),
        0.5 *
          (2 * b[1] +
            (c[1] - a[1]) * t +
            (2 * a[1] - 5 * b[1] + 4 * c[1] - d[1]) * t2 +
            (3 * b[1] - a[1] - 3 * c[1] + d[1]) * t3),
      ]);
    }
  }
  o.push(P[m]);
  return o;
}

function ez(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const red = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let animId: number;
    let isVisible = true;

    let mx = 0;
    let my = 0;
    let lt = -9999;
    let nx = 0;
    let ny = 0;

    const handleResize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      width = cv.clientWidth || window.innerWidth;
      height = cv.clientHeight || window.innerHeight;
      cv.width = width * d;
      cv.height = height * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    });
    observer.observe(cv);

    const handlePointerMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      lt = performance.now();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const drawBrush = (b: BrushDef, U: number, t: number) => {
      const P: [number, number][] = b.p.map((q, i) => [
        q[0] * width + Math.sin(t * b.sp * 5 + i * 1.7 + b.s) * 0.03 * width + nx * b.d * 40,
        q[1] * height + Math.cos(t * b.sp * 4 + i * 2.1 + b.s) * 0.03 * height + ny * b.d * 30,
      ]);

      const L = crv(P, 14);
      const n = L.length - 1;
      const cy = red ? 0.5 : ((t * b.sp + b.ph) % 1 + 1) % 1;
      let hd = 1;
      let tl = 0;

      if (cy < 0.4) {
        hd = ez(cy / 0.4);
      } else if (cy > 0.7) {
        tl = ez((cy - 0.7) / 0.3);
      }

      const i0 = Math.floor(tl * n);
      const i1 = Math.ceil(hd * n);
      if (i1 - i0 < 1) return;

      const w = b.w * U;
      const L2: [number, number, number][] = [
        [0.1, -0.09, 1],
        [0.05, -0.045, 0.94],
        [0, 0, 0.88],
      ];

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let k = 0; k < 3; k++) {
        ctx.strokeStyle = b.c[k];
        ctx.lineWidth = w * L2[k][2];
        ctx.beginPath();
        for (let i = i0; i <= i1; i++) {
          const X = L[i][0] - w * L2[k][0];
          const Y = L[i][1] - w * L2[k][1];
          if (i === i0) ctx.moveTo(X, Y);
          else ctx.lineTo(X, Y);
        }
        ctx.stroke();
      }
    };

    const drawDot = (d: DotDef, s: number) => {
      const x = d.x * width + nx * d.d * 60 + Math.sin(s * 0.8 + d.x * 9) * 12;
      const y = d.y * height + ny * d.d * 45 + Math.cos(s * 0.7 + d.y * 7) * 14;
      ctx.beginPath();
      ctx.arc(x, y, d.r, 0, Math.PI * 2);
      if (d.k) {
        ctx.strokeStyle = d.c;
        ctx.lineWidth = 3;
        ctx.stroke();
      } else {
        ctx.fillStyle = d.c;
        ctx.fill();
      }
    };

    const render = (time: number) => {
      if (isVisible) {
        const s = time / 1000;
        const ap = time - lt > 2500;
        const tx = ap ? Math.sin(s * 0.6) : (mx / window.innerWidth - 0.5) * 2;
        const ty = ap ? Math.cos(s * 0.5) * 0.6 : (my / window.innerHeight - 0.5) * 2;
        nx += (tx - nx) * 0.05;
        ny += (ty - ny) * 0.05;

        const U = Math.max(width, height * 0.6);
        ctx.clearRect(0, 0, width, height);

        HBR.forEach((b) => drawBrush(b, U, s));
        HD.forEach((d) => drawDot(d, s));
      }

      if (!red) {
        animId = requestAnimationFrame(render);
      }
    };

    render(0);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <canvas id="hg" ref={canvasRef} aria-hidden="true" />;
}
