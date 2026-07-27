"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const x = useTransform(scrollYProgress, [0.3, 0.7], ['0%', '-40%']);

  return (
    <section
      ref={targetRef}
      className="relative h-[200vh] w-full"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          //poster="https://images.pexels.com/photos/2099482/pexels-photo-2099482.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        >
          <source src="./bg2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* <div className="absolute inset-0 bg-primary/60" /> */}
        
        <motion.div 
          style={{ opacity, x, scale }}
          className="relative h-full flex flex-col items-center justify-center text-primary-foreground"
        >
          <p className='mt-4 text-1xl'>DotComClub Presents</p>
          <h1 className="text-5xl md:text-8xl font-headline font-bold text-center">
            Cyberstrike &apos;25
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-center max-w-2xl font-body">
            Error 404: Beyond The Limit
          </p>
        </motion.div>

        <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground"
        >
            <p className="font-body text-sm">Scroll Down</p>
            <ArrowDown className="animate-bounce h-6 w-6" />
        </motion.div>

      </div>
    </section>
  );
}
