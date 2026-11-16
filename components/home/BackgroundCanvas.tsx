"use client";

import { useEffect, useRef } from "react";

interface BlobDef {
  x: number;
  y: number;
  r: number;
  sx: number;
  sy: number;
  col: string;
  d: number;
  a: number;
  sp: number;
  s: number;
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

const DB: BlobDef[] = [
  { x: 0.15, y: 0.2, r: 0.5, sx: 1.1, sy: 1, col: "#150E27", d: 0.5, a: 0.12, sp: 0.3, s: 1 },
  { x: 0.9, y: 0.55, r: 0.45, sx: 1, sy: 1.2, col: "#1C1236", d: 0.9, a: 0.14, sp: 0.35, s: 3 },
  { x: 0.35, y: 1, r: 0.55, sx: 1.3, sy: 1, col: "#120B22", d: 0.7, a: 0.1, sp: 0.28, s: 5 },
  { x: 0.78, y: 0.1, r: 0.2, sx: 1, sy: 1, col: "rgba(158,113,255,.13)", d: 1.2, a: 0.18, sp: 0.5, s: 7 },
];

const DBR: BrushDef[] = [
  {
    p: [
      [-0.1, 0.14],
      [0.25, 0.05],
      [0.55, 0.2],
      [0.85, 0.05],
      [1.1, 0.16],
    ],
    w: 0.12,
    c: ["#22124F", "#3E2290", "#5B33C2"],
    d: 0.6,
    sp: 0.06,
    ph: 0.1,
    s: 2,
  },
  {
    p: [
      [1.1, 0.56],
      [0.8, 0.66],
      [0.6, 0.5],
      [0.3, 0.72],
      [-0.1, 0.6],
    ],
    w: 0.11,
    c: ["#22124F", "#3E2290", "#5B33C2"],
    d: 1,
    sp: 0.05,
    ph: 0.5,
    s: 4,
  },
  {
    p: [
      [-0.1, 0.95],
      [0.3, 0.85],
      [0.6, 1.05],
      [1.1, 0.9],
    ],
    w: 0.1,
    c: ["#22124F", "#3E2290", "#5B33C2"],
    d: 0.8,
    sp: 0.055,
    ph: 0.8,
    s: 6,
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

export function BackgroundCanvas() {
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

    const handlePointerMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      lt = performance.now();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const drawBlob = (b: BlobDef, U: number, t: number) => {
      const n = 8;
      const P: [number, number][] = [];
      const cx =
        b.x * width +
        Math.sin(t * 0.2 + b.s) * 0.05 * width +
        nx * b.d * 48;
      const cy =
        b.y * height +
        Math.cos(t * 0.17 + b.s) * 0.04 * height +
        ny * b.d * 36 +
        Math.sin(window.scrollY / 900 + b.s) * height * 0.12 * b.d;

      for (let i = 0; i < n; i++) {
        const a = (i / n) * 6.28318530718;
        const r =
          b.r *
          U *
          (1 +
            b.a * Math.sin(t * b.sp + i * 2.3 + b.s) +
            b.a * 0.6 * Math.sin(t * b.sp * 1.7 + i * 1.1 + b.s * 2));
        P.push([cx + Math.cos(a) * r * b.sx, cy + Math.sin(a) * r * b.sy]);
      }

      ctx.fillStyle = b.col;
      ctx.beginPath();
      ctx.moveTo((P[n - 1][0] + P[0][0]) / 2, (P[n - 1][1] + P[0][1]) / 2);
      for (let i = 0; i < n; i++) {
        const q = P[(i + 1) % n];
        ctx.quadraticCurveTo(P[i][0], P[i][1], (P[i][0] + q[0]) / 2, (P[i][1] + q[1]) / 2);
      }
      ctx.fill();
    };

    const drawBrush = (b: BrushDef, U: number, t: number) => {
      const P: [number, number][] = b.p.map((q, i) => [
        q[0] * width + Math.sin(t * b.sp * 5 + i * 1.7 + b.s) * 0.03 * width + nx * b.d * 40,
        q[1] * height +
          Math.cos(t * b.sp * 4 + i * 2.1 + b.s) * 0.03 * height +
          ny * b.d * 30 +
          Math.sin(window.scrollY / 900 + b.s) * height * 0.1 * b.d,
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

    const render = (time: number) => {
      const s = time / 1000;
      const ap = time - lt > 2500;
      const tx = ap ? Math.sin(s * 0.6) : (mx / window.innerWidth - 0.5) * 2;
      const ty = ap ? Math.cos(s * 0.5) * 0.6 : (my / window.innerHeight - 0.5) * 2;
      nx += (tx - nx) * 0.05;
      ny += (ty - ny) * 0.05;

      const U = Math.max(width, height * 0.6);
      ctx.clearRect(0, 0, width, height);

      DB.forEach((b) => drawBlob(b, U, s));
      DBR.forEach((b) => drawBrush(b, U, s));

      if (!red) {
        animId = requestAnimationFrame(render);
      }
    };

    render(0);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <canvas id="bg" ref={canvasRef} aria-hidden="true" />;
}
