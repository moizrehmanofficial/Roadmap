"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { topics } from "@/lib/data";
import { Terminal, Home, ChevronDown, ChevronRight, Menu, X } from "lucide-react";

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auto-expand active topic
  useEffect(() => {
    const topicId = pathname.split("/")[2];
    if (topicId) setExpanded(prev => prev.includes(topicId) ? prev : [...prev, topicId]);
  }, [pathname]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const toggleTopic = useCallback((id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const isActive = (topicId: string, conceptId: string) =>
    pathname === `/guide/${topicId}/${conceptId}`;

  const SidebarNav = () => (
    <nav style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand row */}
      <div style={{ padding: "18px 16px", borderBottom: "1px solid #1a2234", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#00d4ff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#080b14", flexShrink: 0 }}>DG</div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "#f1f5f9", fontSize: 15 }}>DevGuide</span>
        </Link>
        <button
          onClick={() => setDrawerOpen(false)}
          style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4, display: "flex" }}
          className="lg:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Quick nav */}
      <div style={{ padding: "10px 10px", borderBottom: "1px solid #1a2234", flexShrink: 0 }}>
        {[
          { href: "/", icon: <Home size={14} />, label: "Home", color: "#94a3b8" },
          { href: "/playground", icon: <Terminal size={14} />, label: "Code Playground", color: "#00d4ff" },
        ].map(item => (
          <Link key={item.href} href={item.href}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 12px", borderRadius: 10, marginBottom: 2,
              color: item.color, fontSize: 13, fontWeight: 500, textDecoration: "none",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#161b27")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            {item.icon}{item.label}
          </Link>
        ))}
      </div>

      {/* Topics list — scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
        {topics.map(topic => {
          const isExpanded = expanded.includes(topic.id);
          const isTopicActive = pathname.includes(`/guide/${topic.id}`);

          return (
            <div key={topic.id} style={{ marginBottom: 2 }}>
              <button
                onClick={() => toggleTopic(topic.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: isTopicActive ? "#161b27" : "transparent",
                  color: isTopicActive ? "#f1f5f9" : "#94a3b8",
                  fontSize: 13, fontWeight: 500, textAlign: "left",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!isTopicActive) (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                onMouseLeave={e => { if (!isTopicActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, fontFamily: "monospace",
                  background: topic.color + "15", color: topic.color, border: `1px solid ${topic.color}25`,
                }}>{topic.icon}</span>
                <span style={{ flex: 1 }}>{topic.title}</span>
                {isExpanded
                  ? <ChevronDown size={13} style={{ color: "#374151", flexShrink: 0 }} />
                  : <ChevronRight size={13} style={{ color: "#374151", flexShrink: 0 }} />}
              </button>

              {isExpanded && (
                <div style={{ marginLeft: 16, paddingLeft: 12, borderLeft: "1px solid #1a2234", marginTop: 2, marginBottom: 4 }}>
                  {topic.concepts.map(concept => {
                    const active = isActive(topic.id, concept.id);
                    return (
                      <Link
                        key={concept.id}
                        href={`/guide/${topic.id}/${concept.id}`}
                        style={{
                          display: "block", padding: "8px 12px", borderRadius: 8,
                          marginBottom: 1, fontSize: 12, textDecoration: "none",
                          fontWeight: active ? 600 : 400,
                          color: active ? "#00d4ff" : "#64748b",
                          background: active ? "rgba(0,212,255,0.08)" : "transparent",
                          borderLeft: active ? "2px solid #00d4ff" : "2px solid transparent",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
                      >
                        {concept.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid #1a2234", flexShrink: 0 }}>
        <p style={{ fontSize: 11, color: "#374151", textAlign: "center" }}>Deploy free on Vercel ✨</p>
      </div>
    </nav>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080b14", display: "flex" }}>

      {/* ── Desktop sidebar (≥1024px) ── */}
      <aside
        className="hidden lg:flex"
        style={{
          width: 260, flexShrink: 0,
          background: "#0d1117",
          borderRight: "1px solid #1a2234",
          position: "fixed", left: 0, top: 0, bottom: 0,
          zIndex: 20, flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <SidebarNav />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}
          className="lg:hidden"
        >
          {/* Sidebar panel */}
          <div style={{ width: "min(280px, 85vw)", background: "#0d1117", borderRight: "1px solid #1a2234", overflowY: "auto", height: "100%" }}>
            <SidebarNav />
          </div>
          {/* Backdrop */}
          <div
            style={{ flex: 1, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setDrawerOpen(false)}
          />
        </div>
      )}

      {/* ── Main content ── */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", minWidth: 0 }}
        className="lg:ml-[260px]"
      >
        {/* Mobile top bar */}
        <header
          className="lg:hidden"
          style={{
            position: "sticky", top: 0, zIndex: 10,
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px",
            background: "rgba(13,17,23,0.95)", backdropFilter: "blur(16px)",
            borderBottom: "1px solid #1a2234",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            style={{ padding: 8, borderRadius: 8, background: "#161b27", border: "1px solid #1f2937", color: "#94a3b8", cursor: "pointer", display: "flex" }}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>

          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#00d4ff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#080b14" }}>DG</div>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "#f1f5f9", fontSize: 14 }}>DevGuide</span>
          </Link>

          <Link href="/playground"
            style={{
              marginLeft: "auto",
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 12px", borderRadius: 8,
              background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
              color: "#00d4ff", fontSize: 12, fontWeight: 600, textDecoration: "none",
            }}>
            <Terminal size={12} />
            Run Code
          </Link>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
