'use client';
import Link from 'next/link';
import { Youtube, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountdownTimer } from '@/components/countdown-timer';
import { DigitalRain } from '@/components/digital-rain';
import { StaggeredReveal } from '@/components/staggered-reveal';
import { Typewriter } from '@/components/typewriter';
import { TwoColorTypewriter } from '@/components/two-color-typewriter';
import { useState, useEffect } from 'react';

const GLITCH_TEXT_1 = "Error";
const GLITCH_TEXT_2 = "404";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [manuallyHidden, setManuallyHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (manuallyHidden) return;
      
      // Get Section 3 position
      const section3 = document.getElementById('section-3');
      if (!section3) return;
      
      const rect = section3.getBoundingClientRect();
      // Show popup only after Section 3 has been scrolled past (fully scrolled through)
      const isScrolledPast = rect.bottom < window.innerHeight / 1;
      
      setShowPopup(isScrolledPast);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [manuallyHidden]);

  const handleClose = () => {
    setShowPopup(false);
    setManuallyHidden(true);
    
    setTimeout(() => {
      setManuallyHidden(false);
    }, 3000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <DigitalRain />

      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-16 h-4 bg-primary/30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 25%, 75% 25%, 75% 50%, 50% 50%, 50% 75%, 25% 75%, 25% 100%, 0 100%)' }}></div>
      <div className="absolute top-4 right-4 w-16 h-8 border-t-2 border-r-2 border-primary/20"></div>
      <div className="absolute bottom-4 left-4 w-16 h-4 bg-primary/30" style={{ clipPath: 'polygon(0 0, 75% 0, 75% 25%, 50% 25%, 50% 50%, 25% 50%, 25% 75%, 0 75%)', transform: 'rotate(180deg)'}}></div>
      <div className="absolute bottom-4 right-4 w-16 h-4 bg-primary/30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 25%, 75% 25%, 75% 50%, 50% 50%, 50% 75%, 25% 75%, 25% 100%, 0 100%)', transform: 'rotate(180deg)' }}></div>
      
      <span className="glitch-line" style={{ top: '15%', left: '20%', width: '20px', animationDuration: '2.5s' }}></span>
      <span className="glitch-line" style={{ top: '25%', right: '15%', width: '15px', animationDuration: '3s' }}></span>
      <span className="glitch-line" style={{ top: '50%', left: '10%', width: '25px', animationDuration: '2s' }}></span>
      <span className="glitch-line" style={{ top: '75%', right: '25%', width: '18px', animationDuration: '3.5s' }}></span>
      <span className="glitch-line" style={{ bottom: '10%', left: '30%', width: '15px', animationDuration: '2.2s' }}></span>
      
      {/* Additional glitch elements */}
      <div className="absolute top-1/4 left-8 w-1 h-16 bg-accent/30 animate-pulse-fast"></div>
      <div className="absolute bottom-1/4 right-8 w-1 h-24 bg-primary/30 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-12 w-2 h-2 bg-accent rounded-full animate-ping"></div>
      <div className="absolute bottom-1/3 left-12 w-2 h-2 bg-primary rounded-full animate-ping delay-1000"></div>

      {/* Section 1: Cyberstrike 25 */}
      <section className="relative z-10 flex items-center justify-center min-h-screen w-full py-8 px-4">
        {/* Content */}
        <div className="flex flex-col items-center justify-center w-full max-w-6xl gap-8">
          <div className="text-center flex-grow">
        <h2 className="text-6xl md:text-6xl lg:text-7xl font-headline font-black tracking-wide mb-6">
          <TwoColorTypewriter
            text1="CYBERSTRIKE"
            text2="25"
            color1="white"
            color2="#ef4444"
            speed={100}
            showCursor={true}
            triggerOnVisible={true}
            className="font-black"
          />
        </h2>
        <p className="text-lg md:text-xl text-foreground/70 mb-8 mx-auto max-w-xl font-semibold">
          <Typewriter text="The future of cybersecurity competition is here. Join the elite." speed={30} showCursor={true} keepCursor={false} triggerOnVisible={true} />
        </p>
          </div>
          <div className="w-full flex justify-center z-20">
            <CountdownTimer />
          </div>
          <Button
          asChild
          size="lg"
          className="bg-primary text-black hover:bg-primary/90 border-2 border-primary font-bold"
        >
          <Link href="/register">To Main Event</Link>
        </Button>
        </div>
      </section>

      {/* Creative Divider 1 */}
      <div className="relative z-10 w-full flex justify-center py-4">
        <div className="w-3/4 max-w-3xl">
          <div className="relative h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Section 2: Error 404 */}
      <section className="relative z-10 flex items-center justify-center min-h-screen w-full py-8 px-4">
        <div className="flex flex-col items-center w-full" style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.5)) drop-shadow(0 0 25px hsl(var(--destructive) / 0.5))' }}>
          <div className="glitch font-headline text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter" data-text={GLITCH_TEXT_1}>
            <StaggeredReveal 
              text={GLITCH_TEXT_1}
              className="justify-center"
              delay={80}
            />
          </div>
          <div className="glitch font-headline text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter -mt-8" data-text={GLITCH_TEXT_2}>
            <StaggeredReveal 
              text={GLITCH_TEXT_2}
              className="justify-center"
              delay={80}
            />
          </div>
        </div>
      </section>

      {/* Creative Divider 2 */}
      <div className="relative z-10 w-full flex justify-center py-4">
        <div className="w-3/4 max-w-3xl">
          <div className="relative">
            <div className="h-px bg-gradient-to-r from-transparent via-accent/30 via-primary/50 via-accent/30 to-transparent"></div>
            <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-accent/50 rounded-full animate-pulse"></div>
            <div className="absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>
          
      {/* Section 3: YouTube and Events Button */}
      <section id="section-3" className="relative z-10 flex items-center justify-center min-h-screen w-full py-8 px-4">
        <div className="flex flex-col items-center gap-6 w-full max-w-xs">
            <Button
              asChild
              variant="outline"
            className="group w-full border-2 border-accent text-accent bg-black/50 hover:bg-accent hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.accent)] justify-center px-4 h-12"
            >
              <a href="https://www.youtube.com/watch?v=PpJQZH9B1Y4" target="_blank" rel="noopener noreferrer">
                <Youtube className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
                <span>Youtube</span>
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="w-full bg-primary text-black hover:bg-primary/90 transition-all duration-300 shadow-[0_0_15px_theme(colors.primary)] hover:shadow-[0_0_30px_theme(colors.primary)]"
            >
              <Link href="/events">Events</Link>
            </Button>
          </div>
      </section>

      {/* Video Popup - Only shows when Section 3 is in view */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-700 ease-out ${
          showPopup
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-75 pointer-events-none'
        }`}
      >
        {/* Backdrop Overlay */}
        <div 
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-700 ${
            showPopup ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        ></div>

        {/* Video Container */}
        <div className="relative w-full max-w-4xl z-10">
          <div className="relative p-6 bg-black/95 rounded-2xl border-2 border-transparent bg-gradient-to-br from-accent/20 via-primary/20 to-destructive/20 shadow-[0_0_40px_hsl(var(--accent)/0.4),0_0_80px_hsl(var(--primary)/0.3)] backdrop-blur-sm animate-pulse-glow">
            {/* Corner Accents */}
            <div className="absolute top-2 left-2 w-12 h-12 border-l-4 border-t-4 border-accent rounded-tl-2xl"></div>
            <div className="absolute top-2 right-2 w-12 h-12 border-r-4 border-t-4 border-accent rounded-tr-2xl"></div>
            <div className="absolute bottom-2 left-2 w-12 h-12 border-l-4 border-b-4 border-primary rounded-bl-2xl"></div>
            <div className="absolute bottom-2 right-2 w-12 h-12 border-r-4 border-b-4 border-primary rounded-br-2xl"></div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-destructive to-destructive/80 border-2 border-destructive/60 rounded-full flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 shadow-[0_0_20px_hsl(var(--destructive)/0.8)] z-10 group"
            >
              <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Title Bar */}
            <div className="text-center mb-6">
              <h3 className="text-accent text-lg md:text-xl font-bold tracking-wider drop-shadow-[0_0_10px_hsl(var(--accent)/0.8)] flex items-center justify-center gap-3">
                <Youtube className="w-6 h-6" />
                CYBERSTRIKE 25 - OFFICIAL AFTERMOVIE
              </h3>
              <div className="mt-2 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-accent to-transparent"></div>
            </div>

            {/* Video Container */}
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl bg-black shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <iframe
                className="absolute top-0 left-0 w-full h-full border-none"
                src="https://www.youtube.com/embed/PpJQZH9B1Y4?rel=0&modestbranding=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Tech Lines Decoration */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2"></div>
            
            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 40px hsl(var(--accent) / 0.4),
                        0 0 80px hsl(var(--primary) / 0.3);
          }
          50% {
            box-shadow: 0 0 60px hsl(var(--primary) / 0.5),
                        0 0 100px hsl(var(--accent) / 0.4);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}