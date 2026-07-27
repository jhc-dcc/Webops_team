"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { BlogPost as BlogPostType } from "@/lib/blogData";
import { useState, useEffect } from "react";
import { satoshi } from "@/fonts/font";

interface BlogPostProps {
  post: BlogPostType;
  onBack: () => void;
}

export const BlogPost = ({ post, onBack }: BlogPostProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger content animation after title editorial effect
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [post.title]);

  return (
    <div className={`min-h-screen bg-background ${satoshi.className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back button with proper spacing for navbar */}
        <div className="pt-20 sm:pt-24 md:pt-28">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to posts
          </button>
        </div>

        {/* Post header */}
        <header className="mb-8 sm:mb-12">
          <div className="space-y-4">
            <span className="text-primary text-sm font-bold tracking-wide uppercase animate-fade-in">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              {post.title.split(" ").map((word, index) => (
                <span
                  key={index}
                  className="inline-block editorial-word mr-2"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {word}
                </span>
              ))}
            </h1>
            <div className="flex items-center gap-4 sm:gap-6 text-white/60 animate-fade-in text-sm sm:text-base">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
          </div>
        </header>

        {/* Hero image */}
        {post.image && (
          <div className="relative mb-8 sm:mb-12 rounded-xl overflow-hidden h-48 sm:h-64 md:h-96">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        {/* Post content */}
        <article
          className={`prose prose-lg max-w-none transition-all duration-500 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-white/80 text-base sm:text-lg leading-relaxed space-y-6">
            <p className="text-lg sm:text-xl text-white/90 font-medium leading-relaxed editor-text">
              {post.excerpt}
            </p>

            {/* Split content into paragraphs */}
            {post.content.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="leading-relaxed paragraph-appear text-white/80"
                style={{ animationDelay: `${1 + index * 0.3}s` }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Post footer */}
        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-white/60 text-sm sm:text-base">
              <p>
                Published in{" "}
                <span className="text-primary font-medium">
                  {post.category}
                </span>
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-primary hover:text-white transition-colors duration-300 font-bold text-sm sm:text-base"
            >
              ← All Posts
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
