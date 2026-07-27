import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "About Us - JHC Dot Com Club | Jai Hind College Technology Community",
  description: "Learn about JHC Dot Com Club - Jai Hind College's premier technology community. Discover our mission, vision, team, and commitment to innovation and technology education.",
  keywords: [
    "About JHC Dot Com Club",
    "Jai Hind College technology",
    "DCC team",
    "Technology education",
    "Innovation community",
    "Student tech club",
    "Mumbai college tech",
    "Programming community"
  ],
  openGraph: {
    title: "About Us - JHC Dot Com Club",
    description: "Learn about our mission to explore the frontiers of technology and innovation at Jai Hind College.",
    images: [
      {
        url: "https://www.jhcdotcomclub.com/images/about-us-banner.jpg",
        width: 1200,
        height: 630,
        alt: "JHC Dot Com Club Team",
      },
    ],
  },
});

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
