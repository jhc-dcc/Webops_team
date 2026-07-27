import { PollProvider } from "@/components/poll-provider";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Footer } from "@/components/ui/footer";
import { Toaster } from "@/components/ui/sonner";
import { satoshi, dancingScript } from "@/fonts/font";
import { createMetadata } from "@/lib/metadata";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/structured-data";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { ConvexClientProvider } from "../components/convex-client-provider";
import "./globals.css";

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className={`${satoshi.className} ${dancingScript.variable} overflow-x-hidden`} suppressHydrationWarning>
        <ConvexClientProvider>
          <PollProvider>
            <Analytics />
            <FloatingNav />
            <main className="min-h-screen overflow-x-hidden">{children}</main>
            <Footer />
            <Toaster />
          </PollProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
