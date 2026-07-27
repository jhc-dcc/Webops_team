import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Register - JHC Dot Com Club | Join Our Tech Community",
  description: "Register for JHC Dot Com Club events including Cyberstrike 2025, workshops, and tech competitions. Join Jai Hind College's premier technology community today!",
  keywords: [
    "JHC registration",
    "Cyberstrike 2025 registration",
    "Tech event registration",
    "Join DCC",
    "Student registration",
    "Technology club membership",
    "Mumbai tech events registration",
    "Programming contest registration"
  ],
  openGraph: {
    title: "Register - Join JHC Dot Com Club",
    description: "Register for exciting tech events, workshops, and competitions. Be part of our innovation journey!",
    images: [
      {
        url: "https://www.jhcdotcomclub.com/images/register-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Register for JHC Dot Com Club",
      },
    ],
  },
});

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
