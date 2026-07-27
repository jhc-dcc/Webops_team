import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Contingent Leader Registration - JHC Dot Com Club",
  description:
    "Register as a Contingent Leader for JHC Dot Com Club. Lead your college delegation to Cyberstrike 2025 and represent your institution in Mumbai's premier tech fest.",
  keywords: [
    "Contingent Leader registration",
    "CL registration",
    "Cyberstrike 2025 CL",
    "College contingent",
    "Tech fest registration",
    "Student leader registration",
    "Mumbai tech fest",
    "College delegation",
  ],
  openGraph: {
    title: "Contingent Leader Registration - JHC DCC",
    description:
      "Register as a Contingent Leader and lead your college to Cyberstrike 2025. Join us on 12th November!",
    images: [
      {
        url: "https://www.jhcdotcomclub.com/images/cl-registration.jpg",
        width: 1200,
        height: 630,
        alt: "Contingent Leader Registration",
      },
    ],
  },
});

export default function CLLayout({ children }: { children: React.ReactNode }) {
  return children;
}