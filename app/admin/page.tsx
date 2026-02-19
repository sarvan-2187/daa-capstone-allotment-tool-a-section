"use client";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

const PROBLEM_STATEMENTS: Record<number, string> = {
  1: "Let’s go home!",
  2: "Let’s go home in EV!",
  3: "What does future holds?",
  4: "It’s all magic!",
  5: "Pack up!",
  6: "Don’t forget to pack up!",
  7: "Invitation: the old fashion way!",
  8: "Invitation: hurry up!",
  9: "Robots, Go!",
  10: "Keep it cool!",
  11: "There is no signal!",
  12: "Whom to send?",
  13: "To infinity, and beyond!",
  14: "ARM is great!",
  15: "Get vaccinated!",
  16: "Who will pay electricity bill?",
  17: "No more traffic!",
  18: "The hustle culture.",
  19: "The real civil engineer!",
  20: "Stay hydrated!",
};

const getProblemStatement = (problemNumber: number | string) => {
  const parsedNumber = Number(problemNumber);
  return PROBLEM_STATEMENTS[parsedNumber] || "Problem statement not mapped";
};

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const total = useMemo(() => data.length, [data]);

  const handleDownload = () => {
    if (!data.length) return;

    const rows = data.map((row) => ({
      "Roll Number": row.roll_number,
      "Problem Number": row.problem_number,
      "Problem Statement": getProblemStatement(row.problem_number),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Allocations");

    const dateStamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `allocations-${dateStamp}.xlsx`);
  };

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f3efe9_45%,_#eae4da_100%)] px-6 py-10">
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 animate-[slow-float_10s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,_#d7e7ff_0%,_transparent_65%)] opacity-70" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 animate-[slow-float_12s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,_#f3d4b5_0%,_transparent_70%)] opacity-70" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="animate-[fade-up_700ms_ease-out]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            DAA Capstone Portal
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Allocation Overview
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Review assigned problems and audit the records below.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Live
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                Total: {total}
              </span>
              <button
                type="button"
                onClick={handleDownload}
                disabled={isLoading || data.length === 0}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200/60 transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Download XLSX
              </button>
            </div>
          </div>
        </header>

        <section className="animate-[fade-up_900ms_ease-out] rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 p-6 shadow-[0_25px_70px_-50px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Allocations</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest entries are listed first.
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Roll number</th>
                  <th className="px-5 py-3 font-semibold">Problem</th>
                  <th className="px-5 py-3 font-semibold">Problem statement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && (
                  <tr>
                    <td className="px-5 py-6 text-slate-500" colSpan={3}>
                      Loading allocations...
                    </td>
                  </tr>
                )}
                {!isLoading && data.length === 0 && (
                  <tr>
                    <td className="px-5 py-6 text-slate-500" colSpan={3}>
                      No allocations recorded yet.
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  data.map((row, i) => (
                    <tr key={`${row.roll_number}-${i}`} className="text-slate-700">
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {row.roll_number}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                          {row.problem_number}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        {getProblemStatement(row.problem_number)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
