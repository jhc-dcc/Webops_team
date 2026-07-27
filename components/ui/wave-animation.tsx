"use client";

import type { FC } from 'react';

const WaveAnimation: FC = () => {
  return (
    <div className="fixed inset-0 -z-[8] overflow-hidden pointer-events-none opacity-70">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 320" // Adjusted viewBox for better wave spread
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-full"
      >
        {/* Wave 1 - Cyan */}
        <path
          className="wave-path-1"
          fill="none"
          strokeWidth="2"
          d="M0,160 C200,80 400,240 600,160 S1000,80 1200,160 S1440,240 1440,240 L1440,320 L0,320 Z"
        />
        <path
          className="wave-path-1"
          style={{ animationDelay: '-2s' }}
          fill="none"
          strokeWidth="1.5"
          d="M0,192 C240,128 480,256 720,192 S1200,128 1440,192 L1440,320 L0,320 Z"
        />

        {/* Wave 2 - Purple */}
        <path
          className="wave-path-2"
          fill="none"
          strokeWidth="2.5"
          d="M0,120 C280,220 520,20 720,120 S1160,220 1440,120 L1440,320 L0,320 Z"
        />
         <path
          className="wave-path-2"
          style={{ animationDelay: '-5s' }}
          fill="none"
          strokeWidth="1"
          d="M0,224 C300,120 480,280 720,200 S1000,100 1440,220 L1440,320 L0,320 Z"
        />


        {/* Wave 3 - Red Accent */}
        <path
          className="wave-path-3"
          fill="none"
          strokeWidth="1.5"
          d="M0,250 C180,300 360,150 540,200 S900,300 1080,200 S1440,250 1440,250 L1440,320 L0,320 Z"
        />
         <path
          className="wave-path-3"
          style={{ animationDelay: '-3s' }}
          fill="none"
          strokeWidth="2"
          d="M0,100 C220,180 450,80 720,130 S1000,180 1200,100 S1440,150 1440,150 L1440,320 L0,320 Z"
        />
      </svg>
    </div>
  );
};

export default WaveAnimation;