import Link from "next/link";
import type { Metadata } from "next";
import { getPaths } from "@/lib/paths";
import { PathCards, PathChooser } from "@/components/path-cards";

export const metadata: Metadata = {
  title: "Roadmaps",
  description:
    "Step-by-step roadmaps for Full-Stack Developer, DevOps Engineer, Cloud Engineer, Cyber Security Analyst, DevSecOps Engineer and Cloud Security Engineer.",
};

export default function RoadmapsPage() {
  const paths = getPaths();
  return (
    <main className="mx-auto max-w-[1400px] px-4 pb-16 pt-10 sm:px-6 lg:pt-16">
      <p className="eyebrow">Roadmaps</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight text-ink">Choose a roadmap</h1>
      <p className="mt-4 max-w-[64ch] text-lg text-ink-2">
        {paths.length} roadmaps, each from the very first foundation to job-ready, in the right order. A roadmap picks
        the lessons a job needs from{" "}
        <Link href="/topics" className="link">
          all topics
        </Link>
        . Lessons you finish on one roadmap count on every other roadmap too.
      </p>
      <PathCards />
      <PathChooser />
    </main>
  );
}
