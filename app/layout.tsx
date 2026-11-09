import type { Metadata, Viewport } from "next";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource-variable/newsreader";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { themeScript } from "@/components/theme-toggle";
import { PwaRegister } from "@/components/pwa";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "DevGuide — Full-Stack, DevOps, Cloud & Security", template: "%s · DevGuide" },
  description:
    "A complete, free study guide: full-stack development, Linux, networking, Python, DevOps, cloud, cyber security, DevSecOps and cloud security — every topic explained with what, why, when, where and how.",
  openGraph: { type: "website", siteName: "DevGuide" },
  applicationName: "DevGuide",
  appleWebApp: { capable: true, title: "DevGuide", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#141311" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="main">{children}</div>
        <SiteFooter />
        <PwaRegister />
      </body>
    </html>
  );
}
