"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  l: number;
  r: number;
  c: string;
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;

    const cv = canvasRef.current;
    const r = cursorRef.current;
    if (!cv || !r) return;

    const rd = r.firstElementChild as HTMLElement | null;
    const rl = r.lastElementChild as HTMLElement | null;
    const ctx = cv.getContext("2d");
    if (!ctx || !rd || !rl) return;

    const root = document.documentElement;
    let x = -99;
    let y = -99;
    let hx = -99;
    let hy = -99;
    let on = false;
    let hov = false;
    let ta = 1;
    let st = 0;
    let ang = 0;
    let dirty = false;
    let animId: number;

    const N = 14;
    const pts = Array.from({ length: N }, () => ({ x: -99, y: -99 }));
    let ps: Particle[] = [];
    const cl = ["#9E71FF", "#fff", "#C9B2FF", "#5A2FC0"];
    const HS = "a, summary, button, .person, .ev, .why li, .cd";

    const crs = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = window.innerWidth * d;
      cv.height = window.innerHeight * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    crs();
    window.addEventListener("resize", crs);

    const upd = (t: Element | null) => {
      const el = t?.closest?.(HS);
      const sm = !!t?.closest?.("nav, .mnu");
      let lb = "";

      hov = !!el;
      r.classList.toggle("h", hov);
      r.classList.toggle("s", sm && hov);

      if (el && !sm) {
        if (el.id === "snd" || el.closest(".why li")) {
          lb = "";
        } else if (el.matches("summary")) {
          lb = "open";
        } else if (el.matches(".vid")) {
          lb = "play";
        } else if (el.closest(".person")) {
          lb = "hi";
        } else if (el.closest(".cd") && !el.matches("a")) {
          lb = "read";
        } else if (el.closest(".ev") && !el.matches("a")) {
          lb = "read";
        } else {
          lb = "go";
        }
      }

      if (rl.textContent !== lb) {
        rl.textContent = lb;
      }
    };

    const show = () => {
      on = true;
      hx = x;
      hy = y;
      pts.forEach((q) => {
        q.x = x;
        q.y = y;
      });
      r.style.opacity = "1";
      root.classList.add("cc");
    };

    const hide = () => {
      on = false;
      r.style.opacity = "0";
      r.classList.remove("d");
      root.classList.remove("cc");
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (!on) show();
      upd(e.target as Element | null);
    };

    const handleScroll = () => {
      dirty = true;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!on || e.pointerType === "touch") return;
      r.classList.add("d");
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
        const v = 3 + Math.random() * 6;
        ps.push({
          x: hx,
          y: hy,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          l: 1,
          r: 3 + Math.random() * 5,
          c: cl[i % 4],
        });
      }
    };

    const handlePointerUp = () => {
      r.classList.remove("d");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    root.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    // Magnetic buttons
    const handleBtnMove = (e: Event) => {
      const pe = e as PointerEvent;
      const b = e.currentTarget as HTMLElement;
      const rect = b.getBoundingClientRect();
      b.style.transform = `translate(${(pe.clientX - rect.left - rect.width / 2) * 0.25}px, ${(pe.clientY - rect.top - rect.height / 2) * 0.35}px)`;
    };

    const handleBtnLeave = (e: Event) => {
      const b = e.currentTarget as HTMLElement;
      b.style.transform = "";
    };

    const buttons = document.querySelectorAll<HTMLElement>(".home-root .btn");
    buttons.forEach((b) => {
      b.addEventListener("pointermove", handleBtnMove);
      b.addEventListener("pointerleave", handleBtnLeave);
    });

    const loop = () => {
      if (dirty && on) {
        dirty = false;
        const t = document.elementFromPoint(x, y);
        if (t) upd(t);
      }

      const px = hx;
      const py = hy;
      hx += (x - hx) * 0.3;
      hy += (y - hy) * 0.3;
      const vx = hx - px;
      const vy = hy - py;
      const sp = Math.hypot(vx, vy);

      if (sp > 0.5) ang = Math.atan2(vy, vx);
      st += ((hov ? 0 : sp) - st) * 0.25;

      r.style.transform = `translate3d(${hx}px, ${hy}px, 0)`;
      rd.style.transform =
        hov || st < 0.3
          ? ""
          : `rotate(${ang}rad) scale(${1 + Math.min(st * 0.06, 1.3)}, ${1 - Math.min(st * 0.018, 0.35)})`;

      let pv = { x: hx, y: hy };
      pts.forEach((q) => {
        q.x += (pv.x - q.x) * 0.38;
        q.y += (pv.y - q.y) * 0.38;
        pv = q;
      });

      ta += ((hov || !on ? 0 : 1) - ta) * 0.2;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#1B1030";

      if (ta > 0.02) {
        ctx.globalAlpha = ta;
        for (let i = N - 1; i >= 0; i--) {
          ctx.fillStyle = cl[0];
          ctx.beginPath();
          ctx.arc(pts[i].x, pts[i].y, Math.max(1.5, 8 - i * 0.48), 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      ps = ps.filter((q) => q.l > 0);
      ps.forEach((q) => {
        q.x += q.vx;
        q.y += q.vy;
        q.vy += 0.18;
        q.vx *= 0.97;
        q.l -= 0.025;
        ctx.fillStyle = q.c;
        ctx.beginPath();
        ctx.arc(q.x, q.y, Math.max(0, q.r * q.l), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      root.classList.remove("cc");
      window.removeEventListener("resize", crs);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      root.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      buttons.forEach((b) => {
        b.removeEventListener("pointermove", handleBtnMove);
        b.removeEventListener("pointerleave", handleBtnLeave);
      });
    };
  }, []);

  return (
    <>
      <canvas id="ct" ref={canvasRef} aria-hidden="true" />
      <div className="cr" id="cr" ref={cursorRef}>
        <i />
        <b />
      </div>
    </>
  );
}
