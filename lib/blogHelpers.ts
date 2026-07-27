import { Metadata } from "next";
import { BlogPost } from "./blogData";

/**
 * Generate metadata for a blog post page
 * Can be used in future when implementing dynamic blog post routes
 */
export function generateBlogPostMetadata(post: BlogPost): Metadata {
  return {
    title: `${post.title} | DCC Blog`,
    description: post.excerpt,
    keywords: post.keywords.join(", "),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image
        ? [
            {
              url: post.image,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

/**
 * Generate metadata for the main blog listing page
 */
export function generateBlogListingMetadata(): Metadata {
  return {
    title: "Blog | Dot Com Club",
    description:
      "Curated stories exploring the intersection of design, technology, and culture from the Dot Com Club at Jai Hind College.",
    keywords:
      "blog, technology, design, culture, dot com club, jai hind college, tech events, cyberstrike, e-waste",
    openGraph: {
      title: "Blog | Dot Com Club",
      description:
        "Curated stories exploring the intersection of design, technology, and culture",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog | Dot Com Club",
      description:
        "Curated stories exploring the intersection of design, technology, and culture",
    },
  };
}

/**
 * Get all blog post slugs for static generation
 */
export function getAllBlogSlugs() {
  // Can be expanded when connecting to a CMS
  return [];
}

/**
 * Get blog post by ID
 */
export function getBlogPostById(
  id: string,
  posts: BlogPost[]
): BlogPost | undefined {
  return posts.find((post) => post.id === id);
}

/**
 * Get blog posts by category
 */
export function getBlogPostsByCategory(
  category: string,
  posts: BlogPost[]
): BlogPost[] {
  return posts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get blog posts by keyword
 */
export function getBlogPostsByKeyword(
  keyword: string,
  posts: BlogPost[]
): BlogPost[] {
  return posts.filter((post) =>
    post.keywords.some((k) => k.toLowerCase().includes(keyword.toLowerCase()))
  );
}

/**
 * Search blog posts by title or content
 */
export function searchBlogPosts(query: string, posts: BlogPost[]): BlogPost[] {
  const lowercaseQuery = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get recent blog posts
 */
export function getRecentBlogPosts(
  posts: BlogPost[],
  limit: number = 5
): BlogPost[] {
  return [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * Get related blog posts based on keywords and category
 */
export function getRelatedBlogPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  return allPosts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => {
      let score = 0;

      // Same category gets higher score
      if (post.category === currentPost.category) {
        score += 3;
      }

      // Shared keywords increase score
      const sharedKeywords = post.keywords.filter((keyword) =>
        currentPost.keywords.includes(keyword)
      );
      score += sharedKeywords.length;

      return { post, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}
