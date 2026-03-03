"use client";

import { useState } from "react";
import Link from "next/link";
import { topics } from "@/lib/data";
import { BookOpen, Code2, Zap, Terminal, Github, ArrowRight, Star, ChevronRight } from "lucide-react";

const stats = [
  { label: "Topics Covered", value: "8+", icon: BookOpen },
  { label: "Code Examples", value: "40+", icon: Code2 },
  { label: "Live Compiler", value: "Built-in", icon: Terminal },
  { label: "Deploy Ready", value: "Vercel", icon: Zap },
];

export default function HomePage() {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-bg-primary grid-bg relative overflow-hidden">
      {/* Floating orbs */}
      <div className="orb w-96 h-96 bg-accent-cyan/10 top-20 -left-20" />
      <div className="orb w-80 h-80 bg-accent-purple/10 top-60 -right-20" style={{ animationDelay: "2s" }} />
      <div className="orb w-64 h-64 bg-accent-cyan/5 bottom-40 left-1/3" style={{ animationDelay: "4s" }} />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-xs font-bold text-bg-primary">
            DG
          </div>
          <span className="font-display font-bold text-lg text-text-primary tracking-tight">DevGuide</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/guide/javascript/variables" className="hidden sm:flex items-center gap-2 text-sm text-text-secondary hover:text-accent-cyan transition-colors">
            Start Learning
          </Link>
          <Link
            href="/playground"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium hover:bg-accent-cyan/20 transition-all"
          >
            <Terminal size={14} />
            Playground
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-medium mb-8 animate-fade-in">
          <Star size={12} className="fill-accent-cyan" />
          Complete Full-Stack Developer Guide
        </div>

        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl font-black text-text-primary leading-none mb-6 animate-fade-up"
          style={{ letterSpacing: "-0.03em" }}
        >
          Master{" "}
          <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-cyan bg-clip-text text-transparent bg-[length:200%] animate-border-flow">
            Modern Web
          </span>
          <br />Development
        </h1>

        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
          JavaScript · TypeScript · React · Next.js · PostgreSQL · Supabase.
          Every concept explained with <strong className="text-text-primary">What / Why / How</strong> and live code examples you can run right here.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <Link
            href="/guide/javascript/variables"
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent-cyan text-bg-primary font-bold hover:bg-accent-cyan/90 transition-all box-glow-cyan"
          >
            Start Learning
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/playground"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-bg-card border border-border-dim text-text-primary font-medium hover:border-border-bright hover:bg-bg-hover transition-all"
          >
            <Terminal size={18} />
            Open Compiler
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-20 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-4 rounded-xl bg-bg-card border border-border-dim hover:border-border-bright transition-colors">
              <Icon size={20} className="text-accent-cyan mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-text-primary">{value}</div>
              <div className="text-xs text-text-secondary mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Topics grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-3">
          Topics Covered
        </h2>
        <p className="text-text-secondary text-center mb-12">Pick any topic to start — each comes with detailed explanations and runnable examples</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topics.map((topic, i) => (
            <Link
              key={topic.id}
              href={`/guide/${topic.id}/${topic.concepts[0].id}`}
              onMouseEnter={() => setHoveredTopic(topic.id)}
              onMouseLeave={() => setHoveredTopic(null)}
              className="group relative p-5 rounded-2xl bg-bg-card border border-border-dim hover:border-border-bright transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{
                animationDelay: `${i * 0.05}s`,
                boxShadow: hoveredTopic === topic.id ? `0 0 30px ${topic.color}15` : "none",
                borderColor: hoveredTopic === topic.id ? `${topic.color}40` : "",
              }}
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at top left, ${topic.color}08, transparent 60%)` }}
              />

              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mb-4 font-mono"
                  style={{ background: `${topic.color}15`, color: topic.color, border: `1px solid ${topic.color}20` }}
                >
                  {topic.icon}
                </div>
                <h3 className="font-display font-bold text-text-primary mb-1">{topic.title}</h3>
                <p className="text-xs text-text-secondary mb-4">{topic.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-dim">{topic.concepts.length} concepts</span>
                  <ChevronRight size={14} className="text-text-dim group-hover:text-accent-cyan group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border-dim py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-xs font-bold text-bg-primary">
              DG
            </div>
            <span className="text-sm text-text-secondary">DevGuide — Built with Next.js & Vercel</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/guide/javascript/variables" className="hover:text-accent-cyan transition-colors">Guide</Link>
            <Link href="/playground" className="hover:text-accent-cyan transition-colors">Playground</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
