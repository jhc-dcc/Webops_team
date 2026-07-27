import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Sponsors - JHC Dot Com Club | Our Partners & Supporters",
  description: "Discover our valued sponsors and partners who support JHC Dot Com Club's events and initiatives. Learn about partnership opportunities with Jai Hind College's tech community.",
  keywords: [
    "JHC sponsors",
    "Tech event sponsors",
    "Partnership opportunities",
    "Corporate sponsors",
    "Event partnerships",
    "Technology sponsors",
    "Mumbai tech partnerships",
    "Student event sponsors"
  ],
  openGraph: {
    title: "Sponsors - Our Partners & Supporters",
    description: "Meet our valued sponsors and partners who support our events and initiatives.",
    images: [
      {
        url: "https://www.jhcdotcomclub.com/images/sponsors-banner.jpg",
        width: 1200,
        height: 630,
        alt: "JHC Dot Com Club Sponsors",
      },
    ],
  },
});

export default function SponsorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
