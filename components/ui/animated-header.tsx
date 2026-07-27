"use client";

import type { FC, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedHeaderProps {
  title: string | ReactNode;
  subtitle: string | ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
}

const AnimatedHeader: FC<AnimatedHeaderProps> = ({
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 }); // Trigger when 30% is in view

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header
      ref={ref}
      className="mb-8 sm:mb-12 md:mb-16 text-center px-3 sm:px-6 lg:px-8"
    >
      <motion.h1
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className={cn(
          "text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 text-white px-2 sm:px-4 leading-tight tracking-wide",
          titleClassName
        )}
      >
        {title}
      </motion.h1>
      <motion.p
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        className={cn(
          "text-base sm:text-lg md:text-xl text-gray-300 font-circularweb max-w-3xl mx-auto px-2 sm:px-4 leading-relaxed",
          subtitleClassName
        )}
      >
        {subtitle}
      </motion.p>
    </header>
  );
};

export default AnimatedHeader;
