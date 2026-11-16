"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Instagram, Youtube, Linkedin, Mail } from "lucide-react";

export function FooterSection() {
  const bigWordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bigWordmarkRef.current;
    if (!bg) return;

    const fit = () => {
      bg.style.fontSize = "100px";
      const r = document.createRange();
      r.selectNodeContents(bg);
      const w = r.getBoundingClientRect().width;
      const cw = bg.clientWidth;
      if (w > 0 && cw > 0) {
        bg.style.fontSize = `${Math.floor((100 * (cw - 2)) / w)}px`;
      }
    };

    fit();
    window.addEventListener("resize", fit);
    if (document.fonts) {
      document.fonts.ready.then(fit);
    }

    return () => {
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <footer id="contact">
      <div className="wrap">
        <div>
          <Link className="logo" href="/" aria-label="Dot Com Club, est. 2014">
            <span className="lw">
              Dot<i></i>Com
              <br />
              Club
            </span>
            <small>Est. 2014</small>
          </Link>
          <p>Empowering digital creativity and innovation through technology.</p>
        </div>

        <div>
          <b className="footer-col-title">Quick Links</b>
          <div className="flex flex-col">
            <Link href="/" prefetch={true}>Home</Link>
            <Link href="/blogs" prefetch={true}>Blogs</Link>
            <Link href="/events" prefetch={true}>Events</Link>
            <Link href="/about-us" prefetch={true}>About Us</Link>
            <Link href="/sponsors" prefetch={true}>Sponsors</Link>
            <Link href="/teams" prefetch={true}>Teams</Link>
            <Link href="/magazines" prefetch={true}>Magazines</Link>
            <Link href="/contact-us" prefetch={true}>Contact Us</Link>
            <Link href="/ewaste-26" prefetch={true}>E-waste</Link>
          </div>
        </div>

        <div>
          <b className="footer-col-title">Legal</b>
          <div className="flex flex-col">
            <Link href="/terms-and-conditions" prefetch={true}>Terms and Conditions</Link>
            <Link href="/privacy-policy" prefetch={true}>Privacy Policy</Link>
            <Link href="/refund-policy" prefetch={true}>Refund Policy</Link>
          </div>
        </div>

        <div>
          <b className="footer-col-title">Connect</b>
          <div className="flex flex-col">
            <a
              className="social-link"
              href="https://www.instagram.com/dotcomclubjhc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Dot Com Club on Instagram"
            >
              <Instagram className="w-4 h-4 shrink-0 text-[var(--p)]" />
              <span>Instagram</span>
            </a>
            <a
              className="social-link"
              href="https://www.youtube.com/@JhcDcc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe to Dot Com Club on YouTube"
            >
              <Youtube className="w-4 h-4 shrink-0 text-[var(--p)]" />
              <span>YouTube</span>
            </a>
            <a
              className="social-link"
              href="https://www.linkedin.com/company/dotcomclub/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with Dot Com Club on LinkedIn"
            >
              <Linkedin className="w-4 h-4 shrink-0 text-[var(--p)]" />
              <span>LinkedIn</span>
            </a>
            <a
              className="social-link"
              href="mailto:jhcdotcomclub.official@gmail.com"
              aria-label="Email Dot Com Club"
            >
              <Mail className="w-4 h-4 shrink-0 text-[var(--p)]" />
              <span>Email</span>
            </a>
          </div>
        </div>

        <div className="big" ref={bigWordmarkRef} aria-hidden="true">
          dotcomclub<i>.</i>com
        </div>

        <div className="copy">
          © 2026 DCC • Brought to life by DCC Web‑Ops Team
        </div>
      </div>
    </footer>
  );
}
