import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Blog - JHC Dot Com Club | Tech Stories & Insights",
  description:
    "Curated stories exploring the intersection of design, technology, and culture. Read about CyberStrike, Tech-Srujan, E-Waste initiatives, and more from JHC Dot Com Club.",
  keywords: [
    "JHC blog",
    "Tech blog",
    "CyberStrike",
    "Tech-Srujan",
    "E-Waste drive",
    "Technology articles",
    "Innovation stories",
    "College tech events",
    "Jai Hind College blog",
    "Student tech stories",
  ],
  openGraph: {
    title: "Blog - Tech Stories & Insights",
    description:
      "Curated stories exploring the intersection of design, technology, and culture from JHC Dot Com Club.",
    images: [
      {
        url: "https://www.jhcdotcomclub.com/2025/cyberstrike-hero.jpg",
        width: 1200,
        height: 630,
        alt: "JHC Dot Com Club Blog",
      },
    ],
  },
});

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
