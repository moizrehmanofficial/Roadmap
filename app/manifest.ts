import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "DevGuide — Full-Stack, DevOps, Cloud & Security",
    short_name: "DevGuide",
    description:
      "Free study guide: full-stack development, Linux, networking, Python, DevOps, cloud, cyber security, DevSecOps and cloud security. Works offline.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#f6f4ef",
    theme_color: "#f6f4ef",
    categories: ["education", "developer", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      { src: "/screenshots/mobile-home.png", sizes: "780x1688", type: "image/png", form_factor: "narrow", label: "Every track in one learning path" },
      { src: "/screenshots/mobile-lesson.png", sizes: "780x1688", type: "image/png", form_factor: "narrow", label: "Detailed lessons that work offline" },
      { src: "/screenshots/desktop-home.png", sizes: "1440x900", type: "image/png", form_factor: "wide", label: "DevGuide home" },
      { src: "/screenshots/desktop-lesson.png", sizes: "1440x900", type: "image/png", form_factor: "wide", label: "A lesson with code you can run" },
    ],
    shortcuts: [
      { name: "Continue learning", url: "/progress", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Playground", url: "/playground", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
