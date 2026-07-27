import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "E-waste Drive 2025 | JHC Dot Com Club",
  description: "Join JHC Dot Com Club's E-waste Drive 2025. Track the impact of our collective effort towards sustainability. View leaderboards and submit your e-waste contribution.",
  keywords: ["e-waste drive", "sustainability", "environmental initiative", "JHC Dot Com Club", "electronic waste", "recycling", "green initiative"],
  openGraph: {
    title: "E-waste Drive 2025 | JHC Dot Com Club",
    description: "Join our movement towards sustainability. Track the impact and view leaderboards for our E-waste Drive 2025.",
    url: "https://www.jhcdotcomclub.com/ewaste",
  },
});

export default function EwasteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
