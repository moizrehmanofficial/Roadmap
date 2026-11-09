import type { Metadata } from "next";
import { Suspense } from "react";
import { Playground } from "@/components/playground";

export const metadata: Metadata = {
  title: "Playground",
  description: "Run JavaScript and TypeScript in your browser — on desktop or phone.",
};

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div className="h-[calc(100dvh-4rem)]" />}>
      <Playground />
    </Suspense>
  );
}
