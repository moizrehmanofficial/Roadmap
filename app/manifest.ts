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
    shortcuts: [
      { name: "Continue learning", url: "/progress", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Playground", url: "/playground", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
