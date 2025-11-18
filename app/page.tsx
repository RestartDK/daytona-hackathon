"use client"

import { useState } from "react";
import { PartyPopper, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  const [position, setPosition] = useState("Financial Advisor");
  const [company, setCompany] = useState("Goldman Sacks");
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 md:py-14">
        <header className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-800">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Compliance Bro
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
              UI draft
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-amber-100 text-xl shadow-inner">
              <PartyPopper className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </header>

        <main className="flex flex-col gap-5">
          <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg backdrop-blur md:p-8">
            <div className="flex flex-wrap items-center gap-4 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              <span className="text-slate-800">I&apos;m</span>
              <input
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                placeholder="Your role"
                className="h-[52px] min-w-[200px] rounded-2xl border border-slate-200/90 bg-white px-4 text-lg font-semibold text-slate-800 shadow-sm outline-none transition focus:-translate-y-0.5 focus:border-emerald-400 focus:shadow"
              />
              <span className="text-slate-800 text-2xl md:text-3xl">at</span>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Your company"
                className="h-[52px] min-w-[200px] rounded-2xl border border-slate-200/90 bg-white px-4 text-lg font-semibold text-slate-800 shadow-sm outline-none transition focus:-translate-y-0.5 focus:border-emerald-400 focus:shadow"
              />
            </div>
            <p className="mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
              State-backed inputs with defaults: Financial Advisor at Goldman
              Sacks. Edit to preview other contexts—we&apos;ll wire this to your
              profile soon.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-lg backdrop-blur md:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              Ask a compliance question
            </div>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              We&apos;ll wire this up soon. For now, try a sample question or type your
              own.
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
          </section>
        </main>
      </div>
    </div>
  );
}
