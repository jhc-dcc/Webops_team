"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/home/Navbar";
import { FooterSection } from "@/components/home/FooterSection";
import { CustomCursor } from "@/components/home/CustomCursor";
import { blogPosts, BlogPost } from "@/lib/blogData";
import { anton, dmSans } from "@/fonts/font";
import { ArrowLeft } from "lucide-react";

const MARQUEE_WORDS = [
  "Sustainability",
  "Technology",
  "Events",
  "Stories",
  "Perspectives",
  "Insights",
];

export default function BlogsPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const postsSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Fast, non-blocking entrance animation trigger
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Sticky stacked card height bounding for mobile & desktop viewports
  useEffect(() => {
    if (selectedPost) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const stk = () => {
      const cards = document.querySelectorAll<HTMLElement>(".blog-root .posts .cd");
      cards.forEach((c, i) => {
        const top = Math.min(
          78 + i * 14,
          window.innerHeight - c.offsetHeight - 14
        );
        c.style.top = `${top}px`;
      });
    };

    stk();
    window.addEventListener("resize", stk, { passive: true });
    if (document.fonts) {
      document.fonts.ready.then(stk);
    }

    return () => {
      window.removeEventListener("resize", stk);
    };
  }, [selectedPost]);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleBackToPosts = () => {
    setSelectedPost(null);
  };

  // Repeated words for continuous infinite marquee strip (-50% translateX)
  const marqueeContent = (
    <div className="mq">
      {[...Array(2)].map((_, loopIdx) => (
        <span key={loopIdx} className="inline-flex items-center">
          {MARQUEE_WORDS.map((w, wIdx) => (
            <span key={`${loopIdx}-${wIdx}`} className="inline-flex items-center">
              <span>{w}</span>
              <span className="mx-4">●</span>
            </span>
          ))}
        </span>
      ))}
    </div>
  );

  return (
    <div
      data-loaded={isLoaded ? "true" : "false"}
      className={`blog-root home-root ${isLoaded ? "go" : ""} ${anton.variable} ${dmSans.variable}`}
    >
      {/* Subtle Vertical Grid Lines Overlay (Editorial Aesthetic) */}
      <div className="v-grid" aria-hidden="true">
        <span />
        <span />
        <span className="hidden sm:block" />
        <span className="hidden md:block" />
        <span className="hidden lg:block" />
        <span />
      </div>

      {/* Shared Editorial Navbar with Dynamic Active State & Color Tracking */}
      <Navbar />

      {/* Custom Stretchy Cursor with 'read' and 'go' labels */}
      <CustomCursor />

      {selectedPost ? (
        /* ================= Article Reader View (Full Story) ================= */
        <main className="reader-container">
          <div className="wrap">
            <button
              type="button"
              onClick={handleBackToPosts}
              className="reader-back-btn"
              aria-label="Back to all stories"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all stories</span>
            </button>

            <article className="reader-card">
              <span className="reader-category">{selectedPost.category}</span>
              <h1 className="reader-title">{selectedPost.title}</h1>

              <div className="reader-meta">
                <span>By {selectedPost.author}</span>
                <span>{selectedPost.department}</span>
                <span>{selectedPost.date}</span>
              </div>

              {selectedPost.excerpt && (
                <div className="reader-lead">{selectedPost.excerpt}</div>
              )}

              <div className="reader-body">
                {selectedPost.content.split("\n\n").map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {selectedPost.keywords && selectedPost.keywords.length > 0 && (
                <div className="reader-tags">
                  {selectedPost.keywords.map((tag, tIdx) => (
                    <span key={tIdx}>#{tag}</span>
                  ))}
                </div>
              )}

              <div className="mt-12 pt-8 border-t-2 border-[var(--ink)] flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleBackToPosts}
                  className="reader-back-btn !mb-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>All Stories</span>
                </button>
                <span className="font-bold text-sm text-[var(--ink)] uppercase tracking-wider">
                  Dot Com Club • 2026
                </span>
              </div>
            </article>
          </div>
        </main>
      ) : (
        /* ================= Editorial Hero & Stacked Cards ================= */
        <main>
          {/* 1. Striking Oversized Hero */}
          <header className="hero" id="hero">
            {/* Rotating Neon-Lime Circular Badge SVG */}
            <svg className="bdg" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path
                  id="cp"
                  d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
                />
              </defs>
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="#CCFF00"
                stroke="#1B1030"
                strokeWidth="3"
              />
              <text
                fontSize="17"
                fontWeight="800"
                fill="#1B1030"
                fontFamily="var(--font-dm), 'DM Sans', sans-serif"
                letterSpacing="1px"
              >
                <textPath href="#cp" textLength="480" lengthAdjust="spacing">
                  DOT COM CLUB • DCC JOURNAL • EST. 2014 •
                </textPath>
              </text>
              <circle cx="100" cy="100" r="16" fill="#1B1030" />
              <polygon points="96,92 108,100 96,108" fill="#CCFF00" />
            </svg>

            <div className="wrap">
              {/* Editorial Pill */}
              <div className="editorial-badge">
                <span className="pulse-dot" />
                <span>DCC JOURNAL / 2026</span>
              </div>

              {/* Dominant Oversized BLOGS Typography with Entrance Reveal */}
              <h1 className="h1" aria-label="Blogs">
                <s>
                  <i>BLOGS</i>
                </s>
              </h1>

              {/* Subtitle & Lead Text */}
              <div className="c2">
                <p className="hero-subtitle">
                  Stories, ideas &amp; perspectives from the Dot Com Club.
                </p>
              </div>
            </div>

            {/* Crossing Dual Diagonal Marquee Tapes */}
            <div className="tp t1" aria-hidden="true">
              {marqueeContent}
            </div>
            <div className="tp t2" aria-hidden="true">
              {marqueeContent}
            </div>
          </header>

          {/* 2. Blog Cards / Content Section (Sticky Stacked Cards) */}
          <section id="posts" ref={postsSectionRef}>
            <div className="wrap">
              <div className="posts">
                {blogPosts.map((post, idx) => {
                  const isLavender = idx % 2 === 1;
                  const numberLabel = String(idx + 1).padStart(2, "0");

                  return (
                    <article
                      key={post.id}
                      style={{ "--i": idx } as React.CSSProperties}
                      className={`cd ${isLavender ? "lv" : ""}`}
                      onClick={() => handlePostClick(post)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Read story: ${post.title}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handlePostClick(post);
                        }
                      }}
                    >
                      {/* Top Row: Category Pill & Date */}
                      <div className="tr">
                        <span className="tg">{post.category}</span>
                        <span className="font-semibold text-sm opacity-90">
                          {post.date}
                        </span>
                      </div>

                      {/* Large Editorial Number */}
                      <div className="no">{numberLabel}</div>

                      {/* Prominent Anton Headline */}
                      <h2>{post.title}</h2>

                      {/* Excerpt Description */}
                      {post.excerpt && (
                        <p>{post.excerpt}</p>
                      )}

                      {/* Bottom Metadata & Read Affordance */}
                      <div className="mt">
                        <div className="flex flex-col gap-1">
                          <span className="text-base font-bold">{post.author}</span>
                          <span className="sb">{post.department}</span>
                        </div>

                        <span className="read-affordance">
                          Read Story ▸
                        </span>
                      </div>

                      {/* Tags */}
                      {post.keywords && post.keywords.length > 0 && (
                        <div className="tgs">
                          {post.keywords.slice(0, 3).map((tag, tagIdx) => (
                            <span key={tagIdx}>#{tag}</span>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Shared Dark Footer (#08040F) */}
      <FooterSection />
    </div>
  );
}
