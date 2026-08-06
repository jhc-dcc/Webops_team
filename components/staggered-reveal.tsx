'use client';

import { useEffect, useRef, useState } from 'react';

interface StaggeredRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function StaggeredReveal({ text, className = '', delay = 50 }: StaggeredRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const [isInView, setIsInView] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const target = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setIsInView(true);
          } else {
            setIsInView(false);
            // Hide in reverse when scrolling up and leaving view
            if (scrollDirection === 'up') {
              setIsVisible(false);
            }
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [scrollDirection]);

  // Calculate delay based on scroll direction
  const getDelay = (index: number, textLength: number) => {
    if (!isVisible) return '0ms';
    if (scrollDirection === 'down' || isInView) {
      return index * delay + 'ms';
    } else {
      return (textLength - index - 1) * delay + 'ms';
    }
  };

  return (
    <div ref={containerRef} className={`inline-flex ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden relative"
          style={{
            willChange: 'transform',
          }}
        >
          <span
            className="inline-block"
            style={{
              transition: `transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${getDelay(index, text.length)}`,
              transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </div>
  );
}

