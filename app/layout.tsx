import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloomverse — A Living Digital Civilization",
  description: "Explore Bloomverse, an interactive 3D world where every citizen leaves a permanent legacy. Create your identity, build dreams, discover secrets, and shape civilization.",
  keywords: ["Bloomverse", "3D world", "digital civilization", "interactive", "game", "legacy", "dreams", "citizens"],
  authors: [{ name: "MKR Infinity" }],
  openGraph: {
    title: "Bloomverse — A Living Digital Civilization",
    description: "Every citizen leaves a permanent legacy. Explore, create, discover, and shape the world forever.",
    url: "https://github.com/mkr-infinity/bloomverse",
    siteName: "Bloomverse",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Bloomverse — A Living Digital Civilization"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloomverse — A Living Digital Civilization",
    description: "Every citizen leaves a permanent legacy. Explore, create, discover, and shape the world forever.",
    images: ["/og-image.svg"]
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  },
  manifest: "/manifest.json",
  themeColor: "#151d2e",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="theme-color" content="#151d2e" />
      </head>
      <body>{children}</body>
    </html>
  );
}
