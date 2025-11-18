"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Sparkles } from "lucide-react";

type Props = {
  position: string;
  company: string;
};

type Decision = "yes" | "no" | "ask";

export function QuestionCard({ position, company }: Props) {
  const [decision, setDecision] = useState<Decision>("yes");
  const [copied, setCopied] = useState(false);

  const emailTemplate = useMemo(
    () => `Hi Compliance Team,

I'd like to purchase APPLE stock for my personal account.

Role: ${position}
Company: ${company}

Based on our internal policy, I need clarification before proceeding.

Thanks!`,
    [company, position],
  );

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-lg backdrop-blur md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          Ask a compliance question
        </div>
        <DecisionSwitcher decision={decision} onChange={setDecision} />
      </div>
      <p className="mt-3 text-sm text-slate-600 md:text-base">
        We&apos;ll wire this up soon. Use the switcher to preview the UI states we
        show when the backend replies.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <input
          type="text"
          placeholder="Can I buy APPLE stock?"
          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:-translate-y-0.5 focus:border-emerald-400 focus:shadow-md"
        />
        <button className="inline-flex h-12 items-center justify-center rounded-xl border border-emerald-500 bg-emerald-500 px-5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 active:translate-y-0">
          Send
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
          Privacy-safe
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
          Draft UI
        </span>
      </div>

      <ResponsePreview
        decision={decision}
        company={company}
        emailTemplate={emailTemplate}
        copied={copied}
        onCopy={setCopied}
      />
    </section>
  );
}

type DecisionSwitcherProps = {
  decision: Decision;
  onChange: (decision: Decision) => void;
};

function DecisionSwitcher({ decision, onChange }: DecisionSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-600 shadow-sm">
      {(["yes", "no", "ask"] as const).map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-full px-3 py-1.5 capitalize transition ${
            decision === option
              ? "bg-emerald-100 text-emerald-700 shadow"
              : "hover:bg-white"
          }`}
        >
          {option === "ask" ? "Ask human" : option}
        </button>
      ))}
    </div>
  );
}

type ResponsePreviewProps = {
  decision: Decision;
  company: string;
  emailTemplate: string;
  copied: boolean;
  onCopy: (copied: boolean) => void;
};

function ResponsePreview({
  decision,
  company,
  emailTemplate,
  copied,
  onCopy,
}: ResponsePreviewProps) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-inner md:px-5">
      {decision === "yes" && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-emerald-700">
            ✅ Yes — you can proceed.
          </p>
          <p className="text-sm text-slate-600">
            No conflicts detected. Remember to log the trade in the pre-clearance
            tool once API wiring is live.
          </p>
        </div>
      )}

      {decision === "no" && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-rose-700">
            🚫 No — purchase is blocked.
          </p>
          <p className="text-sm text-slate-600">
            APPLE is currently on the restricted list for {company} FinAdvisors.
            If this changes, we&apos;ll show an approval path here.
          </p>
        </div>
      )}

      {decision === "ask" && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-amber-700">
            🤔 Need human review — send the pre-filled request.
          </p>
          <textarea
            readOnly
            value={emailTemplate}
            className="h-36 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-sm outline-none focus:border-emerald-400 focus:shadow-md"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Copy and paste into your preferred email client.
            </p>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(emailTemplate);
                  onCopy(true);
                } catch {
                  onCopy(false);
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500 bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 active:translate-y-0"
            >
              <Mail className="h-4 w-4" />
              {copied ? "Copied!" : "Copy email text"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
