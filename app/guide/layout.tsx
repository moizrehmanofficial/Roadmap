"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { topics } from "@/lib/data";
import { Terminal, Home, ChevronDown, ChevronRight, Menu, X, BookOpen } from "lucide-react";

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Auto-expand active topic
  useEffect(() => {
    const parts = pathname.split("/");
    const topicId = parts[2];
    if (topicId && !expandedTopics.includes(topicId)) {
      setExpandedTopics(prev => [...prev, topicId]);
    }
  }, [pathname]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev =>
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  const isActiveLink = (topicId: string, conceptId: string) =>
    pathname === `/guide/${topicId}/${conceptId}`;

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-border-dim flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-xs font-bold text-bg-primary">
            DG
          </div>
          <span className="font-display font-bold text-text-primary">DevGuide</span>
        </Link>
        <button onClick={() => setMobileNavOpen(false)} className="lg:hidden text-text-secondary">
          <X size={18} />
        </button>
      </div>

      {/* Quick links */}
      <div className="px-3 py-3 border-b border-border-dim">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
        >
          <Home size={14} />
          Home
        </Link>
        <Link
          href="/playground"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-accent-cyan hover:bg-accent-cyan/10 transition-colors mt-1"
        >
          <Terminal size={14} />
          Code Playground
        </Link>
      </div>

      {/* Topics navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        {topics.map(topic => {
          const isExpanded = expandedTopics.includes(topic.id);
          const isTopicActive = pathname.includes(`/guide/${topic.id}`);

          return (
            <div key={topic.id} className="mb-1">
              <button
                onClick={() => toggleTopic(topic.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isTopicActive
                    ? "bg-bg-hover text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                }`}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono"
                  style={{
                    background: `${topic.color}15`,
                    color: topic.color,
                    border: `1px solid ${topic.color}25`,
                  }}
                >
                  {topic.icon}
                </span>
                <span className="flex-1 text-left">{topic.title}</span>
                {isExpanded ? (
                  <ChevronDown size={14} className="text-text-dim" />
                ) : (
                  <ChevronRight size={14} className="text-text-dim" />
                )}
              </button>

              {isExpanded && (
                <div className="ml-4 mt-1 pl-3 border-l border-border-dim space-y-0.5">
                  {topic.concepts.map(concept => (
                    <Link
                      key={concept.id}
                      href={`/guide/${topic.id}/${concept.id}`}
                      onClick={() => setMobileNavOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-xs transition-all ${
                        isActiveLink(topic.id, concept.id)
                          ? "sidebar-active font-medium"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                      }`}
                    >
                      {concept.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom hint */}
      <div className="px-4 py-3 border-t border-border-dim">
        <p className="text-xs text-text-dim text-center">Deploy this to Vercel for free ✨</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-bg-secondary border-r border-border-dim fixed left-0 top-0 bottom-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-bg-secondary border-r border-border-dim">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 xl:ml-72 min-h-screen flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-bg-secondary/90 backdrop-blur-md border-b border-border-dim">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 rounded-lg bg-bg-hover text-text-secondary hover:text-text-primary"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-xs font-bold text-bg-primary">DG</div>
            <span className="font-display font-semibold text-text-primary">DevGuide</span>
          </div>
          <Link href="/playground" className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-cyan/10 text-accent-cyan text-xs font-medium border border-accent-cyan/20">
            <Terminal size={12} />
            Run Code
          </Link>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
