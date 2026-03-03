import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl font-display font-black text-border-bright mb-4">404</div>
        <h1 className="text-2xl font-display font-bold text-text-primary mb-3">Page Not Found</h1>
        <p className="text-text-secondary mb-8">This concept might not exist yet — or you took a wrong turn.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-medium hover:bg-accent-cyan/20 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
