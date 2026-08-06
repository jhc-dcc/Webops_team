'use client';

import { useEffect, useState, useRef } from 'react';

interface TwoColorTypewriterProps {
  text1: string;
  text2: string;
  color1?: string;
  color2?: string;
  speed?: number;
  showCursor?: boolean;
  triggerOnVisible?: boolean;
  className?: string;
}

export function TwoColorTypewriter({
  text1,
  text2,
  color1 = 'white',
  color2 = '#ef4444',
  speed = 100,
  showCursor = true,
  triggerOnVisible = false,
  className = '',
}: TwoColorTypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!triggerOnVisible);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullText = text1 + ' ' + text2;
  const splitIndex = text1.length;

  useEffect(() => {
    if (triggerOnVisible && containerRef.current) {
      const target = containerRef.current;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(target);

      return () => {
        observer.unobserve(target);
      };
    }
  }, [triggerOnVisible]);

  useEffect(() => {
    if (isVisible && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText, speed, isVisible]);

  // Determine which part is being displayed
  const text1Part = displayedText.substring(0, Math.min(currentIndex, splitIndex));
  const text2Part = displayedText.substring(splitIndex);

  return (
    <div ref={containerRef} className={className}>
      <span className="text-flap">
        <span style={{ color: color1 }}>{text1Part}</span>
        {' '}
        <span style={{ color: color2 }}>{text2Part}</span>
        {showCursor && (
          <span className="ml-1 animate-pulse" style={{ color: 'white' }}>_</span>
        )}
      </span>
    </div>
  );
}

