"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  id: string;
  title: string;
  image: string;
}

export interface ImagesScrollingGalleryProps {
  images: GalleryImage[];
}

function GalleryCard({
  image,
  index,
  total,
  isMobile,
}: {
  image: GalleryImage;
  index: number;
  total: number;
  isMobile: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const exitScale = isMobile ? 0.92 : 0.82;
  const exitY = isMobile ? -6 : -14;

  const scale = useTransform(
    scrollYProgress,
    [0, 0.45, 0.65, 1],
    [0.95, 1, 1, exitScale]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.65, 1],
    [0, 1, 1, 0.75]
  );

  const blur = useTransform(
    scrollYProgress,
    [0, 0.45, 0.65, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(2px)"]
  );

  const translateY = useTransform(
    scrollYProgress,
    [0, 0.45, 0.65, 1],
    [40, 0, 0, exitY]
  );

  // Fixed top offset + small incremental offset for stacked deck effect
  const stickyTop = isMobile ? 80 + index * 12 : 100 + index * 20;

  return (
    <div
      ref={cardRef}
      className="sticky mb-12 sm:mb-16 md:mb-20 last:mb-0 transform-gpu"
      style={{ top: `${stickyTop}px` }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          filter: blur,
          y: translateY,
        }}
        whileHover={
          !isMobile
            ? {
                scale: 1.02,
                filter: "brightness(1.05)",
                transition: { duration: 0.3, ease: "easeOut" },
              }
            : undefined
        }
        className={cn(
          "relative w-full overflow-hidden rounded-[24px] sm:rounded-[32px]",
          "bg-neutral-900 border border-neutral-800/80",
          "shadow-2xl shadow-black/80 transition-shadow duration-300",
          "[@media(hover:hover)]:hover:shadow-emerald-500/10 [@media(hover:hover)]:hover:border-emerald-500/30"
        )}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={image.image}
            alt={image.title}
            fill
            priority={index === 0}
            sizes="(max-width: 768px) 95vw, (max-width: 1200px) 90vw, 1100px"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />

          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Badge & Title Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 backdrop-blur-md border border-emerald-500/20">
                Drive #{index + 1}
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-md">
              {image.title}
            </h3>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ImagesScrollingGallery({
  images,
}: ImagesScrollingGalleryProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Stagger animation variants for section header
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative py-16 sm:py-24 bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-12 sm:mb-16 md:mb-20 max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide inline-flex items-center gap-2">
              <span>♻</span>
              <span>E-Waste Drive Gallery</span>
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4"
          >
            Our E-Waste Collection Journey
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-neutral-400 leading-relaxed font-normal max-w-2xl mx-auto"
          >
            A glimpse of our collection drives, awareness campaigns,
            volunteers, and impact across the community.
          </motion.p>
        </motion.div>

        {/* Stacked Cards Gallery */}
        <div className="relative pb-16 sm:pb-24">
          {images.map((image, index) => (
            <GalleryCard
              key={image.id}
              image={image}
              index={index}
              total={images.length}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImagesScrollingGallery;
