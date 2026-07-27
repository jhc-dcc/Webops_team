"use client";
import { satoshi } from "@/fonts/font";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { HoverBorderGradient } from "./hover-border-gradient";

const navItems = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Blogs",
    link: "/blogs",
  },
  {
    name: "About Us",
    link: "/about-us",
  },
  {
    name: "Sponsors",
    link: "/sponsors",
  },
  {
    name: "Teams",
    link: "/teams",
  },
  {
    name: "Magazines",
    link: "/magazines",
  },
  {
    name: "Contact",
    link: "/contact-us",
  },
  {
    name: "E-waste",
    link: "/ewaste-25",
  }
];

export const FloatingNav = ({ className }: { className?: string }) => {
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(true); // Changed initial state to true
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current: number) => {
    const previous = scrollYProgress.getPrevious();

    if (typeof current === "number") {
      if (current < 0.05) {
        setVisible(true); // Always visible at the top
      } else {
        // Only change visibility if previous is also available to determine direction
        if (typeof previous === "number") {
          const direction = current - previous;
          if (direction > 0) {
            // Scrolling down
            setVisible(false);
          } else if (direction < 0) {
            // Scrolling up
            setVisible(true);
          }
          // If direction is 0, visibility remains unchanged
        }
        // If previous is not a number (e.g., first event after initial load and not at top),
        // visibility remains as is (true from initial state) until a scroll direction is established.
      }
    }
  });
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key="main-navbar"
          initial={{
            opacity: 1,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className={cn(
            "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-border rounded-full bg-background z-[5000] shadow-[0px_0px_20px_2px_var(--primary)]/20",
            isMobile ? "pr-4 pl-4 py-3" : "pr-2 pl-8 py-2",
            "items-center justify-center space-x-4",
            className,
            satoshi.className
          )}
        >
          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              {navItems.map((navItem, idx: number) => (
                <motion.a
                  key={`link-${navItem.name}-${idx}`}
                  href={navItem.link}
                  className={cn(
                    "relative items-center flex space-x-1 text-foreground transition-colors duration-300 group"
                  )}
                >
                  <span className="text-sm relative z-10 group-hover:text-primary/50 transition-colors duration-300">
                    {navItem.name}
                  </span>
                  {/* Animated underline */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-primary"
                    initial={{ width: 0, opacity: 0 }}
                    whileHover={{
                      width: "100%",
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Glowing background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{
                      scale: 1.1,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                  />
                </motion.a>
              ))}
              <Link href={"/cyberstrike-25"}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <HoverBorderGradient className="text-sm font-medium relative text-foreground px-4 py-2 rounded-full">
                    <span>Cyberstrike 25</span>
                  </HoverBorderGradient>
                </motion.div>
              </Link>
            </>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <>
              {/* Register button always visible on mobile */}
              <Link href={"/cyberstrike-25"}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <HoverBorderGradient className="text-sm font-medium relative text-foreground px-4 py-2 rounded-full">
                    <span>Cyberstrike 25</span>
                  </HoverBorderGradient>
                </motion.div>
              </Link>
              {/* Mobile menu button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-foreground hover:text-primary-lighter transition-colors"
                aria-label="Toggle menu"
                whileHover={{
                  scale: 1.1,
                  rotate: mobileMenuOpen ? 0 : 90,
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {mobileMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </motion.button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Mobile Dropdown Menu */}
      {isMobile && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-dropdown"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "fixed top-24 inset-x-4 mx-auto max-w-sm bg-background border border-border rounded-2xl z-[4999] shadow-lg",
                satoshi.className
              )}
            >
              <div className="p-4 space-y-3">
                {navItems.map((navItem, idx: number) => (
                  <motion.a
                    key={`mobile-link-${navItem.name}-${idx}`}
                    href={navItem.link}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-left px-4 py-3 text-sm text-foreground rounded-lg transition-all duration-200 relative group overflow-hidden"
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
                      {navItem.name}
                    </span>
                    {/* Sliding background */}
                    <motion.div
                      className="absolute inset-0 bg-primary/10"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut"
                      }}
                    />
                    {/* Left border accent */}
                    <motion.div
                      className="absolute left-0 top-0 h-full w-1 bg-primary"
                      initial={{ scaleY: 0 }}
                      whileHover={{ scaleY: 1 }}
                      transition={{
                        duration: 0.2,
                        ease: "easeOut"
                      }}
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};
