"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/home/Navbar";
import { FooterSection } from "@/components/home/FooterSection";
import { CustomCursor } from "@/components/home/CustomCursor";
import { anton, dmSans } from "@/fonts/font";

// ── Timeline events (sticky stacked cards) ───────────────────────────────────
const EVENTS = [
  {
    index: 0,
    bg: "#1B1030",
    fg: "#F4EEFF",
    year: "2014",
    tag: "Inception Year",
    title: "Inception Year",
    desc: "The DotCom Club was founded in 2014 to support IT and BVOC(SD) students, driven entirely by student initiative. From admissions support and backend management to organizing seminars and flagship events like the E‑Waste Drive and Cyberstrike, this year marked the beginning of a legacy of innovation and community engagement.",
  },
  {
    index: 1,
    bg: "#9E71FF",
    fg: "#1B1030",
    year: "2019",
    tag: "02",
    title: "E‑Waste Drive",
    desc: "Our 2019 E‑Waste Drive made a powerful environmental impact by collecting over 450 kg of e-waste. The event encouraged creativity with competitions like 'Best out of E‑Waste' and poster-making, promoting sustainable practices and eco‑awareness among students.",
  },
  {
    index: 2,
    bg: "#fff",
    fg: "#1B1030",
    year: "Dec 2019",
    tag: "03",
    title: "Cyberstrike",
    desc: "Cyberstrike 2019 was a gaming and tech extravaganza featuring competitive matches in Battlegrounds Mobile, Call of Duty, CS:GO, FIFA 20, and Counter‑Strike. VR technology and robotics workshops made it a truly futuristic edition.",
  },
  {
    index: 3,
    bg: "#5A2FC0",
    fg: "#F4EEFF",
    year: "Feb 2021",
    tag: "04",
    title: "Virtual Cyberstrike",
    desc: "Adapting to pandemic restrictions, Cyberstrike 2021 went completely virtual. Students competed online in COD Mobile, Valorant, and CS:GO, along with Chess, quizzes, Code Wars, and debates.",
  },
  {
    index: 4,
    bg: "#1B1030",
    fg: "#F4EEFF",
    year: "Aug 2022",
    tag: "05",
    title: "E‑Waste Drive: Revive",
    desc: "Under the theme 'Revive,' this E‑Waste Drive collected 306 kg of discarded electronics. The event combined environmental responsibility with fun games like Flip the Bottle, Roll the Dice, and Basketball.",
  },
  {
    index: 5,
    bg: "#9E71FF",
    fg: "#1B1030",
    year: "Jan 2023",
    tag: "06",
    title: "Cyberstrike: Multiversal Odyssey",
    desc: "Cyberstrike 2023, themed 'Multiversal Odyssey,' immersed participants in an interdimensional gaming journey with FIFA 22, Mortal Kombat, COD Mobile, and Counter‑Strike tournaments.",
  },
  {
    index: 6,
    bg: "#EDE5FF",
    fg: "#1B1030",
    year: "Aug 2023",
    tag: "07",
    title: "E‑Waste Drive",
    desc: "This impactful E‑Waste Drive collected 341.25 kg of discarded electronics. It featured an inspiring seminar by Ms. Rashmi Joshi and an awareness drive at Churchgate Station.",
  },
  {
    index: 7,
    bg: "#1B1030",
    fg: "#F4EEFF",
    year: "Jan 2024",
    tag: "08",
    title: "Cyberstrike: Digital Downtown",
    desc: "Cyberstrike 2024 brought 'Digital Downtown' to life with Valorant, BGMI, Mortal Kombat, and FIFA tournaments. Code Hunt and cultural showcases created a balanced blend of gaming, innovation, and creativity.",
  },
  {
    index: 8,
    bg: "#9E71FF",
    fg: "#1B1030",
    year: "Aug 2024",
    tag: "09",
    title: "E‑Waste Drive: Record",
    desc: "A landmark edition — this campaign collected a record‑breaking 454.25 kg of e‑waste. Highlights included a thought‑provoking skit and participation in the Global E‑Waste Conference.",
  },
  {
    index: 9,
    bg: "#5A2FC0",
    fg: "#F4EEFF",
    year: "Jan 2025",
    tag: "10",
    title: "Cyberstrike: Genesis & Exodus",
    desc: "Cyberstrike 2025 embraced the transformative theme 'Genesis & Exodus,' with esports battles, a high‑energy hackathon, vibrant cultural showcases, and an immersive escape room challenge.",
  },
  {
    index: 10,
    bg: "#fff",
    fg: "#1B1030",
    year: "Mar 2025",
    tag: "11",
    title: "Tech‑Surjan 2025",
    desc: "Tech‑Surjan 2025 brought together innovation and entrepreneurship with an intercollegiate exhibition of operational projects, research papers, poster presentations, and startup pitches.",
  },
  {
    index: 11,
    bg: "#1B1030",
    fg: "#9E71FF",
    year: "July 2025",
    tag: "12",
    title: "E‑Waste Drive: 2 Tons",
    desc: "A landmark edition of the E‑Waste Drive — this campaign collected a record‑breaking 2 tons of e‑waste. Highlights included a thought‑provoking skit and a seminar by Waste Management Services.",
  },
];

