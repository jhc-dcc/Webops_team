import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Magazines - JHC Dot Com Club | Tech Publications & Articles",
  description: "Explore JHC Dot Com Club's magazines, publications, and tech articles. Stay updated with the latest technology trends, insights, and innovations from our community.",
  keywords: [
    "JHC magazines",
    "Tech publications",
    "Technology articles",
    "Student publications",
    "Tech insights",
    "Innovation articles",
    "Programming tutorials",
    "Technology trends"
  ],
  openGraph: {
    title: "Magazines - Tech Publications & Articles",
    description: "Explore our magazines, publications, and tech articles covering the latest technology trends and innovations.",
  },
});

export default function MagazinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}