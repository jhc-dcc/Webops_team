import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Past Events - JHC Dot Com Club | Event Gallery & Highlights",
  description: "Explore JHC Dot Com Club's past events including previous Cyberstrike editions, E-waste drives, workshops, and tech conferences. See our event highlights and achievements.",
  keywords: [
    "JHC past events",
    "Cyberstrike history",
    "Event gallery",
    "Tech event highlights",
    "Previous workshops",
    "Event achievements",
    "Technology conferences",
    "Student event success"
  ],
  openGraph: {
    title: "Past Events - Event Gallery & Highlights",
    description: "Explore our successful past events, workshops, and tech conferences with highlights and achievements.",
    images: [
      {
        url: "https://www.jhcdotcomclub.com/images/past-events-banner.jpg",
        width: 1200,
        height: 630,
        alt: "JHC Dot Com Club Past Events",
      },
    ],
  },
});

export default function PastEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
