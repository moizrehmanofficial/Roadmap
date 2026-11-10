"use client";

import { Children, cloneElement, createContext, isValidElement, useContext, useId, useLayoutEffect, useState, type ReactElement, type ReactNode } from "react";
import { CircleCheck, CircleX, RotateCcw, Trophy } from "lucide-react";

/*
 * <Quiz>
 *   <Question q="Which keyword…?">
 *     <Option>var</Option>
 *     <Option correct>const</Option>
 *     <Explanation>Because…</Explanation>
 *   </Question>
 * </Quiz>
 */

type QuizCtx = { report: (id: number, ok: boolean) => void; results: Record<number, boolean>; total: number; reset: () => void; round: number };
const QuizContext = createContext<QuizCtx | null>(null);

export function Quiz({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [round, setRound] = useState(0);
  const questions = Children.toArray(children).filter(isValidElement);
  const total = questions.length;
  const answered = Object.keys(results).length;
  const score = Object.values(results).filter(Boolean).length;
  const ctx: QuizCtx = {
    report: (id, ok) => setResults((r) => (id in r ? r : { ...r, [id]: ok })),
    results,
    total,
    reset: () => {
      setResults({});
      setRound((n) => n + 1);
    },
    round,
  };
  return (
    <QuizContext.Provider value={ctx}>
      <div className="quiz">
        <div className="quiz-head">
          <span className="quiz-label">{total} questions</span>
          <span className="quiz-score num">
            {answered} / {total} answered · {score} correct
          </span>
        </div>
        {questions.map((q, i) => cloneElement(q as ReactElement<{ index?: number }>, { index: i, key: `${round}-${i}` }))}
        {answered === total && total > 0 && (
          <div className="quiz-done pop-in">
            <Trophy aria-hidden size={18} />
            <span>
              {score === total ? "Perfect score! You've got this." : `You got ${score} of ${total}. Read the explanations, then try again.`}
            </span>
            <button type="button" className="quiz-retry" onClick={ctx.reset}>
              <RotateCcw aria-hidden size={14} /> Try again
            </button>
          </div>
        )}
      </div>
    </QuizContext.Provider>
  );
}

type QCtx = {
  picked: { id: string; ok: boolean } | null;
  pick: (id: string, ok: boolean) => void;
  register: (id: string) => void;
  indexOf: (id: string) => number;
};
const QuestionContext = createContext<QCtx | null>(null);

// Options register themselves (in render order), so this works however MDX wraps them.
export function Question({ q, index = 0, children }: { q: string; index?: number; children: ReactNode }) {
  const quiz = useContext(QuizContext);
  const [picked, setPicked] = useState<{ id: string; ok: boolean } | null>(null);
  const [ids, setIds] = useState<string[]>([]);
  const ctx: QCtx = {
    picked,
    pick: (id, ok) => {
      if (picked) return;
      setPicked({ id, ok });
      quiz?.report(index, ok);
    },
    register: (id) => setIds((list) => (list.includes(id) ? list : [...list, id])),
    indexOf: (id) => ids.indexOf(id),
  };
  return (
    <QuestionContext.Provider value={ctx}>
      <fieldset className="quiz-q">
        <legend>
          <span className="quiz-num num">{index + 1}</span>
          {q}
        </legend>
        <div className="quiz-options">{children}</div>
      </fieldset>
    </QuestionContext.Provider>
  );
}

export function Option({ correct = false, children }: { correct?: boolean; children: ReactNode }) {
  const q = useContext(QuestionContext);
  const id = useId();
  const register = q?.register;
  useLayoutEffect(() => register?.(id), [register, id]);
  const i = Math.max(0, q?.indexOf(id) ?? 0);
  const picked = q?.picked ?? null;
  const done = picked !== null;
  const mine = picked?.id === id;
  const state = !done ? "" : correct ? "is-correct" : mine ? "is-wrong" : "is-dim";
  return (
    <button type="button" className={`quiz-opt ${state}`} disabled={done} onClick={() => q?.pick(id, correct)} aria-pressed={mine}>
      <span className="quiz-letter">{String.fromCharCode(65 + i)}</span>
      <span className="quiz-text">{children}</span>
      {done && correct && <CircleCheck aria-label="Correct answer" size={17} className="quiz-icon" />}
      {done && !correct && mine && <CircleX aria-label="Your answer" size={17} className="quiz-icon" />}
    </button>
  );
}

export function Explanation({ children }: { children: ReactNode }) {
  const q = useContext(QuestionContext);
  if (!q?.picked) return null;
  return (
    <div className={`quiz-feedback pop-in ${q.picked.ok ? "ok" : "bad"}`} role="status">
      <strong>{q.picked.ok ? "Correct!" : "Not quite."}</strong> {children}
    </div>
  );
}
