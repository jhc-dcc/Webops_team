"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface NavLinkItem {
  label: string;
  href: string;
  isCl?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about-us" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Teams", href: "/teams" },
  { label: "Magazines", href: "/magazines" },
  { label: "Contact", href: "/contact-us" },
  { label: "E-waste", href: "/ewaste-26" },
  { label: "CL Registration", href: "/cyberstrike-26/cl", isCl: true },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [navColor, setNavColor] = useState<"p" | "l" | "d">("p");
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Active navigation link tracking based on current pathname
  const activeIndex = NAV_LINKS.findIndex((link) => {
    if (link.href === "/") return pathname === "/";
    return pathname === link.href || pathname?.startsWith(link.href + "/");
  });

  // Reset navigation indicator on route change
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  // Proactively prefetch all routes in the background on initial load
  useEffect(() => {
    const prefetchRoutes = () => {
      NAV_LINKS.forEach((link) => {
        if (link.href && link.href.startsWith("/")) {
          router.prefetch(link.href);
        }
      });
    };

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(prefetchRoutes);
      } else {
        setTimeout(prefetchRoutes, 250);
      }
    }
  }, [router]);

  const navRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLSpanElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const moveSlider = useCallback((el: HTMLElement | null) => {
    if (!el || !sliderRef.current) return;
    sliderRef.current.style.left = `${el.offsetLeft + el.offsetWidth / 2}px`;
    sliderRef.current.style.opacity = "1";
  }, []);

  // Update slider position for active link
  useEffect(() => {
    const currentActiveEl =
      activeIndex !== -1 ? linkRefs.current[activeIndex] : linkRefs.current[0];
    if (currentActiveEl) {
      moveSlider(currentActiveEl);
    }

    const handleResize = () => {
      if (currentActiveEl) moveSlider(currentActiveEl);
    };

    window.addEventListener("resize", handleResize);
    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (currentActiveEl) moveSlider(currentActiveEl);
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [moveSlider, activeIndex]);

  // Scroll tracking for nav color, hide/show, atTop, and fab
  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const y = window.scrollY;
      const d = y - lastY;

      setIsAtTop(y < 24);

      // Color tracking based on intersecting section at y = 32px
      const sections = document.querySelectorAll<HTMLElement>(
        ".home-root header, .home-root section, .home-root footer, .blog-root header, .blog-root section, .blog-root footer"
      );
      let t: "p" | "l" | "d" = "d";

      for (let i = 0; i < sections.length; i++) {
        const r = sections[i].getBoundingClientRect();
        if (r.top <= 32 && r.bottom > 32) {
          if (sections[i].matches(".hero, .why")) {
            t = "p";
          } else if (sections[i].matches(".cnt")) {
            t = "l";
          } else {
            t = "d";
          }
          break;
        }
      }
      setNavColor(t);

      // Hide / show nav on scroll down / up
      if (Math.abs(d) > 6) {
        if (d > 0 && y > 220 && !isMenuOpen) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
        lastY = y;
      }

      // FAB visibility
      const bodyLocked = document.body.classList.contains("lock");
      setShowFab(y > window.innerHeight * 0.8 && !bodyLocked);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  // Lock body when menu opens
  const toggleMenu = () => {
    const nextState = !isMenuOpen;
    setIsMenuOpen(nextState);
    if (nextState) {
      document.body.classList.add("lock");
    } else {
      document.body.classList.remove("lock");
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove("lock");
  };

  return (
    <>
      {/* Instant Navigation Top Progress Bar */}
      {isNavigating && (
        <div
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9E71FF] via-[#EDE5FF] to-[#9E71FF] z-[99999] shadow-[0_0_12px_#9E71FF]"
          style={{
            animation: "navProgress 0.8s ease-in-out infinite alternate",
          }}
        />
      )}

      <nav
        ref={navRef}
        data-t={navColor}
        className={`${isAtTop ? "at" : ""} ${isMenuOpen ? "mo" : ""} ${isHidden ? "hide" : ""}`}
      >
        <div className="bar">
          <Link className="stt" href="/" prefetch={true}>
            Theme Reveal Soon
          </Link>

          <div
            className="nv"
            ref={navContainerRef}
            onMouseLeave={() => {
              const currentActiveEl =
                activeIndex !== -1 ? linkRefs.current[activeIndex] : linkRefs.current[0];
              if (currentActiveEl) moveSlider(currentActiveEl);
            }}
          >
            <span className="sl" ref={sliderRef} style={{ pointerEvents: "none" }} />
            {NAV_LINKS.filter(link => !(link.isCl && pathname === "/sponsors")).map((link, idx) => {
              const isActive = idx === activeIndex;
              return (
                <Link
                  key={link.label}
                  ref={(el) => {
                    linkRefs.current[idx] = el;
                  }}
                  className={`rl ${isActive ? "cl" : ""}`}
                  href={link.href}
                  prefetch={true}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={(e) => {
                    moveSlider(e.currentTarget);
                    router.prefetch(link.href);
                  }}
                  onFocus={(e) => {
                    moveSlider(e.currentTarget);
                    router.prefetch(link.href);
                  }}
                  onClick={() => {
                    if (link.href !== pathname) {
                      setIsNavigating(true);
                    }
                  }}
                >
                  <span data-t={link.label}>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <button
            className="mb"
            id="mb"
            type="button"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`mnu ${isMenuOpen ? "o" : ""}`}
        id="mnu"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) {
            closeMenu();
          }
        }}
      >
        {NAV_LINKS.slice(0, 8).map((link, idx) => {
          const isActive = idx === activeIndex;
          return (
            <Link
              key={link.label}
              className={`ml ${isActive ? "cl" : ""}`}
              href={link.href}
              prefetch={true}
              style={{ "--n": idx } as React.CSSProperties}
              aria-current={isActive ? "page" : undefined}
              onMouseEnter={() => router.prefetch(link.href)}
              onClick={() => {
                closeMenu();
                if (link.href !== pathname) {
                  setIsNavigating(true);
                }
              }}
            >
              <i>{link.label}</i>
            </Link>
          );
        })}

        <div className="mf">
          {pathname !== "/sponsors" && (
            <Link
              href="/cyberstrike-26/cl"
              prefetch={true}
              onClick={() => {
                closeMenu();
                setIsNavigating(true);
              }}
            >
              CL Registration
            </Link>
          )}
          <a
            href="https://www.instagram.com/dotcomclubjhc/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://www.youtube.com/@JhcDcc/"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube
          </a>
          <a
            href="https://www.linkedin.com/company/dotcomclub/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* Floating CTA for Mobile */}
      {pathname !== "/sponsors" && pathname !== "/about-us" && pathname !== "/contact-us" && pathname !== "/magazines" && (
        <Link
          className={`btn wh fab ${showFab ? "s" : ""}`}
          id="fab"
          href="/cyberstrike-26/cl"
          prefetch={true}
          onClick={() => setIsNavigating(true)}
        >
          CL Registration
        </Link>
      )}
    </>
  );
}
