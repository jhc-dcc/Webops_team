'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';

interface Logo {
  id: string | number;
  src: string;
  alt: string;
  hint: string;
}

interface CarouselRowProps {
  logos: Logo[];
  direction: 'forward' | 'backward';
  animationDuration?: string;
}

const CarouselRow: FC<CarouselRowProps> = ({
  logos,
  direction,
  animationDuration = '60s',
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const durationInSeconds = useMemo(() => parseFloat(animationDuration), [animationDuration]);
  const isValidDuration = useMemo(() => !isNaN(durationInSeconds) && durationInSeconds > 0, [durationInSeconds]);

  const displayLogos = useMemo(() => {
    if (!logos || logos.length === 0) return [];
    // Duplicate logos for seamless infinite loop
    return [...logos, ...logos, ...logos, ...logos].map((logo, index) => ({ // Increased duplication for very long durations / many logos
      ...logo,
      uniqueKey: `${logo.id}-${index}`,
    }));
  }, [logos]);

  // Create stable values for the dependency array
  const stableLogosLength = useMemo(() => logos?.length || 0, [logos]);
  const stableDisplayLogosLength = useMemo(() => displayLogos.length, [displayLogos]);

  useEffect(() => {
    if (!isValidDuration || !rowRef.current || !wrapperRef.current || stableDisplayLogosLength === 0) {
      return;
    }

    const rowElement = rowRef.current;
    const wrapperElement = wrapperRef.current;
    let tl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      const rowWidth = rowElement.offsetWidth;
      const singleLoopWidth = rowWidth / (stableDisplayLogosLength / stableLogosLength); // Width of one set of original logos

      if (direction === 'forward') {
        gsap.set(rowElement, { x: 0 }); 
        tl = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } })
          .to(rowElement, { x: -singleLoopWidth, duration: durationInSeconds });
      } else { 
        gsap.set(rowElement, { x: -singleLoopWidth }); 
        tl = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } })
          .to(rowElement, { x: 0, duration: durationInSeconds });
      }

      const handleMouseEnter = () => {
        if (tl) tl.pause();
      };
      const handleMouseLeave = () => {
        if (tl) tl.play();
      };

      wrapperElement.addEventListener('mouseenter', handleMouseEnter);
      wrapperElement.addEventListener('mouseleave', handleMouseLeave);
    }, wrapperRef); 

    return () => {
      ctx.revert(); 
    };

  }, [isValidDuration, direction, durationInSeconds, stableDisplayLogosLength, stableLogosLength]);


  if (!isValidDuration || stableDisplayLogosLength === 0) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'group/row w-full overflow-hidden py-4',
        '[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.5)_10%,black_25%,black_75%,rgba(0,0,0,0.5)_90%,transparent_100%)]'
      )}
    >
      <div
        ref={rowRef}
        className="flex w-max flex-row items-center justify-start gap-8"
      >
        {displayLogos.map((logo) => (
          <div
            key={logo.uniqueKey}
            className="h-32 w-48 flex-shrink-0 flex items-center justify-center p-4 rounded-lg
                       filter grayscale hover:filter-none opacity-75 hover:opacity-100 
                       transform hover:scale-105
                       transition-all duration-300 ease-in-out"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={150}
              height={80}
              data-ai-hint={logo.hint}
              className="object-contain max-h-full max-w-full"
              unoptimized={logo.src.endsWith('.svg')}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselRow;