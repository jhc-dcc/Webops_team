import localFont from "next/font/local";

export const satoshi = localFont({
  src: [
    {
      path: "./Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

export const circular = localFont({
  src: [
    {
      path: "./circularweb-book.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-circular",
});

export const zentry = localFont({
  src: [
    {
      path: "./zentry-regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-zentry",
});

import { Dancing_Script } from "next/font/google";

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
});


