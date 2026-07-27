import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Contact Us - JHC Dot Com Club | Get in Touch",
  description: "Contact JHC Dot Com Club for inquiries about events, collaborations, or general information. Reach out to Jai Hind College's premier technology community.",
  keywords: [
    "Contact JHC Dot Com Club",
    "Jai Hind College contact",
    "DCC inquiries",
    "Tech club contact",
    "Event partnerships",
    "Collaboration requests",
    "Mumbai tech community contact"
  ],
  openGraph: {
    title: "Contact Us - JHC Dot Com Club",
    description: "Get in touch with us for inquiries about events, collaborations, or general information.",
    images: [
      {
        url: "https://www.jhcdotcomclub.com/images/contact-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Contact JHC Dot Com Club",
      },
    ],
  },
});

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
