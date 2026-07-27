"use client";

import { useState, useEffect } from "react";
import { BlogCard } from "@/components/BlogCard";
import { BlogPost as BlogPostView } from "@/components/BlogPost";
import { RotatingBackground } from "@/components/RotatingBackground";
import { blogPosts, BlogPost } from "@/lib/blogData";
import { satoshi, zentry } from "@/fonts/font";
import { cn } from "@/lib/utils";

// Note: Metadata export is not supported in client components
// For SEO, consider moving to a server component wrapper or using next/head

export default function BlogsPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleBackToPosts = () => {
    setSelectedPost(null);
  };

  if (selectedPost) {
    return <BlogPostView post={selectedPost} onBack={handleBackToPosts} />;
  }

  return (
    <div className={`min-h-screen bg-background relative ${satoshi.className}`}>
      {mounted && <RotatingBackground />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 relative z-10">
        {/* Header with proper spacing for navbar */}
        <header className="mb-12 sm:mb-16 text-center pt-24 sm:pt-28 md:pt-32">
          <h1
            className={cn(
              "hero-title text-7xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-8 tracking-wide px-4",
              zentry.className
            )}
          >
            <span className={cn("text-red-500", zentry.className)}>BLOG</span>
          </h1>
          <p
            className={cn(
              "text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4",
              satoshi.className
            )}
          >
            Curated stories exploring the intersection of design, technology,
            and culture
          </p>
        </header>

        {/* Blog Grid */}
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} onClick={handlePostClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
