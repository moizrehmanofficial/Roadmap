import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevGuide — Full-Stack Developer Study Guide",
  description: "Complete guide to JavaScript, TypeScript, React, Next.js, PostgreSQL, Supabase & more. With interactive code compiler.",
  keywords: ["javascript", "typescript", "react", "nextjs", "fullstack", "developer", "guide"],
  openGraph: {
    title: "DevGuide — Full-Stack Developer Study Guide",
    description: "Master modern web development with interactive lessons and live code compiler",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
