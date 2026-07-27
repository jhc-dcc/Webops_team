"use client";

import { useState, useEffect } from "react";
import { X, Newspaper, ExternalLink } from "lucide-react";

interface NewsBannerProps {
  newsUrl?: string;
  title?: string;
  description?: string;
  autoHideDuration?: number;
  showOnlyOnce?: boolean;
}

export default function NewsBanner({
  newsUrl = "https://www.thehindu.com/news/cities/mumbai/mumbai-college-students-collect-2-tonnes-of-e-waste-spread-awareness-among-schools/article69885016.ece",
  title = "DCC's E-Waste Drive featured in major news!",
  description = "Read about our environmental impact and sustainability efforts.",
  autoHideDuration,
  showOnlyOnce = true,
}: NewsBannerProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Small delay to ensure page loads before showing popup
    const timer = setTimeout(() => {
      if (showOnlyOnce && typeof window !== 'undefined') {
        const lastSeen = localStorage.getItem('newsBannerLastSeen');
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        
        if (!lastSeen || Date.now() - parseInt(lastSeen) > oneWeek) {
          setShowModal(true);
        }
      } else {
        setShowModal(true);
      }
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, [showOnlyOnce]);

  useEffect(() => {
    if (autoHideDuration && showModal) {
      const timer = setTimeout(() => {
        handleCloseModal();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [showModal, autoHideDuration]);

  const handleCloseModal = () => {
    setShowModal(false);
    
    if (showOnlyOnce && typeof window !== 'undefined') {
      localStorage.setItem('newsBannerLastSeen', Date.now().toString());
    }
  };

  if (!showModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleCloseModal}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-red-500/50 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-500">
          {/* Header with close button */}
          <div className="absolute -top-2 -right-2">
            <button
              onClick={handleCloseModal}
              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Icon and Badge */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <Newspaper className="w-8 h-8 text-white" />
                </div>
                {/* Pulsing effect */}
                <div className="absolute inset-0 w-16 h-16 bg-red-500/30 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* News Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold border border-red-500/30">
                📰 BREAKING NEWS
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-white text-center mb-3 leading-tight">
              🎉 {title}
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-center text-sm mb-6 leading-relaxed">
              {description}
            </p>

            {/* Call to Action */}
            <div className="space-y-3">
              <a
                href={newsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/25"
                onClick={handleCloseModal}
              >
                <span>Read Full Article</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <button
                onClick={handleCloseModal}
                className="w-full text-gray-400 hover:text-white py-2 text-sm transition-colors duration-200"
              >
                Maybe later
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full"></div>
        </div>
      </div>
    </>
  );
}