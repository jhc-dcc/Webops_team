'use client';

import { useEffect, useState, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  showCursor?: boolean;
  keepCursor?: boolean; // Keep cursor blinking after typing completes
  className?: string;
  onComplete?: () => void;
  triggerOnVisible?: boolean;
}

export function Typewriter({ 
  text, 
  speed = 50, 
  showCursor = true,
  keepCursor = false,
  className = '',
  onComplete,
  triggerOnVisible = false
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!triggerOnVisible);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (triggerOnVisible && containerRef.current) {
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

      observer.observe(containerRef.current);

      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }
  }, [triggerOnVisible]);

  useEffect(() => {
    if (isVisible && currentIndex < text.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length) {
      setIsTyping(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, isVisible, onComplete]);

  // Show cursor if: showCursor is true AND (keepCursor is true OR currently typing)
  const shouldShowCursor = showCursor && (keepCursor || isTyping);

  return (
    <span ref={containerRef} className={className}>
      {displayedText}
      {shouldShowCursor && (
        <span className="animate-pulse ml-1">_</span>
      )}
    </span>
  );
}

interface TypewriterWithResetProps {
  text: string;
  speed?: number;
  showCursor?: boolean;
  className?: string;
  delay?: number;
}

export function TypewriterWithReset({ 
  text, 
  speed = 50, 
  showCursor = true,
  className = '',
  delay = 0
}: TypewriterWithResetProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Reset when component mounts or becomes visible
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setDisplayedText('');
      setCurrentIndex(0);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, isVisible]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && isVisible && (
        <span className="animate-pulse ml-1">_</span>
      )}
    </span>
  );
}

