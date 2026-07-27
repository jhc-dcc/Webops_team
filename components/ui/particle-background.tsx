
'use client';

import type { FC } from 'react';
import { useRef, useEffect, useCallback } from 'react';

// Colors derived from the cyberpunk theme in globals.css
const PARTICLE_COLORS = [
  'hsl(16, 100%, 50%)', //  Primary - Deep Orange
  'hsl(0, 100%, 55%)', // Accent - Bright Red
  'hsl(30, 100%, 50%)', // A vibrant orange
  'hsl(45, 100%, 50%)',  // A bright yellow
  'hsl(10, 100%, 60%)', // Another shade of red-orange
];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  baseX?: number; // Optional for burst particles
  baseY?: number; // Optional for burst particles
  density?: number; // Optional for burst particles
  color: string;
  opacity: number;
  velocityX: number;
  velocityY: number;
  life?: number; // For burst particles
  initialLife?: number; // For burst particles
}

const MAX_AMBIENT_PARTICLES = 70;
const CONNECTION_DISTANCE = 120;
const MOUSE_INTERACTION_RADIUS = 180;
const MOUSE_REPEL_STRENGTH = 0.03;
const AMBIENT_PARTICLE_SPEED = 0.5;

const BURST_PARTICLE_COUNT = 30;
const BURST_PARTICLE_SPEED_MIN = 2;
const BURST_PARTICLE_SPEED_MAX = 5;
const BURST_PARTICLE_LIFE_MIN = 40; // frames
const BURST_PARTICLE_LIFE_MAX = 70; // frames
const BURST_PARTICLE_SIZE_MIN = 1;
const BURST_PARTICLE_SIZE_MAX = 3;

const SPONTANEOUS_BURST_INTERVAL = 120; // Frames (e.g., 120 frames = 2 seconds at 60fps)


