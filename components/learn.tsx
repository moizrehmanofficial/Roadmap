import type { ReactNode } from "react";
import { ChevronRight, CircleCheck, CircleX, Layers, Lightbulb, Puzzle, Eye, ListChecks, ArrowRight } from "lucide-react";

/*
 * Building blocks for "easy to follow" lessons.
 * Every component takes plain children, so lessons stay readable MDX
 * (next-mdx-remote blocks JS expressions in props, so no arrays/objects as props).
 */

/** 2×2 cards at the top of a lesson: <Glance><What>…</What><Why>…</Why><When>…</When><How>…</How></Glance> */
export function Glance({ children }: { children: ReactNode }) {
  return <div className="glance">{children}</div>;
}

/** The one sentence to remember. */
export function BigIdea({ children }: { children: ReactNode }) {
  return (
    <div className="big-idea">
      <Lightbulb aria-hidden size={20} />
      <div>{children}</div>
    </div>
  );
}

/** A numbered walkthrough. Each <Step title="…"> is one small idea. */
export function Walkthrough({ children }: { children: ReactNode }) {
  return <ol className="walk">{children}</ol>;
}

export function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="walk-step">
      <div className="walk-title">{title}</div>
      <div className="walk-body">{children}</div>
    </li>
  );
}

/** "What happened?" box under an example. */
export function Happened({ title = "What happened?", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="happened">
      <div className="happened-head">
        <Eye aria-hidden size={14} />
        <span>{title}</span>
      </div>
      <div className="happened-body">{children}</div>
    </div>
  );
}

/** Side-by-side wrong / right cards. */
export function Compare({ children }: { children: ReactNode }) {
  return <div className="compare">{children}</div>;
}

export function Bad({ title = "Avoid", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="cmp cmp-bad">
      <div className="cmp-head">
        <CircleX aria-hidden size={15} />
        <span>{title}</span>
      </div>
      <div className="cmp-body">{children}</div>
    </div>
  );
}

export function Good({ title = "Do this", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="cmp cmp-good">
      <div className="cmp-head">
        <CircleCheck aria-hidden size={15} />
        <span>{title}</span>
      </div>
      <div className="cmp-body">{children}</div>
    </div>
  );
}

/** A practice task with optional hint and solution, both hidden until opened. */
export function Challenge({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="challenge">
      <div className="challenge-head">
        <Puzzle aria-hidden size={16} />
        <span>Try it yourself</span>
      </div>
      <div className="challenge-title">{title}</div>
      <div className="challenge-body">{children}</div>
    </div>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <details className="reveal reveal-hint">
      <summary>
        <ChevronRight aria-hidden size={15} className="reveal-chev" />
        Show a hint
      </summary>
      <div className="reveal-body">{children}</div>
    </details>
  );
}

export function Solution({ children }: { children: ReactNode }) {
  return (
    <details className="reveal reveal-solution">
      <summary>
        <ChevronRight aria-hidden size={15} className="reveal-chev" />
        Show the solution
      </summary>
      <div className="reveal-body">{children}</div>
    </details>
  );
}

/** Extra depth for curious readers: closed by default, so beginners aren't overwhelmed. */
export function DeepDive({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="deep">
      <summary>
        <Layers aria-hidden size={16} />
        <span className="deep-title">{title}</span>
        <span className="deep-tag">Go deeper</span>
        <ChevronRight aria-hidden size={16} className="reveal-chev" />
      </summary>
      <div className="deep-body">{children}</div>
    </details>
  );
}

/** "Remember this" checklist. Put a normal markdown list inside. */
export function Takeaways({ title = "Key points", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="takeaways">
      <div className="takeaways-head">
        <ListChecks aria-hidden size={16} />
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

/** Inline word with a simple definition on hover / focus: <Def tip="…">scope</Def> */
export function Def({ tip, children }: { tip: string; children: ReactNode }) {
  return (
    <span className="def" tabIndex={0}>
      {children}
      <span className="def-tip" role="tooltip">
        {tip}
      </span>
    </span>
  );
}

/* ─── Simple diagrams ─────────────────────────────────────────────────── */

/** Labelled boxes: <Boxes><Box name="total">430</Box>…</Boxes> */
export function Boxes({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="boxes">
      <div className="boxes-row">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function Box({ name, note, children }: { name: string; note?: string; children: ReactNode }) {
  return (
    <div className="box">
      <div className="box-name">{name}</div>
      <div className="box-value">{children}</div>
      {note && <div className="box-note">{note}</div>}
    </div>
  );
}

/** A left-to-right flow: <Flow><FlowStep>Write code</FlowStep><FlowStep>Run</FlowStep></Flow> */
export function Flow({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="flow">
      <div className="flow-row">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function FlowStep({ children }: { children: ReactNode }) {
  return (
    <div className="flow-step">
      <div className="flow-card">{children}</div>
      <ArrowRight aria-hidden size={18} className="flow-arrow" />
    </div>
  );
}
