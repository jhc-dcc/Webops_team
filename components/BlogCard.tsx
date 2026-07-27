"use client";

import { useState } from "react";
import Image from "next/image";
import { BlogPost } from "@/lib/blogData";

interface BlogCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}

export const BlogCard = ({ post, onClick }: BlogCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    onClick(post);
  };

  // Image-only card (large images, minimal text)
  if (post.type === "image") {
    return (
      <div
        className="blog-card-image h-80 relative group cursor-pointer"
        onClick={handleClick}
      >
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className={`object-cover rounded-xl transition-all duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl" />
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">
            {post.title}
          </h3>
          <div className="space-y-2">
            <p className="text-white/80 text-sm">
              {post.author} • {post.department}
            </p>
            <p className="text-white/60 text-xs">
              {post.category} • {post.date}
            </p>
            <div className="flex flex-wrap gap-1">
              {post.keywords.slice(0, 2).map((keyword, index) => (
                <span
                  key={index}
                  className="text-white/70 text-xs bg-white/10 px-2 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Text-heavy card (big fonts, small/no images)
  if (post.type === "text") {
    return (
      <div
        className="blog-card-text min-h-64 group cursor-pointer"
        onClick={handleClick}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-primary text-sm font-medium tracking-wide uppercase">
              {post.category}
            </span>
            <h3 className="text-white text-2xl font-bold leading-tight line-clamp-3">
              {post.title}
            </h3>
          </div>
          <p className="text-white/70 text-base line-clamp-4 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">{post.author}</span>
              <span className="text-white/60 text-sm">{post.date}</span>
            </div>
            <div className="space-y-2">
              <p className="text-white/50 text-xs">{post.department}</p>
              <div className="flex flex-wrap gap-1">
                {post.keywords.slice(0, 3).map((keyword, index) => (
                  <span
                    key={index}
                    className="text-white/60 text-xs bg-white/5 px-2 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Balanced card (medium image + text)
  return (
    <div
      className="blog-card-balanced group cursor-pointer"
      onClick={handleClick}
    >
      {post.image && (
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      <div className="p-6 space-y-3">
        <div className="space-y-2">
          <span className="text-primary text-xs font-medium tracking-wide uppercase">
            {post.category}
          </span>
          <h3 className="text-white text-lg font-bold line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </div>
        <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>{post.author}</span>
            <span>{post.date}</span>
          </div>
          <p className="text-white/40 text-xs">{post.department}</p>
          <div className="flex flex-wrap gap-1">
            {post.keywords.slice(0, 2).map((keyword, index) => (
              <span
                key={index}
                className="text-white/50 text-xs bg-white/5 px-2 py-1 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
