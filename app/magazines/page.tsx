"use client";

import { useEffect, useRef } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { zentry } from "@/fonts/font";
import { cn } from "@/lib/utils";
import "./magazines.css";

const MagazinesPage = () => {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const articles = [
    {
      title: "Magazine-Issue 1",
      // excerpt:
      //   "Deep dive into how artificial neural networks are revolutionizing machine learning and reshaping our understanding of intelligence.",
      image: "/magzine1img.png",
      // category: "Artificial Intelligence",
      date: "2025",
      // readTime: "12 min",
      featured: true,
      // icon: <Cpu className="h-5 w-5" />,
      url: "https://heyzine.com/flip-book/263c4f6940.html?fbclid=PAVERDUAMbh_JleHRuA2FlbQIxMAABp2xhlSXwA3HVec5oUiuOjZ-OjKgkNBfr43Qt6VSvgSdOdy6Hh0Nnjr5LlLF2_aem_iYhYAgxyAqVpeLiVFn7WTw",
    },
    {
      title: "Newsletter Volume 6",

      image: "/magzine/vol6.jpg",
      // category: "Quantum Tech",
      date: "2024",
      // readTime: "8 min",
      featured: false,
      // icon: <Zap className="h-5 w-5" />,
      url: "https://heyzine.com/flip-book/2b12fc8496.html",
    },
    {
      title: "Newsletter Volume 5",
      // excerpt:
      //   "From DNA storage to crystalline memory, exploring the next generation of data preservation technologies.",
      image: "/magzine/vol5.jpg",
      // category: "Data Science",
      date: "2023",
      // readTime: "6 min",
      featured: false,
      // icon: <Database className="h-5 w-5" />,
      url: "https://heyzine.com/flip-book/3850cde9d3.html",
    },
    {
      title: "Newsletter Volume 4",
      // excerpt:
      //   "As virtual worlds become more prevalent, new security challenges emerge that require innovative solutions.",
      image: "/magzine/vol4.jpg",
      // category: "Security",
      date: "2021",
      // readTime: "10 min",
      featured: false,
      // icon: <Cpu className="h-5 w-5" />,
      url: "https://heyzine.com/flip-book/07612552b2.html",
    },
    {
      title: " Newsletter Volume 3",
      // excerpt:
      //   "Exploring how blockchain technology is transforming industries beyond cryptocurrency and reshaping digital trust.",
      image: "/magzine/vol3.png",
      // category: "Blockchain",
      date: "2020",
      // readTime: "9 min",
      featured: false,
      // icon: <Zap className="h-5 w-5" />,
      url: "https://heyzine.com/flip-book/ed4ecf4831.html",
    },
    {
      title: "Newsletter Volume 2",
      // excerpt:
      //   "How Internet of Things technology is building the foundation for tomorrow's connected urban environments.",
      image: "/magzine/vol2.jpg",
      // category: "IoT Technology",
      date: "December 2019",
      // readTime: "7 min",
      featured: false,
      // icon: <Database className="h-5 w-5" />,
      url: "https://heyzine.com/flip-book/29f054e0f3.html",
    },
    {
      title: "Newsletter Volume 1",
      // excerpt:
      //   "Addressing the moral implications and responsibilities in developing AI systems that impact human lives.",
      image: "/magzine/vol1.jpg",
      // category: "AI Ethics",
      date: "April 2019",
      // readTime: "11 min",
      featured: true,
      // icon: <Cpu className="h-5 w-5" />,
      url: "https://heyzine.com/flip-book/c94dcd94c0.html",
    },
  ];

  const handleCardClick = (url: string) => {
    if (url.startsWith("http")) window.open(url, "_blank");
    else window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden hero-section">
        <video
          width="100%"
          height="100%"
          playsInline
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover object-center md:object-top"
        >
          <source src="/magzine/herovid4.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>

        <div className="relative h-full flex items-center justify-center px-4 text-center">
          <div ref={addToRefs} className="scroll-reveal">
            <h1
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-wide",
                zentry.className
              )}
            >
              The Digital <span className="text-red-500">Dispatch</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-6 text-gray-300 font-light tracking-wide">
              Quick reads. Big ideas. Future tech.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 px-4 sm:px-6 lg:px-20 magazine-section">
        <div className="max-w-7xl mx-auto">
          <div ref={addToRefs} className="scroll-reveal mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Recent <span className="text-red-500">Release</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our latest edition featuring cutting-edge tech insights
              and innovations.
            </p>
          </div>

          <div
            ref={addToRefs}
            className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Featured Article Left */}
            <div className="space-y-4 lg:space-y-6">
              <div className="flex items-center space-x-3 text-gray-400 text-sm sm:text-base">
                <Calendar className="h-5 w-5" />
                <span>{articles[0].date}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
                {articles[0].title}
              </h3>

              <Button
                variant="outline"
                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                onClick={() => handleCardClick(articles[0].url)}
              >
                READ MORE
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Featured Article Right */}
            <div
              className="relative cursor-pointer"
              onClick={() => handleCardClick(articles[0].url)}
            >
              <div className="card-hover overflow-hidden transition-transform duration-300">
                <img
                  src={articles[0].image as string}
                  alt={articles[0].title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Volumes */}
      <section className="py-16 px-4 sm:px-6 lg:px-20 magazine-section">
        <div className="max-w-7xl mx-auto">
          <div ref={addToRefs} className="scroll-reveal mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Past <span className="text-red-500">Volumes</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our archive of previous editions and revisit
              groundbreaking stories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {articles.slice(1).map((article, index) => (
              <div
                key={index}
                ref={addToRefs}
                className="scroll-reveal"
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <Card
                  className="bg-gradient-to-br from-red-900/10 to-black border-2 border-red-900/30 hover:border-red-500/70 transition-all duration-300 group cursor-pointer h-full rounded-xl overflow-hidden"
                  onClick={() => handleCardClick(article.url)}
                >
                  <div className="relative overflow-hidden pt-[150%] sm:pt-[140%] md:pt-[130%] lg:pt-[150%] xl:pt-[140%]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm sm:text-base mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{article.date}</span>
                    </div>

                    <h3 className="font-bold text-lg sm:text-xl md:text-2xl mb-3 line-clamp-2 text-white group-hover:text-red-500 transition-colors">
                      {article.title}
                    </h3>

                    <Button
                      variant="ghost"
                      className="text-red-500 hover:bg-red-500/20 p-0 h-auto text-sm sm:text-base"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(article.url);
                      }}
                    >
                      READ MORE →
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MagazinesPage;