const ParticleBackground: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesArrayRef = useRef<Particle[]>([]);
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const animationFrameIdRef = useRef<number | null>(null);
  const lastParticleId = useRef(0);
  const frameCounterRef = useRef(0); // For spontaneous bursts

  const createAmbientParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    lastParticleId.current += 1;
    const size = Math.random() * 2 + 1;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    return {
      id: lastParticleId.current,
      x,
      y,
      size,
      baseX: x,
      baseY: y,
      density: Math.random() * 30 + 1,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      opacity: Math.random() * 0.5 + 0.2,
      velocityX: (Math.random() - 0.5) * AMBIENT_PARTICLE_SPEED * 2,
      velocityY: (Math.random() - 0.5) * AMBIENT_PARTICLE_SPEED * 2,
    };
  }, []);

  const createBurstParticle = useCallback((originX: number, originY: number): Particle => {
    lastParticleId.current += 1;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (BURST_PARTICLE_SPEED_MAX - BURST_PARTICLE_SPEED_MIN) + BURST_PARTICLE_SPEED_MIN;
    const life = Math.random() * (BURST_PARTICLE_LIFE_MAX - BURST_PARTICLE_LIFE_MIN) + BURST_PARTICLE_LIFE_MIN;
    return {
      id: lastParticleId.current,
      x: originX,
      y: originY,
      size: Math.random() * (BURST_PARTICLE_SIZE_MAX - BURST_PARTICLE_SIZE_MIN) + BURST_PARTICLE_SIZE_MIN,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      opacity: 1, // Start fully opaque
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      life: life,
      initialLife: life,
    };
  }, []);


  const initAmbientParticles = useCallback((canvas: HTMLCanvasElement) => {
     particlesArrayRef.current = particlesArrayRef.current.filter(p => p.life !== undefined); 
    for (let i = 0; i < MAX_AMBIENT_PARTICLES; i++) {
      particlesArrayRef.current.push(createAmbientParticle(canvas));
    }
  }, [createAmbientParticle]);

  const drawConnections = useCallback((ctx: CanvasRenderingContext2D, p1: Particle) => {
    if (p1.life !== undefined) return;

    for (let i = 0; i < particlesArrayRef.current.length; i++) {
      const p2 = particlesArrayRef.current[i];
      if (p2.life !== undefined || p1.id === p2.id) continue; 

      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < CONNECTION_DISTANCE) {
        const opacity = 1 - distance / CONNECTION_DISTANCE;
        const baseHue = parseInt(p1.color.substring(p1.color.indexOf('(') + 1, p1.color.indexOf(',')));
        ctx.strokeStyle = `hsla(${baseHue}, 100%, 70%, ${opacity * 0.3})`; 
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }, []);

  const updateAndDrawParticles = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const newParticlesArray: Particle[] = [];
    particlesArrayRef.current.forEach((p) => {
      let isAlive = true;

      if (p.life !== undefined && p.initialLife !== undefined) { 
        p.life -= 1;
        if (p.life <= 0) {
          isAlive = false;
        } else {
          p.opacity = (p.life / p.initialLife) * 0.9 + 0.1; 
          p.size *= 0.98; 
          if (p.size < 0.5) isAlive = false;
        }
        p.velocityX *= 0.99; 
        p.velocityY *= 0.99;

      } else { 
        if (mousePositionRef.current.x !== null && mousePositionRef.current.y !== null && p.density) {
          const mouseX = mousePositionRef.current.x;
          const mouseY = mousePositionRef.current.y;
          const dxMouse = p.x - mouseX;
          const dyMouse = p.y - mouseY;
          const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distanceMouse < MOUSE_INTERACTION_RADIUS) {
            const forceDirectionX = dxMouse / distanceMouse;
            const forceDirectionY = dyMouse / distanceMouse;
            const force = (MOUSE_INTERACTION_RADIUS - distanceMouse) / MOUSE_INTERACTION_RADIUS;
            
            p.velocityX += forceDirectionX * force * MOUSE_REPEL_STRENGTH * p.density * 0.1;
            p.velocityY += forceDirectionY * force * MOUSE_REPEL_STRENGTH * p.density * 0.1;
          }
        }
        p.velocityX *= 0.97;
        p.velocityY *= 0.97;
        
        if (p.x + p.size > canvas.width || p.x - p.size < 0) p.velocityX *= -1;
        if (p.y + p.size > canvas.height || p.y - p.size < 0) p.velocityY *= -1;
      }

      p.x += p.velocityX;
      p.y += p.velocityY;
      
      if (p.life !== undefined) { 
         if (p.x < -p.size * 5 || p.x > canvas.width + p.size * 5 || p.y < -p.size * 5 || p.y > canvas.height + p.size * 5) {
            isAlive = false;
         }
      } else { 
          if (p.x + p.size > canvas.width) p.x = canvas.width - p.size;
          if (p.x - p.size < 0) p.x = p.size;
          if (p.y + p.size > canvas.height) p.y = canvas.height - p.size;
          if (p.y - p.size < 0) p.y = p.size;
      }


      if (isAlive) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const colorMatch = p.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (colorMatch) {
          ctx.fillStyle = `hsla(${colorMatch[1]}, ${colorMatch[2]}%, ${colorMatch[3]}%, ${p.opacity})`;
        } else {
          ctx.fillStyle = p.color; 
        }
        ctx.fill();
        
        ctx.shadowBlur = p.size * 2 + 4; 
        if (colorMatch) {
            ctx.shadowColor = `hsla(${colorMatch[1]}, ${colorMatch[2]}%, ${colorMatch[3]}%, ${p.opacity * 0.7})`;
        } else {
            ctx.shadowColor = p.color;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.life === undefined) { 
          drawConnections(ctx, p);
        }
        newParticlesArray.push(p);
      }
    });
    particlesArrayRef.current = newParticlesArray;
  }, [drawConnections, createBurstParticle]); // Added createBurstParticle to dependencies if used in animate


  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    frameCounterRef.current++;
    if (frameCounterRef.current % SPONTANEOUS_BURST_INTERVAL === 0) {
      const randomX = Math.random() * canvas.width;
      const randomY = Math.random() * canvas.height;
      for (let i = 0; i < BURST_PARTICLE_COUNT; i++) {
        particlesArrayRef.current.push(createBurstParticle(randomX, randomY));
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateAndDrawParticles(ctx, canvas);
    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [updateAndDrawParticles, createBurstParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        const currentBurstParticles = particlesArrayRef.current.filter(p => p.life !== undefined);
        initAmbientParticles(canvasRef.current);
        particlesArrayRef.current.push(...currentBurstParticles);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current.x = event.clientX;
      mousePositionRef.current.y = event.clientY;
    };
    
    const handleMouseLeave = () => {
      mousePositionRef.current.x = null;
      mousePositionRef.current.y = null;
    };

    const handleClick = (event: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        for (let i = 0; i < BURST_PARTICLE_COUNT; i++) {
          particlesArrayRef.current.push(createBurstParticle(clickX, clickY));
        }
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick); 

    if (particlesArrayRef.current.filter(p => p.life === undefined).length === 0) { 
       initAmbientParticles(canvas);
    }
    
    if (!animationFrameIdRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [initAmbientParticles, animate, createBurstParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none block"
      style={{ touchAction: 'none' }}
    />
  );
};

export default ParticleBackground;