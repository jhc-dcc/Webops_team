"use client";

import { useState, useEffect } from 'react';

// Set the event date to be 130 days in the future (to match the image)
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
const EVENT_DATE = getFutureDate(130);

type TimeUnitCircleProps = {
  value: string;
  label: string;
  progress: number;
};

const TimeUnitCircle = ({ value, label, progress }: TimeUnitCircleProps) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="relative flex flex-col items-center">
      <svg width="120" height="120" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="rgba(100, 100, 100, 0.2)"
          strokeWidth="3"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#FF0000"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </span>
        <span className="text-4xl font-bold text-white">
          {value}
        </span>
      </div>
    </div>
  );
};

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = EVENT_DATE.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        return { days, hours, minutes, seconds };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };
    
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex gap-8 md:gap-12">
        <div className="w-[120px] h-[120px] animate-pulse bg-gray-800 rounded-full"></div>
        <div className="w-[120px] h-[120px] animate-pulse bg-gray-800 rounded-full"></div>
        <div className="w-[120px] h-[120px] animate-pulse bg-gray-800 rounded-full"></div>
        <div className="w-[120px] h-[120px] animate-pulse bg-gray-800 rounded-full"></div>
      </div>
    );
  }

  // Calculate progress for each unit (as a percentage)
  const daysProgress = 1; // Days don't have a clear max, so show full circle
  const hoursProgress = timeLeft.hours / 24;
  const minutesProgress = timeLeft.minutes / 60;
  const secondsProgress = timeLeft.seconds / 60;

  return (
    <div className="flex gap-8 md:gap-12">
      <TimeUnitCircle 
        value={String(timeLeft.days).padStart(2, '0')} 
        label="DAYS" 
        progress={daysProgress}
      />
      <TimeUnitCircle 
        value={String(timeLeft.hours).padStart(2, '0')} 
        label="HOURS" 
        progress={hoursProgress}
      />
      <TimeUnitCircle 
        value={String(timeLeft.minutes).padStart(2, '0')} 
        label="MINUTES" 
        progress={minutesProgress}
      />
      <TimeUnitCircle 
        value={String(timeLeft.seconds).padStart(2, '0')} 
        label="SECONDS" 
        progress={secondsProgress}
      />
    </div>
  );
}