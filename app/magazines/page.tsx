"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Navbar } from "@/components/home/Navbar";
import { FooterSection } from "@/components/home/FooterSection";
import { CustomCursor } from "@/components/home/CustomCursor";
import { anton, dmSans } from "@/fonts/font";

const MARQUEE_WORDS = [
  "Quick reads",
  "Big ideas",
  "Future tech",
  "Magazines",
  "Newsletters",
];

interface VolumeItem {
  vol: string;
  year: string;
  title: string;
  image: string;
  url: string;
}

const RECENT_RELEASE = {
  year: "2025",
  title: "Magazine-Issue 1",
  url: "https://heyzine.com/flip-book/263c4f6940.html?fbclid=PAVERDUAMbh_JleHRuA2FlbQIxMAABp2xhlSXwA3HVec5oUiuOjZ-OjKgkNBfr43Qt6VSvgSdOdy6Hh0Nnjr5LlLF2_aem_iYhYAgxyAqVpeLiVFn7WTw",
  image: "/magzine1img.png",
  editionTag: "Latest edition",
  badge: "New",
};

const PAST_VOLUMES: VolumeItem[] = [
  {
    vol: "6",
    year: "2024",
    title: "Newsletter Volume 6",
    image: "/magzine/vol6.jpg",
    url: "https://heyzine.com/flip-book/2b12fc8496.html",
  },
  {
    vol: "5",
    year: "2023",
    title: "Newsletter Volume 5",
    image: "/magzine/vol5.jpg",
    url: "https://heyzine.com/flip-book/3850cde9d3.html",
  },
  {
    vol: "4",
    year: "2021",
    title: "Newsletter Volume 4",
    image: "/magzine/vol4.jpg",
    url: "https://heyzine.com/flip-book/07612552b2.html",
  },
  {
    vol: "3",
    year: "2020",
    title: "Newsletter Volume 3",
    image: "/magzine/vol3.png",
    url: "https://heyzine.com/flip-book/ed4ecf4831.html",
  },
  {
    vol: "2",
    year: "December 2019",
    title: "Newsletter Volume 2",
    image: "/magzine/vol2.jpg",
    url: "https://heyzine.com/flip-book/29f054e0f3.html",
  },
  {
    vol: "1",
    year: "April 2019",
    title: "Newsletter Volume 1",
    image: "/magzine/vol1.jpg",
    url: "https://heyzine.com/flip-book/c94dcd94c0.html",
  },
];

