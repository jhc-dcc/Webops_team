import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy | JHC Dot Com Club",
  description: "Privacy Policy for JHC Dot Com Club. Learn how we collect, use, and protect your personal information. Your privacy is important to us.",
  keywords: ["privacy policy", "data protection", "JHC Dot Com Club", "personal information", "privacy rights"],
  openGraph: {
    title: "Privacy Policy | JHC Dot Com Club",
    description: "Privacy Policy for JHC Dot Com Club. Learn how we collect, use, and protect your personal information.",
    url: "https://www.jhcdotcomclub.com/privacy-policy",
  },
});

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
