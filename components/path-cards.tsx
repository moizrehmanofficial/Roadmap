import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPaths } from "@/lib/paths";
import { ProgressBar } from "@/components/progress";

const CHOOSER: [string, string][] = [
  ["build websites and web apps", "full-stack-developer"],
  ["automate servers, deployments and pipelines", "devops-engineer"],
  ["design and run infrastructure on AWS, Azure or GCP", "cloud-engineer"],
  ["defend against attacks, or test systems like a hacker", "cyber-security-analyst"],
  ["put security into CI/CD, containers and Kubernetes", "devsecops-engineer"],
  ["secure cloud accounts, identities and data", "cloud-security-engineer"],
];

/** Grid of roadmap (career path) cards. */
export function PathCards() {
  const paths = getPaths();
  return (
    <>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paths.map((p, i) => {
              const ids = p.stages.flatMap((st) => st.lessons.map((l) => l.id));
              return (
                <Link
                  key={p.slug}
                  href={p.href}
                  className="reveal group row-hover btn flex flex-col rounded-lg border border-rule bg-surface p-6 transition-[border-color,box-shadow] hover:border-rule-strong hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="num-serif text-2xl text-muted transition-colors group-hover:text-accent">{i + 1}</span>
                    <span className="size-2.5 rounded-full" style={{ background: p.mark }} aria-hidden />
                  </div>
                  <h3 className="mt-4 flex items-center gap-2 font-serif text-2xl font-semibold text-ink">
                    {p.title}
                    <ArrowRight aria-hidden size={18} className="nudge text-muted group-hover:text-accent" />
                  </h3>
                  <p className="mt-2 flex-1 text-ink-2">{p.tagline}</p>
                  <div className="mt-6 space-y-2">
                    <div className="num flex justify-between text-xs text-muted">
                      <span>
                        {p.stages.length} stages · {p.lessonCount} lessons
                      </span>
                      <span>{p.publishedCount} written</span>
                    </div>
                    <ProgressBar ids={ids} label={`${p.title} progress`} />
                  </div>
                </Link>
              );
            })}
          </div>

    </>
  );
}

/** "Not sure which one?" chooser. */
export function PathChooser() {
  const bySlug = Object.fromEntries(getPaths().map((p) => [p.slug, p]));
  return (
    <>
          
          <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-ink">Not sure which one?</h2>
              <p className="mt-3 max-w-[48ch] text-ink-2">
                Start with what you want to do every day. You can switch later — your finished lessons come with you.
              </p>
            </div>
            <ul className="divide-y divide-rule border-y border-rule">
              {CHOOSER.map(([want, slug]) => (
                <li key={slug}>
                  <Link href={`/paths/${slug}`} className="group row-hover flex items-center gap-4 py-3.5">
                    <span className="flex-1 text-ink-2">
                      I want to <span className="text-ink">{want}</span>
                    </span>
                    <span className="nudge flex items-center gap-1.5 text-sm font-medium text-ink group-hover:text-accent">
                      {bySlug[slug].title} <ArrowRight aria-hidden size={14} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
    </>
  );
}