export default function MagazinesPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoverVol, setHoverVol] = useState<string>("6");
  const [hoverImg, setHoverImg] = useState<string>("/magzine/vol6.jpg");
  const [isHoverActive, setIsHoverActive] = useState<boolean>(false);

  // Hover preview physics refs
  const hoverCardRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef<{ x: number; y: number; cx: number; cy: number; rot: number }>({
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,
    rot: 0,
  });
  const rafIdRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);

  // Smooth floating hover card physics loop
  const updateHoverCard = useCallback(() => {
    const card = hoverCardRef.current;
    if (!card) return;

    const pos = mousePosRef.current;
    const dx = pos.x - pos.cx;
    pos.cx += dx * 0.14;
    pos.cy += (pos.y - pos.cy) * 0.14;
    pos.rot += (Math.max(-14, Math.min(14, dx * 0.35)) - pos.rot) * 0.15;

    card.style.transform = `translate3d(${pos.cx + 28}px, ${pos.cy - 120}px, 0) rotate(${pos.rot}deg)`;

    if (card.classList.contains("on") || Math.abs(dx) > 0.5) {
      rafIdRef.current = requestAnimationFrame(updateHoverCard);
    } else {
      isRunningRef.current = false;
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLUListElement>) => {
    mousePosRef.current.x = e.clientX;
    mousePosRef.current.y = e.clientY;
  }, []);

  const handleRowMouseEnter = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: VolumeItem
  ) => {
    setHoverVol(item.vol);
    setHoverImg(item.image);
    setIsHoverActive(true);

    if (!isHoverActive) {
      mousePosRef.current.cx = mousePosRef.current.x = e.clientX;
      mousePosRef.current.cy = mousePosRef.current.y = e.clientY;
    }

    if (!isRunningRef.current) {
      isRunningRef.current = true;
      rafIdRef.current = requestAnimationFrame(updateHoverCard);
    }
  };

  const handleRowMouseLeave = () => {
    setIsHoverActive(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    // Heading text reveals (.rv)
    const revealEls = document.querySelectorAll(".rv");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    revealEls.forEach((el) => io.observe(el));

    // Scroll listener for dynamic navbar themes & FAB visibility
    const nav = document.querySelector<HTMLElement>("nav");
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("header, section, footer")
    );
    const fab = document.getElementById("fab");
    let lastY = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastY;
      if (nav) {
        nav.classList.toggle("at", y < 24);
        if (Math.abs(diff) > 6) {
          nav.classList.toggle("hide", diff > 0 && y > 220);
          lastY = y;
        }

        // Section colour theme
        let theme: "p" | "l" | "d" = "d";
        sections.forEach((s) => {
          const r = s.getBoundingClientRect();
          if (r.top <= 32 && r.bottom > 32) {
            if (s.matches(".hero")) theme = "p";
            else if (s.matches(".jr")) theme = "l";
            else theme = "d";
          }
        });
        nav.dataset.t = theme;
      }

      // FAB visibility
      if (fab) {
        fab.classList.toggle(
          "s",
          y > window.innerHeight * 0.7 && !document.body.classList.contains("lock")
        );
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      clearTimeout(timer);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [updateHoverCard]);

  return (
    <div
      className={`magazine-root home-root ${isLoaded ? "go" : ""} ${anton.variable} ${dmSans.variable}`}
    >
      <Navbar />
      <CustomCursor />

      {/* Floating CTA for Mobile */}
      <a className="btn wh fab" id="fab" href="#past">
        Past Volumes
      </a>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <header className="hero" id="hero">
        {/* Rotating badge */}
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
            fontFamily="DM Sans,sans-serif"
          >
            <textPath href="#cp" textLength="480" lengthAdjust="spacing">
              JAI HIND COLLEGE • EST. 2014 • TECH CLUB •
            </textPath>
          </text>
          <circle cx="100" cy="100" r="14" fill="#1B1030" />
        </svg>

        <div className="wrap">
          <h1 className="h1" aria-label="The Digital Dispatch">
            <s>
              <i>The Digital</i>
            </s>
            <s>
              <i>Dispatch</i>
            </s>
          </h1>
          <div className="c2">
            <p>Quick reads. Big ideas. Future tech.</p>
            <a className="btn dk" href="#recent">
              Recent Release
            </a>
            <a className="btn ol" href="#past" style={{ marginLeft: 8 }}>
              Past Volumes
            </a>
          </div>
        </div>

        {/* Crossing marquee tapes */}
        <div className="tp t1" aria-hidden="true">
          <div className="mq">
            {[...Array(4)].flatMap((_, i) =>
              MARQUEE_WORDS.map((w, j) => (
                <span key={`m1-${i}-${j}`}>
                  <span>{w}</span>
                  <span>●</span>
                </span>
              ))
            )}
          </div>
        </div>
        <div className="tp t2" aria-hidden="true">
          <div className="mq">
            {[...Array(4)].flatMap((_, i) =>
              MARQUEE_WORDS.map((w, j) => (
                <span key={`m2-${i}-${j}`}>
                  <span>{w}</span>
                  <span>●</span>
                </span>
              ))
            )}
          </div>
        </div>
      </header>

      {/* ── RECENT RELEASE SECTION ───────────────────────────────────────── */}
      <section className="rec" id="recent">
        <div className="wrap">
          <h2 className="hd rv">
            <span className="ln">
              <i>Recent Release</i>
            </span>
          </h2>
          <p className="lead">
            Discover our latest edition featuring cutting-edge tech insights and
            innovations.
          </p>

          <article className="fe">
            <div>
              <div className="tr">
                <span>{RECENT_RELEASE.editionTag}</span>
                <span className="tg">{RECENT_RELEASE.badge}</span>
              </div>
              <div className="yr">{RECENT_RELEASE.year}</div>
              <h3>{RECENT_RELEASE.title}</h3>
              <a
                className="rd"
                href={RECENT_RELEASE.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                READ MORE →
              </a>
            </div>

            <div className="cv" aria-hidden="true">
              <small>The Digital Dispatch</small>
              <b>Issue 1</b>
              {/* Cover Mockup Image */}
              <Image
                src={RECENT_RELEASE.image}
                alt="Magazine Issue 1 Cover"
                fill
                sizes="(max-width: 900px) 78vw, 340px"
                className="object-cover rounded-[14px]"
                priority
              />
            </div>
          </article>
        </div>
      </section>

      {/* ── PAST VOLUMES SECTION ─────────────────────────────────────────── */}
      <section className="jr" id="past">
        <div className="wrap">
          <h2 className="hd rv">
            <span className="ln">
              <i>Past Volumes</i>
            </span>
          </h2>
          <p className="lead">
            Explore our archive of previous editions and revisit groundbreaking
            stories.
          </p>

          <ul className="vl" onPointerMove={handlePointerMove}>
            {PAST_VOLUMES.map((item) => (
              <li key={item.vol}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-img={item.image}
                  data-n={item.vol}
                  onMouseEnter={(e) => handleRowMouseEnter(e, item)}
                  onMouseLeave={handleRowMouseLeave}
                >
                  <em>{item.year}</em>
                  <h3>{item.title}</h3>
                  <span>READ MORE →</span>

                  {/* Inline touch thumbnail for mobile */}
                  <img
                    className="tm"
                    alt={item.title}
                    loading="lazy"
                    src={item.image}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FLOATING HOVER PREVIEW CARD (DESKTOP) ─────────────────────────── */}
      <div
        className={`hv ${isHoverActive ? "on" : ""}`}
        id="hv"
        ref={hoverCardRef}
        aria-hidden="true"
      >
        <div className="ph">
          <small>Newsletter</small>
          <b id="hn">Vol {hoverVol}</b>
        </div>
        {hoverImg && (
          <img
            id="hi"
            src={hoverImg}
            alt="Volume Preview"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        )}
      </div>

      {/* ── FOOTER SECTION ───────────────────────────────────────────────── */}
      <FooterSection />
    </div>
  );
}
