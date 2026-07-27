import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Refund Policy | JHC Dot Com Club",
  description: "Refund Policy for JHC Dot Com Club. Learn about our refund procedures, eligibility criteria, and process for event registrations and services.",
  keywords: ["refund policy", "money back", "JHC Dot Com Club", "refund process", "cancellation policy"],
  openGraph: {
    title: "Refund Policy | JHC Dot Com Club",
    description: "Refund Policy for JHC Dot Com Club. Learn about our refund procedures and eligibility criteria.",
    url: "https://www.jhcdotcomclub.com/refund-policy",
  },
});

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
