"use client";
import { zentry } from "@/fonts/font";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Subtle, purposeful links for DCC
const footerNavLinks = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "About Us", href: "/about-us" },
  { name: "Sponsors", href: "/sponsors" },
  { name: "Teams", href: "/teams" },
  { name: "Magazines", href: "/magazines" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "Terms and Conditions", href: "/terms-and-conditions" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Refund Policy", href: "/refund-policy" },
];

const socialLinks = [
  {
    name: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    url: "https://www.instagram.com/dotcomclubjhc/",
  },
  {
    name: "YouTube",
    icon: <Youtube className="h-5 w-5" />,
    url: "https://www.youtube.com/@JhcDcc/",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    url: "https://www.linkedin.com/company/dotcomclub/",
  },
  {
    name: "Email",
    icon: <Mail className="h-5 w-5" />,
    url: "mailto:jhcdotcomclub.official@gmail.com",
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterShell>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top status bar */}
        <div className="flex items-center justify-between border-b border-red-900/30 py-4 mb-8 text-xs text-neutral-300/80">
          {/* <span className="inline-flex items-center gap-2 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500/40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            SYSTEM: DCC CORE v2.0
          </span>
          <span className="font-mono">STATUS: OPERATIONAL</span> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Brand */}
          <motion.div
            className="text-left"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-start gap-2">
              <Image
                src="/images/dcc-logo.png"
                alt="JHC DCC Logo"
                width={84}
                height={84}
                className="object-contain"
              />
              <Link href="/" className="inline-flex items-center gap-3">
                <span
                  className={cn(
                    "text-2xl sm:text-3xl font-extrabold tracking-wider text-white",
                    zentry.className
                  )}
                >
                  Dot Com Club
                </span>
                <span className="font-mono text-[10px] px-2 py-1 rounded border border-red-900/40 text-red-300/90">
                  EST. 2014
                </span>
              </Link>
              </div>

            <p className="mt-3 text-sm text-neutral-300/80 max-w-xs">
              Empowering digital creativity and innovation through technology.
            </p>
          </motion.div>

          {/* Quick Links - compact, no gradients */}
          <motion.nav
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            aria-label="Footer Navigation"
          >
            <h3 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-6">
              {footerNavLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-neutral-300/80 hover:text-white transition-colors"
                  >
                    <span className="h-px w-0 bg-red-500/70 transition-all duration-300 group-hover:w-4"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Social / Contact */}
          <motion.div
            className="w-full md:justify-self-end"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase mb-4">
              Connect
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-red-900/40 text-neutral-200 hover:text-white hover:border-red-500/60 transition-colors"
                >
                  {social.icon}
                </Link>
              ))}
            </div>

            {/* <div className="mt-6 rounded-md border border-red-900/30 p-4">
              <p className="font-mono text-[11px] text-neutral-300/80">
                NEXT MILESTONE: Cyberstrike • Community • Innovation
              </p>
            </div> */}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-red-900/30 text-center">
          <div className="text-sm text-neutral-400 py-4">
            &copy; {currentYear} DCC • Brought to life by DCC Web‑Ops Team
          </div>
        </div>
      </div>
    </FooterShell>
  );
};

// Minimal, theme-aligned shell (replaces heavy gradients)
export const FooterShell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <footer
      className={cn(
        "relative w-full bg-black text-white overflow-hidden",
        className
      )}
    >
      {/* Subtle red tech grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(239,68,68,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      />
      {/* Thin top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-red-500/30" />

      <div className="relative">{children}</div>
    </footer>
  );
};