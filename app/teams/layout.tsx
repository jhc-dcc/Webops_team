import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Teams - JHC Dot Com Club | Meet Our Elite Squad",
  description: "Meet the talented team behind JHC Dot Com Club's innovation and success. Discover our core team, coordinators, and contributors at Jai Hind College's technology community.",
  keywords: [
    "JHC Dot Com Club team",
    "DCC core team",
    "Student leaders",
    "Tech club coordinators",
    "Jai Hind College students",
    "Technology enthusiasts",
    "Innovation team",
    "Programming team"
  ],
  openGraph: {
    title: "Teams - Meet Our Elite Squad",
    description: "Discover the talented team behind DCC's innovation and success at Jai Hind College.",
    images: [
      {
        url: "https://www.jhcdotcomclub.com/images/team-banner.jpg",
        width: 1200,
        height: 630,
        alt: "JHC Dot Com Club Team",
      },
    ],
  },
});

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
