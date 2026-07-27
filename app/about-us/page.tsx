"use client";

import { zentry } from "@/fonts/font";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Animated Background Component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950/20 to-black"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}

// Timeline data moved outside the component for performance
const timelineData = [
  {
    year: "2014",
    title: "Inception Year",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHntwh4TVXK91bnH0DfmrPuAEaV8Fjq57dsiQgM",
    description: "The DotCom Club was founded in 2014 to support IT and BVOC(SD) students, driven entirely by student initiative. From admissions support and backend management to organizing seminars and flagship events like the E-Waste Drive and Cyberstrike, this year marked the beginning of a legacy of innovation and community engagement.",
  },
  {
    year: "2019",
    title: "E-Waste Drive",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnqHb6Tj2zFsuRWPjhtVIMZSOqr7GXwNQ61cTp",
    description: "Our 2019 E-Waste Drive, held from September 16th to 18th, made a powerful environmental impact by collecting over 450 kg of e-waste. The event encouraged creativity with competitions like 'Best out of E-Waste' and poster-making, promoting sustainable practices and eco-awareness among students.",
  },
  {
    year: "Dec 2019",
    title: "Cyberstrike",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnh1SZrsD7wtEsA8bPRdHI0vpeYQC5JLhZul9a",
    description: "Cyberstrike 2019 was a gaming and tech extravaganza featuring competitive matches in Battlegrounds Mobile, Call of Duty, CS:GO, FIFA 20, and Counter-Strike. The event introduced participants to cutting-edge experiences through VR technology and robotics workshops, making it a truly futuristic edition.",
  },
  {
    year: "Feb 2021",
    title: "Virtual Cyberstrike",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnLwJo4Gt5Ba8Mi5Hfh0TCJrvp3b2t7WcgQGN1",
    description: "Adapting to pandemic restrictions, Cyberstrike 2021 went completely virtual. Students competed online in COD Mobile, Valorant, and CS:GO, along with Chess, quizzes, Code Wars, and debates. The digital format kept the competitive and collaborative spirit alive during challenging times.",
  },
  {
    year: "Aug 2022",
    title: "E-Waste Drive",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnV074vThjr5zhubXRsf38LaUvHEK7kpWOe6YC",
    description: "Under the theme 'Revive,' this E-Waste Drive collected 306 kg of discarded electronics. The event combined environmental responsibility with fun games like Flip the Bottle, Roll the Dice, and Basketball, making sustainability engaging for all participants.",
  },
  {
    year: "Jan 2023",
    title: "Cyberstrike: Multiversal Odyssey",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHn0uIU8OXbEg42R1FwH5tal9hqy7mszSbUfNeZ",
    description: "Cyberstrike 2023, themed 'Multiversal Odyssey,' immersed participants in an interdimensional gaming journey with FIFA 22, Mortal Kombat, COD Mobile, and Counter-Strike tournaments. A scavenger hunt and tech competitions added excitement and diversity to this multidimensional experience.",
  },
  {
    year: "Aug 2023",
    title: "E-Waste Drive",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnSsHrzwduHaOIo6ybnErgczB3sT8A521mdZlY",
    description: "This impactful E-Waste Drive collected 341.25 kg of discarded electronics. It featured an inspiring seminar by Ms. Rashmi Joshi and an awareness drive at Churchgate Station, spreading the message of sustainability beyond the campus.",
  },
  {
    year: "Jan 2024",
    title: "Cyberstrike: Digital Downtown",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnDEbNcuq6ZKq9mhDsy1HCxSeOL5d4PInuQWrA",
    description: "Cyberstrike 2024 brought 'Digital Downtown' to life with an electrifying lineup of Valorant, BGMI, Mortal Kombat, and FIFA tournaments. The addition of Code Hunt and cultural showcases created a balanced blend of gaming, innovation, and creativity.",
  },
  {
    year: "Aug 2024",
    title: "E-Waste Drive",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnpoP88YNvGfzOk3FqNQKIB68U0movL4Wur2bJ",
    description: "A landmark edition of the E-Waste Drive, this campaign collected a record-breaking 454.25 kg of e-waste. Highlights included a thought-provoking skit, participation in the Global E-Waste Conference, and a seminar by Waste Management Services, inspiring responsible e-waste practices.",
  },
  {
    year: "Jan 2025",
    title: "Cyberstrike: Genesis & Exodus",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnBr41M4QDxrEAPiKm0JunjBMbytZqcvdW83gG",
    description: "Cyberstrike 2025 embraced the transformative theme 'Genesis & Exodus,' symbolizing growth and change. With esports battles, a high-energy hackathon, vibrant cultural showcases, and an immersive escape room challenge, this edition delivered an unforgettable mix of creativity and competition.",
  },
  {
    year: "Mar 2025",
    title: "Tech-Surjan 2025",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnEMmZ7v0c7VZq0a2v8pPiynTuLfHO69gJsWtS",
    description: "Tech-Surjan 2025 brought together innovation and entrepreneurship with an intercollegiate exhibition of operational projects, groundbreaking research papers, creative poster presentations, and ambitious startup pitches, fostering a culture of innovation.",
  },
  {
    year: "July 2025",
    title: "E-Waste Drive",
    image: "https://0wcouur2ua.ufs.sh/f/aRfYxWK0MkHnd3RFIksKPl6IUv1HWzAVsEdC935ahDBwYLZ7",
    description: "A landmark edition of the E-Waste Drive, this campaign collected a record-breaking 2 tons of e-waste. Highlights included a thought-provoking skit, participation in the Global E-Waste Conference, and a seminar by Waste Management Services, inspiring responsible e-waste practices.",
  },
];

