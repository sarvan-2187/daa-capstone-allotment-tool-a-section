"use client";
import { useState } from "react";

export default function Home() {
  const [roll, setRoll] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAllot = async () => {
    setError(null);
    setResult(null);

    if (!roll.trim()) {
      setError("Please enter your roll number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/allocate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roll: roll.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Allocation failed.");
        return;
      }

      setResult(`Assigned Problem: ${data.problemNumber}`);

    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f3efe9_45%,_#eae4da_100%)] px-6 py-12">
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 animate-[slow-float_10s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,_#d7e7ff_0%,_transparent_65%)] opacity-70" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 animate-[slow-float_12s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,_#f3d4b5_0%,_transparent_70%)] opacity-70" />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="animate-[fade-up_700ms_ease-out] text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            DAA Capstone Portal
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
            Problem Allotment
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            This Form is for students of CSE B Section only.<br/>
            Enter your roll number to receive the assigned problem instantly.<br/>
            This allocation is final.
          </p>
        </header>

        <section className="mx-auto w-full max-w-xl animate-[fade-up_900ms_ease-out] rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 p-8 shadow-[0_25px_70px_-50px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Allotment Form</h2>
              <p className="mt-1 text-sm text-slate-500">
                Roll number is case-sensitive.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Live
            </span>
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-medium text-slate-700">Roll number</span>
            <input
              placeholder="E.g. CH.SC.U4CSE241XX"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(31,75,153,0.2)]"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              autoComplete="off"
            />
          </label>

          <button
            onClick={handleAllot}
            disabled={isLoading}
            className="mt-6 w-full rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-200/60 transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? "Processing request..." : "Get my problem number"}
          </button>

          <div className="mt-5 min-h-[24px]">
            {result && (
              <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                {result}
              </p>
            )}
            {error && (
              <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700">
                {error}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
