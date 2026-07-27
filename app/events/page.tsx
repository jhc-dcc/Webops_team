import { createMetadata } from "@/lib/metadata";
import ComingSoonV2 from "@/prompting";
import { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Events - JHC Dot Com Club | Tech Events & Workshops",
  description: "Discover upcoming tech events, workshops, and conferences at JHC Dot Com Club. Join Cyberstrike 2025, E-waste drives, and innovation challenges at Jai Hind College.",
  keywords: [
    "JHC events",
    "Cyberstrike 2025",
    "Tech workshops",
    "Programming contests",
    "E-waste drive",
    "Technology conferences",
    "Mumbai tech events",
    "Student competitions"
  ],
  openGraph: {
    title: "Tech Events & Workshops - JHC Dot Com Club",
    description: "Join our exciting lineup of tech events, workshops, and conferences designed to inspire and educate.",
    images: [
      {
        url: "https://www.jhcdotcomclub.com/images/events-banner.jpg",
        width: 1200,
        height: 630,
        alt: "JHC Dot Com Club Events",
      },
    ],
  },
});

const Events = () => {
  return (
    <div>
      <ComingSoonV2 />
    </div>
  );
};

export default Events;