const MARQUEE_WORDS = [
  "Creativity",
  "Collaboration",
  "Cutting‑edge Technology",
  "Student‑led",
  "Cyberstrike",
];

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Scroll-based nav theme + card progress tracker + heading reveals
  useEffect(() => {
    if (!isLoaded) return;

    const nav = document.querySelector<HTMLElement>("nav");
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("header,section,footer")
    );
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(".ev")
    );
    const pgLabel = document.getElementById("pgt");
    const pgBar = document.getElementById("pgb");

    // Heading reveals
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
      { threshold: 0.4 }
    );
    revealEls.forEach((el) => io.observe(el));

    let lastY = 0;
    const onScroll = () => {
      if (!nav) return;
      const y = window.scrollY;
      const diff = y - lastY;
      nav.classList.toggle("at", y < 24);
      if (Math.abs(diff) > 6) {
        nav.classList.toggle("hide", diff > 0 && y > 220);
        lastY = y;
      }
      // section colour
      let t = "d";
      sections.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= 32 && r.bottom > 32) {
          if (s.matches(".hero")) t = "p";
          else if (s.matches(".jr")) t = "l";
          else t = "d";
        }
      });
      if (nav) nav.dataset.t = t;

      // Card progress
      let n = 1;
      cards.forEach((c, k) => {
        if (c.getBoundingClientRect().top < window.innerHeight * 0.55) n = k + 1;
      });
      setActiveCard(n);
      if (pgLabel) pgLabel.textContent = `${n} / ${cards.length}`;
      if (pgBar) pgBar.style.setProperty("--w", `${(n / cards.length) * 100}%`);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [isLoaded]);

  return (
    <div
      className={`about-root home-root ${isLoaded ? "go" : ""} ${anton.variable} ${dmSans.variable}`}
    >
      <Navbar />
      <CustomCursor />

      {/* FAB – mobile floating button */}
      <a className="fab btn wh" href="#timeline" id="fab">
        Our Journey
      </a>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <header className="hero" id="hero">
        {/* Rotating badge */}
        <svg className="bdg" viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <path id="cp" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
          </defs>
          <text fontSize="19" fontWeight="700" fill="#1B1030" fontFamily="DM Sans,sans-serif">
            <textPath href="#cp" textLength="480" lengthAdjust="spacing">
              JAI HIND COLLEGE • EST. 2014 • TECH CLUB •
            </textPath>
          </text>
          <circle cx="100" cy="100" r="14" fill="#1B1030" />
        </svg>

        <div className="wrap">
          <h1 className="h1 au-h1" aria-label="About DCC">
            <s><i>About</i></s>
            <s><i>DCC<span className="od" aria-hidden="true" /></i></s>
          </h1>
          <div className="c2">
            <p>
              Empowering the next generation of tech innovators through creativity,
              collaboration, and cutting‑edge technology at Jai Hind College.
            </p>
            <a className="btn dk" href="#mission">Our Mission</a>
            <a className="btn ol" href="#timeline" style={{ marginLeft: 8 }}>Our Journey</a>
          </div>
        </div>

        {/* Marquee tapes */}
        <div className="tp t1" aria-hidden="true">
          <div className="mq">
            {[...Array(2)].flatMap((_, i) =>
              MARQUEE_WORDS.map((w, j) => (
                <span key={`${i}-${j}`}>{w}<span style={{ margin: "0 18px" }}>●</span></span>
              ))
            )}
          </div>
        </div>
        <div className="tp t2" aria-hidden="true">
          <div className="mq" style={{ animationDirection: "reverse" }}>
            {[...Array(2)].flatMap((_, i) =>
              MARQUEE_WORDS.map((w, j) => (
                <span key={`${i}-${j}`}>{w}<span style={{ margin: "0 18px" }}>●</span></span>
              ))
            )}
          </div>
        </div>
      </header>

      {/* ── MISSION ──────────────────────────────────────────────── */}
      <section className="mis" id="mission">
        <div className="wrap">
          <h2 className="hd rv">Our Mission</h2>
          <div className="mg">
            <div className="mc">
              <b className="n">01</b>
              <p>
                The BSc IT and BVoc Software Development departments of Jai Hind
                College are dedicated to shaping young minds into future‑ready
                computer professionals through a robust curriculum and dynamic
                co‑curricular activities.
              </p>
            </div>
            <div className="mc">
              <b className="n">02</b>
              <p>
                The <strong>DOT COM CLUB</strong>, the official club of the IT
                and BVoc SD departments, is a club by the students and for the
                students. A new student committee is elected each year,
                encouraging active participation and fostering leadership,
                creativity, and collaboration.
              </p>
            </div>
            <div className="mc">
              <b className="n">03</b>
              <p>
                We organize orientations in fun and informative ways that
                encourage freshers and give them and their parents a clear
                understanding of department life. Our annual tech fest{" "}
                <strong>Cyberstrike</strong> has become a landmark event in the
                college calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── JOURNEY (sticky stacked cards) ───────────────────────── */}
      <section className="jr" id="timeline">
        <div className="wrap">
          <h2 className="hd rv">Our Journey</h2>
          <p className="lead">Explore our innovation journey</p>

          {/* Progress bar */}
          <div className="pg" aria-hidden="true">
            <span id="pgt">1 / {EVENTS.length}</span>
            <u id="pgb" />
          </div>

          {/* Stacked sticky cards */}
          <div id="stack">
            {EVENTS.map((ev) => (
              <article
                key={ev.index}
                className="ev"
                style={
                  {
                    "--i": ev.index,
                    "--b": ev.bg,
                    "--f": ev.fg,
                  } as React.CSSProperties
                }
              >
                <div className="tr">
                  <span>Timeline</span>
                  <span className="tg">{ev.tag}</span>
                </div>
                <div>
                  <div className="yr">{ev.year}</div>
                  <h3>{ev.title}</h3>
                  <p>{ev.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER (same as /blogs) ───────────────────────────────── */}
      <FooterSection />
    </div>
  );
}
