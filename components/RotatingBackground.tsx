"use client";

export const RotatingBackground = () => {
  return (
    <>
      {/* Primary mandala element */}
      <div className="rotating-background">
        <svg width="800" height="800" viewBox="0 0 800 800" fill="none">
          {/* Outer mandala ring */}
          <circle
            cx="400"
            cy="400"
            r="380"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
          <circle
            cx="400"
            cy="400"
            r="340"
            stroke="url(#gradient1)"
            strokeWidth="1"
            fill="none"
            filter="url(#glow)"
          />

          {/* Lotus petals - outer layer */}
          <g
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          >
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 22.5 * Math.PI) / 180;
              const x1 = 400 + Math.cos(angle) * 300;
              const y1 = 400 + Math.sin(angle) * 300;
              const x2 = 400 + Math.cos(angle + 0.2) * 360;
              const y2 = 400 + Math.sin(angle + 0.2) * 360;
              const x3 = 400 + Math.cos(angle - 0.2) * 360;
              const y3 = 400 + Math.sin(angle - 0.2) * 360;
              return (
                <path
                  key={i}
                  d={`M${x1},${y1} Q${x2},${y2} ${
                    400 + Math.cos(angle) * 340
                  },${400 + Math.sin(angle) * 340} Q${x3},${y3} ${x1},${y1}`}
                />
              );
            })}
          </g>

          {/* Middle mandala layer */}
          <circle
            cx="400"
            cy="400"
            r="250"
            stroke="url(#gradient3)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />

          {/* Sacred geometry - 8-pointed star */}
          <g
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          >
            <path d="M400,150 L420,200 L470,180 L430,230 L480,250 L430,270 L470,320 L420,300 L400,350 L380,300 L330,320 L370,270 L320,250 L370,230 L330,180 L380,200 Z" />
          </g>

          {/* Inner lotus petals */}
          <g
            stroke="url(#gradient4)"
            strokeWidth="1.5"
            fill="none"
            filter="url(#glow)"
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 400 + Math.cos(angle) * 180;
              const y1 = 400 + Math.sin(angle) * 180;
              const x2 = 400 + Math.cos(angle + 0.3) * 220;
              const y2 = 400 + Math.sin(angle + 0.3) * 220;
              const x3 = 400 + Math.cos(angle - 0.3) * 220;
              const y3 = 400 + Math.sin(angle - 0.3) * 220;
              return (
                <path
                  key={i}
                  d={`M${x1},${y1} Q${x2},${y2} ${
                    400 + Math.cos(angle) * 200
                  },${400 + Math.sin(angle) * 200} Q${x3},${y3} ${x1},${y1}`}
                />
              );
            })}
          </g>

          {/* Central mandala */}
          <circle
            cx="400"
            cy="400"
            r="120"
            stroke="url(#gradient3)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
          <circle
            cx="400"
            cy="400"
            r="80"
            stroke="url(#gradient4)"
            strokeWidth="1.5"
            fill="none"
            filter="url(#glow)"
          />

          {/* Central sacred symbol */}
          <g
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          >
            <circle cx="400" cy="400" r="40" />
            <path d="M370,400 L430,400 M400,370 L400,430 M380,380 L420,420 M420,380 L380,420" />
          </g>

          {/* Enhanced Abstract geometric lines with more blur and golden glow */}
          <g
            stroke="url(#gradient-gold)"
            strokeWidth="0.3"
            fill="none"
            filter="url(#glow-ultra-soft)"
          >
            {Array.from({ length: 64 }).map((_, i) => {
              const angle = (i * 5.625 * Math.PI) / 180;
              const x1 = 400 + Math.cos(angle) * 50;
              const y1 = 400 + Math.sin(angle) * 50;
              const x2 = 400 + Math.cos(angle) * 390;
              const y2 = 400 + Math.sin(angle) * 390;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  opacity={i % 3 === 0 ? "0.4" : i % 2 === 0 ? "0.2" : "0.1"}
                />
              );
            })}
          </g>

          {/* Additional golden mandala layers */}
          <g
            stroke="url(#gradient-gold)"
            strokeWidth="0.4"
            fill="none"
            filter="url(#glow-golden)"
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 15 * Math.PI) / 180;
              const radius = 200 + (i % 4) * 30;
              const x1 = 400 + Math.cos(angle) * radius;
              const y1 = 400 + Math.sin(angle) * radius;
              const x2 = 400 + Math.cos(angle + 0.1) * (radius + 20);
              const y2 = 400 + Math.sin(angle + 0.1) * (radius + 20);
              return (
                <line
                  key={`gold-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  opacity="0.3"
                />
              );
            })}
          </g>

          {/* Spiral mandala elements */}
          <g
            stroke="url(#gradient-gold)"
            strokeWidth="0.2"
            fill="none"
            filter="url(#glow-spiral)"
          >
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const points = Array.from({ length: 20 })
                .map((_, j) => {
                  const spiralAngle = angle + j * 0.3;
                  const radius = 100 + j * 8;
                  const x = 400 + Math.cos(spiralAngle) * radius;
                  const y = 400 + Math.sin(spiralAngle) * radius;
                  return `${x},${y}`;
                })
                .join(" ");
              return (
                <polyline key={`spiral-${i}`} points={points} opacity="0.25" />
              );
            })}
          </g>

          {/* Gradient definitions */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-soft">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-ultra-soft">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-golden">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feColorMatrix
                type="matrix"
                values="1 0.8 0 0 0  0 0.6 0.2 0 0  0 0.4 0.8 0 0  0 0 0 1 0"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-spiral">
              <feGaussianBlur stdDeviation="4.5" result="coloredBlur" />
              <feColorMatrix
                type="matrix"
                values="1 0.9 0.3 0 0  0 0.7 0.4 0 0  0 0.5 0.9 0 0  0 0 0 1 0"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "hsl(0 75% 35%)", stopOpacity: "0.6" }}
              />
              <stop
                offset="50%"
                style={{ stopColor: "hsl(0 85% 45%)", stopOpacity: "0.8" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "hsl(348 83% 47%)", stopOpacity: "0.6" }}
              />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "hsl(348 83% 47%)", stopOpacity: "0.8" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "hsl(0 85% 45%)", stopOpacity: "0.8" }}
              />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "hsl(0 75% 35%)", stopOpacity: "0.5" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "hsl(0 85% 45%)", stopOpacity: "0.7" }}
              />
            </linearGradient>
            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "hsl(0 85% 45%)", stopOpacity: "0.7" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "hsl(348 83% 47%)", stopOpacity: "0.5" }}
              />
            </linearGradient>
            <linearGradient
              id="gradient-gold"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "hsl(45 100% 70%)", stopOpacity: "0.8" }}
              />
              <stop
                offset="50%"
                style={{ stopColor: "hsl(38 100% 60%)", stopOpacity: "1" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "hsl(30 100% 55%)", stopOpacity: "0.8" }}
              />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Secondary mandala - smaller and more subtle */}
      <div className="rotating-background-secondary">
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none">
          {/* Outer ring */}
          <circle
            cx="300"
            cy="300"
            r="280"
            stroke="url(#gradient5)"
            strokeWidth="1"
            fill="none"
            filter="url(#glow3)"
          />

          {/* Enhanced Golden abstract web with more blur */}
          <g
            stroke="url(#gradient-gold2)"
            strokeWidth="0.2"
            fill="none"
            filter="url(#glow-gold-ultra)"
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const angle1 = (i * 15 * Math.PI) / 180;
              const angle2 = ((i + 1) * 15 * Math.PI) / 180;
              const r1 = 80 + (i % 4) * 30;
              const r2 = 100 + ((i + 1) % 4) * 40;
              const x1 = 300 + Math.cos(angle1) * r1;
              const y1 = 300 + Math.sin(angle1) * r1;
              const x2 = 300 + Math.cos(angle2) * r2;
              const y2 = 300 + Math.sin(angle2) * r2;
              return (
                <line
                  key={`web-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  opacity="0.3"
                />
              );
            })}
          </g>

          {/* Enhanced Radiating lines with golden glow */}
          <g
            stroke="url(#gradient-gold2)"
            strokeWidth="0.3"
            fill="none"
            filter="url(#glow-gold-ultra)"
          >
            {Array.from({ length: 48 }).map((_, i) => {
              const angle = (i * 7.5 * Math.PI) / 180;
              const x1 = 300 + Math.cos(angle) * 150;
              const y1 = 300 + Math.sin(angle) * 150;
              const x2 = 300 + Math.cos(angle) * 280;
              const y2 = 300 + Math.sin(angle) * 280;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  opacity={i % 4 === 0 ? "0.4" : "0.2"}
                />
              );
            })}
          </g>

          {/* Enhanced Golden hexagons with more layers */}
          <g
            stroke="url(#gradient-gold2)"
            strokeWidth="0.3"
            fill="none"
            filter="url(#glow-gold-ultra)"
          >
            {[120, 160, 200, 240, 280].map((r, idx) => {
              const points = Array.from({ length: 6 })
                .map((_, i) => {
                  const angle = (i * 60 * Math.PI) / 180;
                  const x = 300 + Math.cos(angle) * r;
                  const y = 300 + Math.sin(angle) * r;
                  return `${x},${y}`;
                })
                .join(" ");
              return (
                <polygon key={`hex-${idx}`} points={points} opacity="0.25" />
              );
            })}
          </g>

          {/* Enhanced Concentric circles with golden glow */}
          <circle
            cx="300"
            cy="300"
            r="250"
            stroke="url(#gradient-gold2)"
            strokeWidth="0.3"
            fill="none"
            filter="url(#glow-gold-ultra)"
          />
          <circle
            cx="300"
            cy="300"
            r="200"
            stroke="url(#gradient-gold2)"
            strokeWidth="0.3"
            fill="none"
            filter="url(#glow-gold-ultra)"
          />
          <circle
            cx="300"
            cy="300"
            r="150"
            stroke="url(#gradient-gold2)"
            strokeWidth="0.3"
            fill="none"
            filter="url(#glow-gold-ultra)"
          />
          <circle
            cx="300"
            cy="300"
            r="100"
            stroke="url(#gradient-gold2)"
            strokeWidth="0.3"
            fill="none"
            filter="url(#glow-gold-ultra)"
          />

          {/* Additional golden mandala patterns */}
          <g
            stroke="url(#gradient-gold2)"
            strokeWidth="0.2"
            fill="none"
            filter="url(#glow-gold-ultra)"
          >
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 22.5 * Math.PI) / 180;
              const radius = 180 + (i % 3) * 20;
              const x1 = 300 + Math.cos(angle) * radius;
              const y1 = 300 + Math.sin(angle) * radius;
              const x2 = 300 + Math.cos(angle + 0.2) * (radius + 30);
              const y2 = 300 + Math.sin(angle + 0.2) * (radius + 30);
              return (
                <line
                  key={`pattern-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  opacity="0.2"
                />
              );
            })}
          </g>

          <defs>
            <filter id="glow3">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-gold">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-gold-ultra">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feColorMatrix
                type="matrix"
                values="1 0.9 0.2 0 0  0 0.8 0.3 0 0  0 0.6 0.9 0 0  0 0 0 1 0"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "hsl(0 75% 25%)", stopOpacity: "0.3" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "hsl(0 75% 35%)", stopOpacity: "0.4" }}
              />
            </linearGradient>
            <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "hsl(0 75% 25%)", stopOpacity: "0.2" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "hsl(0 75% 35%)", stopOpacity: "0.3" }}
              />
            </linearGradient>
            <linearGradient
              id="gradient-gold2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "hsl(45 100% 70%)", stopOpacity: "0.7" }}
              />
              <stop
                offset="50%"
                style={{ stopColor: "hsl(38 100% 60%)", stopOpacity: "0.9" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "hsl(30 100% 55%)", stopOpacity: "0.7" }}
              />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
};
