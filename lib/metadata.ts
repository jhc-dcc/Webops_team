import { Metadata } from "next";

export const siteConfig = {
  name: "JHC Dot Com Club",
  title: "JHC Dot Com Club - Jai Hind College Technology Community",
  description:
    "Official website of Jai Hind College Dot Com Club. Join us for Cyberstrike 2025, E-waste drives, tech events, workshops, and innovation at Mumbai's premier technology community.",
  url: "https://www.jhcdotcomclub.com",
  ogImage: "https://www.jhcdotcomclub.com/images/og-image.jpg",
  keywords: [
    "Jai Hind College",
    "Dot Com Club",
    "DCC",
    "Cyberstrike 2025",
    "E-waste drive",
    "Tech events Mumbai",
    "Technology community",
    "Programming club",
    "Innovation",
    "Workshops",
    "Conferences",
    "Student tech community",
    "Mumbai tech events",
    "College fest",
    "Technology education",
  ],
  authors: [
    {
      name: "JHC Dot Com Club",
      url: "https://www.jhcdotcomclub.com",
    },
  ],
  creator: "JHC Dot Com Club",
  publisher: "Jai Hind College",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export function createMetadata(override?: Partial<Metadata>): Metadata {
  return {
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    formatDetection: siteConfig.formatDetection,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: siteConfig.title,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: "@jhcdotcomclub",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    alternates: {
      canonical: siteConfig.url,
    },
    ...override,
  };
}
