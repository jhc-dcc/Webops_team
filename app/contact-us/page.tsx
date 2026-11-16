"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Navbar } from "@/components/home/Navbar";
import { FooterSection } from "@/components/home/FooterSection";
import { CustomCursor } from "@/components/home/CustomCursor";
import { anton, dmSans } from "@/fonts/font";

const MARQUEE_WORDS = [
  "Events",
  "Memberships",
  "Collaborations",
  "Queries",
  "Fast reply",
];

export default function ContactUsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [knobRotation1, setKnobRotation1] = useState(0);
  const [knobRotation2, setKnobRotation2] = useState(0);
  const [isTvActive, setIsTvActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tvRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Trigger static canvas noise
  const triggerStaticNoise = useCallback((durationMs: number = 400) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (noiseTimerRef.current) {
      clearInterval(noiseTimerRef.current);
    }

    canvas.classList.add("a");
    const startTime = Date.now();

    noiseTimerRef.current = setInterval(() => {
      try {
        const imgData = ctx.createImageData(160, 110);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const val = Math.random() * 255;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
          data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
      } catch {
        // Safe catch for canvas manipulation
      }

      if (Date.now() - startTime > durationMs) {
        if (noiseTimerRef.current) clearInterval(noiseTimerRef.current);
        canvas.classList.remove("a");
      }
    }, 60);
  }, []);

  // Knob interaction
  const handleKnobClick = (knobIndex: number) => {
    if (knobIndex === 1) {
      setKnobRotation1((prev) => prev + 70);
    } else {
      setKnobRotation2((prev) => prev + 70);
    }
    triggerStaticNoise(350);
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = userName.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    triggerStaticNoise(450);
    setTimeout(() => {
      setSubmittedName(trimmed);
      inputRef.current?.blur();
    }, 300);
  };

  // Lifecycle initialization & Intersection Observers
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    // CRT TV observer
    const tvElement = tvRef.current;
    if (tvElement) {
      const tvObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsTvActive(true);
            triggerStaticNoise(500);
            tvObserver.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      tvObserver.observe(tvElement);
    }

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

    // Scroll listener for dynamic nav themes & FAB visibility
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
            if (s.matches(".hero, .cn")) theme = "p";
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
      if (noiseTimerRef.current) clearInterval(noiseTimerRef.current);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [triggerStaticNoise]);

  return (
    <div
      className={`contact-root home-root ${isLoaded ? "go" : ""} ${anton.variable} ${dmSans.variable}`}
    >
      <Navbar />
      <CustomCursor />

      {/* Floating CTA for Mobile */}
      <a className="btn wh fab" id="fab" href="#tv">
        Say Hello
      </a>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
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
          <h1 className="h1" aria-label="Contact DCC">
            <s>
              <i>Contact</i>
            </s>
            <s>
              <i>DCC</i>
            </s>
          </h1>
          <div className="c2">
            <p>
              Get in touch with us for any queries related to events, memberships,
              or collaborations.
            </p>
            <a className="btn dk" href="#tv">
              Say Hello
            </a>
            <a className="btn ol" href="#info">
              Contact Info
            </a>
          </div>
        </div>

        {/* Crossing marquee tapes */}
        <div className="tp t1" aria-hidden="true">
          <div className="mq">
            {[...Array(4)].flatMap((_, i) =>
              MARQUEE_WORDS.map((w, j) => (
                <span key={`t1-${i}-${j}`}>
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
                <span key={`t2-${i}-${j}`}>
                  <span>{w}</span>
                  <span>●</span>
                </span>
              ))
            )}
          </div>
        </div>
      </header>

      {/* ── RETRO INTERACTIVE TV TRANSMISSION SECTION ─────────────────────── */}
      <section className="tsec" id="tv">
        <div className="wrap">
          <div className="tvw">
            {/* TV Antenna */}
            <div className="ant" aria-hidden="true" />

            {/* Vintage CRT TV Cabinet */}
            <div className={`tv ${isTvActive ? "in" : ""}`} id="tvb" ref={tvRef}>
              <div className="scr">
                <div className="pic">
                  <h3 className="ln2" style={{ "--d": 0 } as React.CSSProperties}>
                    Ready to receive transmission.
                  </h3>
                  <p className="ln2" style={{ "--d": 1 } as React.CSSProperties}>
                    Please provide the following information:
                  </p>

                  {!submittedName ? (
                    <>
                      <form
                        className="pr ln2"
                        id="fm"
                        style={{ "--d": 2 } as React.CSSProperties}
                        autoComplete="off"
                        onSubmit={handleSubmit}
                      >
                        <label htmlFor="nm">Enter your name:</label>
                        <input
                          id="nm"
                          ref={inputRef}
                          maxLength={40}
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Your Name"
                        />
                        <button type="submit">ENTER ↵</button>
                      </form>
                      <p
                        className="ln2"
                        style={{ "--d": 3 } as React.CSSProperties}
                        id="hint"
                      >
                        Press [ENTER] to continue...
                        <span className="cur" />
                      </p>
                    </>
                  ) : (
                    <div id="out" aria-live="polite">
                      <p className="g">Name received: {submittedName}</p>
                      <p>
                        Transmission channel open. Send your message to the DCC
                        team:
                      </p>
                      <a
                        className="btn"
                        href={`mailto:jhcdotcomclub.official@gmail.com?subject=${encodeURIComponent(
                          "Message for DCC"
                        )}&body=${encodeURIComponent(
                          `Hi DCC, I am ${submittedName}.\n\n`
                        )}`}
                      >
                        Send message →
                      </a>
                    </div>
                  )}
                </div>

                {/* Static Noise Canvas */}
                <canvas
                  className="nz"
                  id="nz"
                  ref={canvasRef}
                  width="160"
                  height="110"
                  aria-hidden="true"
                />
              </div>

              {/* Physical Control Panel on TV */}
              <div className="pn" aria-hidden="false">
                <button
                  className="kn"
                  type="button"
                  aria-label="Change channel"
                  onClick={() => handleKnobClick(1)}
                  style={{ rotate: `${knobRotation1}deg` }}
                />
                <button
                  className="kn"
                  type="button"
                  aria-label="Adjust volume"
                  onClick={() => handleKnobClick(2)}
                  style={{ rotate: `${knobRotation2}deg` }}
                />
                <div className="spk" aria-hidden="true" />
                <div className="led" aria-hidden="true" />
              </div>
            </div>

            {/* TV Stand Feet */}
            <div className="ft" aria-hidden="true">
              <i />
              <i />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO SECTION ─────────────────────────────────────────── */}
      <section className="jr" id="info">
        <div className="wrap">
          <h2 className="hd rv">
            <span className="ln">
              <i>Contact Info</i>
            </span>
          </h2>
          <ul className="ir">
            <li>
              <em>Address</em>
              <div className="v">
                Jai Hind College, “A” Road, Churchgate,
                <br />
                Mumbai, Maharashtra 400020
              </div>
            </li>
            <li>
              <em>Email</em>
              <div className="v">
                <a href="mailto:jhcdotcomclub.official@gmail.com">
                  jhcdotcomclub.official@gmail.com
                </a>
              </div>
            </li>
            <li>
              <em>Phone</em>
              <div className="ph2">
                <div className="v">
                  Hussain Tinwala
                  <small>
                    <a href="tel:+919867069971">+91 9867069971</a>
                  </small>
                </div>
                <div className="v">
                  Bhalchandra
                  <small>
                    <a href="tel:+919152854203">+91 9152854203</a>
                  </small>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* ── CONNECT DCC SECTION ─────────────────────────────────────────── */}
      <section className="cn" id="connect">
        <div className="wrap">
          <h2 className="hd rv">
            <span className="ln">
              <i>Connect DCC</i>
            </span>
          </h2>
          <div className="cg">
            <div>
              <h3>Follow us</h3>
              <ul className="so">
                <li>
                  <a
                    href="https://www.instagram.com/dotcomclubjhc/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@JhcDcc/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/dotcomclub/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="mailto:jhcdotcomclub.official@gmail.com">Email</a>
                </li>
              </ul>
            </div>
            <div>
              <h3>Quick response</h3>
              <p>
                Get in touch with us for any queries related to events,
                memberships, or collaborations.
              </p>
              <div className="flex gap-2 items-center flex-wrap">
                <span className="pill f">Online</span>
                <span className="pill">Fast reply</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER (Consistent with /blogs, /about-us, /sponsors) ────────── */}
      <FooterSection />
    </div>
  );
}
