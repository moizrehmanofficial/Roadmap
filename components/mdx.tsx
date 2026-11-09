import type { ComponentProps, ReactNode } from "react";
import { AlertTriangle, Info, Lightbulb, ShieldAlert, OctagonAlert } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

type CalloutType = "note" | "tip" | "warning" | "danger" | "security";
const CALLOUT: Record<CalloutType, { label: string; Icon: typeof Info }> = {
  note: { label: "Note", Icon: Info },
  tip: { label: "Tip", Icon: Lightbulb },
  warning: { label: "Watch out", Icon: AlertTriangle },
  danger: { label: "Danger", Icon: OctagonAlert },
  security: { label: "Security lens", Icon: ShieldAlert },
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
};
