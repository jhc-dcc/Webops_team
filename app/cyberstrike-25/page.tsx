import { IntroSection } from "@/components/cyberstrike/IntroSection";
import { ThemeRevealSection } from "@/components/cyberstrike/ThemeRevealSection";
import { VideoRevealSection } from "@/components/cyberstrike/VideoRevealSection";
import { CountdownSection } from "@/components/cyberstrike/CountdownSection";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Cyberstrike 25 — Theme Reveal",
  description:
    "Experience the Cyberstrike 25 theme reveal. Discover ERROR 404, explore the teaser and prepare for the December 10 showdown.",
  openGraph: {
    title: "Cyberstrike 25 — Theme Reveal",
    description:
      "Cyberstrike returns with a 3D glitch reveal of ERROR 404. Watch the teaser and sync to the countdown for December 10.",
    url: "https://www.jhcdotcomclub.com/cyberstrike-25",
  },
  twitter: {
    title: "Cyberstrike 25 — Theme Reveal",
    description:
      "Unlock the ERROR 404 theme with our glitch reveal, teaser and countdown to the arena on December 10.",
  },
});

const Cyberstrike25 = () => (
  <div className="relative min-h-screen w-full bg-black text-white">
    <IntroSection />
    <ThemeRevealSection />
    <VideoRevealSection />
    <CountdownSection />
  </div>
);

export default Cyberstrike25;