function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const timelineLength = timelineData.length;

  // Auto-rotate timeline with rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRotating(true);
      setTimeout(() => {
        setActiveIndex((prev) => {
          const nextIndex = (prev + 1) % timelineLength;
          setIsRotating(false);
          return nextIndex;
        });
      }, 500);
    }, 6000); 
    return () => clearInterval(interval);
  }, [timelineLength]);

  const handleNavigation = (newIndex: number) => {
    if (newIndex !== activeIndex && !isRotating) {
      setIsRotating(true);
      setTimeout(() => {
        setActiveIndex(newIndex);
        setIsRotating(false);
      }, 500);
    }
  };

  return (
    <>
      <style jsx>{`
        .cube-container {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        
        .cube {
          width: 100%;
          max-width: 350px;
          height: 280px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
          margin: 0 auto;
        }
        
        .cube.rotating {
          transform: rotateY(90deg);
        }
        
        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .cube-face-front { transform: rotateY(0deg) translateZ(175px); }
        .cube-face-right { transform: rotateY(90deg) translateZ(175px); }
        .cube-face-back { transform: rotateY(180deg) translateZ(175px); }
        .cube-face-left { transform: rotateY(-90deg) translateZ(175px); }
        .cube-face-top { transform: rotateX(90deg) translateZ(140px); }
        .cube-face-bottom { transform: rotateX(-90deg) translateZ(140px); }
        
        .timeline-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(239, 68, 68, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .timeline-dot.active {
          background: #ef4444;
          border-color: #ef4444;
          transform: scale(1.2);
        }
        
        .timeline-dot:hover {
          border-color: #ef4444;
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .cube {
            max-width: 280px;
            height: 220px;
          }
          
          .cube-face-front { transform: rotateY(0deg) translateZ(140px); }
          .cube-face-right { transform: rotateY(90deg) translateZ(140px); }
          .cube-face-back { transform: rotateY(180deg) translateZ(140px); }
          .cube-face-left { transform: rotateY(-90deg) translateZ(140px); }
          .cube-face-top { transform: rotateX(90deg) translateZ(110px); }
          .cube-face-bottom { transform: rotateX(-90deg) translateZ(110px); }
        }

        @media (max-width: 480px) {
          .cube {
            max-width: 250px;
            height: 200px;
          }
          
          .cube-face-front { transform: rotateY(0deg) translateZ(125px); }
          .cube-face-right { transform: rotateY(90deg) translateZ(125px); }
          .cube-face-back { transform: rotateY(180deg) translateZ(125px); }
          .cube-face-left { transform: rotateY(-90deg) translateZ(125px); }
          .cube-face-top { transform: rotateX(90deg) translateZ(100px); }
          .cube-face-bottom { transform: rotateX(-90deg) translateZ(100px); }
        }
      `}</style>

      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className={cn("text-4xl md:text-6xl font-bold mb-6 text-red-500", zentry.className)}>
            OUR JOURNEY
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our innovation journey
          </p>
          <div className="w-16 h-1 bg-red-500 mx-auto mt-4"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          
          {/* 3D Rotating Cube - Centered */}
          <div className="mb-12">
            <div className="cube-container">
              <div className={cn("cube", isRotating && "rotating")}> 
                {/* Front face */}
                <div className="cube-face cube-face-front">
                  <Image
                    src={timelineData[activeIndex].image}
                    alt={timelineData[activeIndex].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 280px, 350px"
                    onError={(e) => {
                      console.log(`Failed to load image: ${timelineData[activeIndex].image}`);
                      // Set a fallback image if the original fails
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/fallback-event.jpg';
                    }}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold inline-block mb-2">
                      {timelineData[activeIndex].year}
                    </div>
                  </div>
                </div>
                {/* Other faces with different images */}
                {[1, 2, 3, 4, 5].map((offset, index) => {
                  if (timelineData.length < 2) return null;
                  const imageIndex = (activeIndex + offset) % timelineData.length;
                  const faceClasses = [
                    'cube-face-right',
                    'cube-face-back', 
                    'cube-face-left',
                    'cube-face-top',
                    'cube-face-bottom'
                  ];
                  return (
                    <div key={index} className={`cube-face ${faceClasses[index]}`}>
                      <Image
                        src={timelineData[imageIndex].image}
                        alt={timelineData[imageIndex].title}
                        fill
                        className="object-cover opacity-60"
                        sizes="(max-width: 768px) 280px, 350px"
                        onError={(e) => {
                          console.log(`Failed to load image: ${timelineData[imageIndex].image}`);
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/fallback-event.jpg';
                        }}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                      <div className="absolute inset-0 bg-black/60"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Event Details Card - Below Cube */}
          <div className="max-w-4x4 mx-auto mb-8">
            <div className="bg-black/60 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 md:p-8 shadow-2xl">
              
              {/* Event Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="bg-red-500 text-white px-6 py-2 rounded-full font-bold text-xl">
                    {timelineData[activeIndex].year}
                  </div>
                </div>
                
                <h3 className={cn("text-2xl md:text-4xl font-bold text-white mb-4", zentry.className)}>
                  {timelineData[activeIndex].title}
                </h3>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6 text-center max-w-3xl mx-auto">
                {timelineData[activeIndex].description}
              </p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Timeline Progress</span>
                  <span>{activeIndex + 1} / {timelineData.length}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500 rounded-full"
                    style={{ width: `${((activeIndex + 1) / timelineData.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Navigation Dots */}
          <div className="mb-8">
            <div className="timeline-dots" role="tablist" aria-label="Timeline navigation">
              {timelineData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(index)}
                  className={cn(
                    "timeline-dot",
                    index === activeIndex && "active"
                  )}
                  aria-label={`${item.year} - ${item.title}`}
                  aria-selected={index === activeIndex}
                  role="tab"
                  tabIndex={index === activeIndex ? 0 : -1}
                  title={`${item.year} - ${item.title}`}
                  disabled={isRotating}
                />
              ))}
            </div>
          </div>

 

          {/* Navigation Controls */}
          
        </div>
      </section>
    </>
  );
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style jsx global>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
          <AnimatedBackground />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <div className="animate-on-scroll opacity-0">
              <h1 className={cn(
                "text-5xl md:text-7xl lg:text-8xl font-bold mb-8",
                zentry.className
              )}>
                About <span className="text-red-500">DCC</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Empowering the next generation of tech innovators through creativity, 
                collaboration, and cutting-edge technology at Jai Hind College.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="#mission"
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25"
                >
                  Our Mission
                </Link>
                <Link
                  href="#timeline"
                  className="px-8 py-4 border-2 border-red-500 hover:bg-red-500 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                >
                  Our Journey
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
              
        </section>

        {/* Main Content */}
        <div className="relative">
          <AnimatedBackground />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
            {/* Mission Section */}
            <section id="mission" className="animate-on-scroll opacity-0 mb-24">
              <div className="max-w-5xl mx-auto">
                <div className="bg-black/70 border-2 border-red-500 rounded-2xl p-10 shadow-lg">
                  <h2 className={cn("text-4xl md:text-5xl font-bold mb-8 text-white text-center", zentry.className)}>
                    Our <span className="text-red-500">Mission</span>
                  </h2>
                  <div className="space-y-6 text-lg text-gray-300 leading-relaxed text-left">
                    <p>
                      The BSc IT and BVoc Software Development departments
                      of Jai Hind College are dedicated to shaping young minds into
                      future-ready computer professionals through a robust curriculum and dynamic co-curricular activities.
                    </p>
                    <p>
                      The <strong className="text-red-400">DOT COM CLUB</strong>, the official club of the IT and BVoc SD departments,
                      is a club by the students and for the students. A new student committee
                      is elected each year, encouraging active participation and fostering leadership, creativity, and collaboration.
                    </p>
                    <p>
                      We organize orientations in fun and informative ways that encourage freshers and give them and their
                      parents a clear understanding of department life. Our annual tech fest <span className="text-white">Cyberstrike </span>
                      has become a landmark event in the college calendar.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Timeline Section */}
            <section id="timeline" className="animate-on-scroll opacity-0">
              <Timeline />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}