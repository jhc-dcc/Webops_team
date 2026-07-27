import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Terms and Conditions | JHC Dot Com Club",
  description: "Terms and Conditions for JHC Dot Com Club. Read our legal terms, user agreements, and conditions for using our platform and services.",
  keywords: ["terms and conditions", "user agreement", "JHC Dot Com Club", "legal terms", "terms of service"],
  openGraph: {
    title: "Terms and Conditions | JHC Dot Com Club",
    description: "Terms and Conditions for JHC Dot Com Club. Read our legal terms and user agreements.",
    url: "https://www.jhcdotcomclub.com/terms-and-conditions",
  },
});

export default function TermsAndConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
