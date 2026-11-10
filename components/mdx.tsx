import type { ComponentProps, ReactNode } from "react";
import { AlertTriangle, Info, Lightbulb, ShieldAlert, OctagonAlert, Sparkles, HelpCircle, Target, Clock, MapPin, Wrench } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

type CalloutType = "note" | "tip" | "warning" | "danger" | "security" | "analogy";
const CALLOUT: Record<CalloutType, { label: string; Icon: typeof Info }> = {
  note: { label: "Note", Icon: Info },
  tip: { label: "Tip", Icon: Lightbulb },
  warning: { label: "Watch out", Icon: AlertTriangle },
  danger: { label: "Danger", Icon: OctagonAlert },
  security: { label: "Security lens", Icon: ShieldAlert },
  analogy: { label: "Real-life example", Icon: Sparkles },
};

export function Callout({ type = "note", title, children }: { type?: CalloutType; title?: string; children: ReactNode }) {
  const c = CALLOUT[type] ?? CALLOUT.note;
  return (
    <aside className={`callout callout-${type}`}>
      <div className="callout-head">
        <c.Icon aria-hidden size={15} />
        <span>{title ?? c.label}</span>
      </div>
      <div className="callout-body">{children}</div>
    </aside>
  );
}

export function Terms({ children }: { children: ReactNode }) {
  return <dl className="terms">{children}</dl>;
}

export function Term({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="term">
      <dt>{name}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** Interview question with a hidden answer. */
export function QA({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className="qa">
      <summary>{q}</summary>
      <div className="qa-body">{children}</div>
    </details>
  );
}

/**
 * Beginner breakdown of one concept: What / Why / When / Where / How.
 * Usage: <Explain><What>…</What><Why>…</Why>…</Explain>
 */
export function Explain({ children }: { children: ReactNode }) {
  return <div className="explain">{children}</div>;
}

function row(label: string, Icon: typeof Info, cls: string) {
  function Row({ children }: { children: ReactNode }) {
    return (
      <div className={`explain-row ${cls}`}>
        <div className="explain-label">
          <Icon aria-hidden size={14} />
          <span>{label}</span>
        </div>
        <div className="explain-body">{children}</div>
      </div>
    );
  }
  Row.displayName = label;
  return Row;
}
export const What = row("What is it?", HelpCircle, "w-what");
export const Why = row("Why do we need it?", Target, "w-why");
export const When = row("When do we use it?", Clock, "w-when");
export const Where = row("Where is it used?", MapPin, "w-where");
export const How = row("How does it work?", Wrench, "w-how");

export function Steps({ children }: { children: ReactNode }) {
  return <div className="steps">{children}</div>;
}

function A({ href = "", ...rest }: ComponentProps<"a">) {
  const external = /^https?:\/\//.test(href);
  return <a href={href} {...rest} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} />;
}

function Table(props: ComponentProps<"table">) {
  return (
    <div className="table-wrap">
      <table {...props} />
    </div>
  );
}

export const mdxComponents = {
  pre: CodeBlock,
  a: A,
  table: Table,
  Callout,
  Terms,
  Term,
  QA,
  Steps,
  Explain,
  What,
  Why,
  When,
  Where,
  How,
};
