// frontend/src/App.js
import React, { useEffect, useState } from "react";
import StatusDonut from "./StatusDonut";

/*
  Demo data is used when the backend API is unavailable.
  This allows the dashboard to remain functional without external services.
*/
const DEMO_SUMMARY = {
  project: "DEMO",
  total_issues: 28,
  throughput_last_7_days: 7,
  avg_cycle_time_days: 3.4,
  status_counts: {
    "To Do": 8,
    "In Progress": 5,
    "Code Review": 3,
    Done: 12,
  },
};

const DEMO_ISSUES = [
  {
    key: "DEMO-1",
    summary: "Implement login flow",
    status: "In Progress",
    assignee: "Fernando Sanchez",
    cycle_time_days: 4,
  },
  {
    key: "DEMO-2",
    summary: "Create engineering productivity dashboard",
    status: "In Progress",
    assignee: "Fernando Sanchez",
    cycle_time_days: 6,
  },
  {
    key: "DEMO-3",
    summary: "Add unit tests for API layer",
    status: "Code Review",
    assignee: "Marisol Sanchez",
    cycle_time_days: 3,
  },
  {
    key: "DEMO-4",
    summary: "Refactor legacy reporting job",
    status: "To Do",
    assignee: "Jose Gomez",
    cycle_time_days: 0,
  },
  {
    key: "DEMO-5",
    summary: "Improve deployment pipeline",
    status: "In Progress",
    assignee: "Jim Morales",
    cycle_time_days: 5,
  },
  {
    key: "DEMO-6",
    summary: "Fix flaky integration tests",
    status: "Code Review",
    assignee: "Fernando Sanchez",
    cycle_time_days: 2,
  },
];

export default function App() {
  const [summary, setSummary] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [error, setError] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");

  // Fetch summary + issues from backend
  async function fetchData() {
    setLoading(true);
    setError(null);
    setUsingDemoData(false);

    try {
      const [summaryRes, issuesRes] = await Promise.all([
        fetch("/api/summary"),
        fetch("/api/issues"),
      ]);

      if (!summaryRes.ok || !issuesRes.ok) {
        throw new Error("Backend API error");
      }

      const summaryData = await summaryRes.json();
      const issuesData = await issuesRes.json();

      setSummary(summaryData);
      setIssues(issuesData);
    } catch (err) {
      console.warn("Backend not reachable, using demo data:", err);
      setSummary(DEMO_SUMMARY);
      setIssues(DEMO_ISSUES);
      setUsingDemoData(true);
      setError("Backend API not reachable. Showing demo data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !summary) {
    return (
      <div className="min-h-screen bg-[#050816] text-slate-100 flex items-center justify-center">
        <p className="text-slate-300 animate-pulse">Loading dashboard…</p>
      </div>
    );
  }

  // Dropdown values
  const allStatuses = ["All", ...new Set(issues.map((i) => i.status))];
  const allAssignees = ["All", ...new Set(issues.map((i) => i.assignee))];

  // Apply filters
  const visibleIssues = issues.filter((issue) => {
    const statusMatch =
      statusFilter === "All" || issue.status === statusFilter;
    const assigneeMatch =
      assigneeFilter === "All" || issue.assignee === assigneeFilter;
    return statusMatch && assigneeMatch;
  });

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6 transition-opacity duration-300">
        {/* Demo data banner */}
        {usingDemoData && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 animate-[pulse_1.5s_ease-in-out_infinite]">
            {error}
          </div>
        )}

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Engineering Productivity Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Snapshot of delivery health for the engineering team.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-200 border border-slate-700">
              <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Project: {summary.project || "DEMO"}
            </span>
            <button
              onClick={fetchData}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm 
                         hover:bg-sky-400 active:bg-sky-500/90 
                         transition-colors transition-transform duration-150 hover:-translate-y-0.5"
            >
              Refresh
            </button>
          </div>
        </header>

        {/* Metric cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Total issues"
            value={summary.total_issues}
            helper={`Project: ${summary.project || "DEMO"}`}
          />
          <MetricCard
            label="Throughput (last 7 days)"
            value={summary.throughput_last_7_days}
            helper="Issues moved to Done"
          />
          <MetricCard
            label="Avg cycle time"
            value={`${summary.avg_cycle_time_days?.toFixed?.(1)} days`}
            helper="From In Progress → Done"
          />
        </section>

        {/* Status table + donut */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-slate-100">
                Issue status breakdown
              </h2>
              <span className="text-xs text-slate-400">
                Count by current Jira status
              </span>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary.status_counts).map(([status, count]) => (
                  <tr
                    key={status}
                    className="border-t border-slate-800 hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="px-6 py-2 text-slate-100">{status}</td>
                    <td className="px-6 py-2 text-right text-slate-100">
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="transition-transform duration-300 hover:-translate-y-1">
            <StatusDonut statusCounts={summary.status_counts} />
          </div>
        </section>

        {/* Active issues */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg mt-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Active Issues
              </h2>
              <p className="text-xs text-slate-500">
                Live sample of Jira-style tickets
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={allStatuses}
              />
              <FilterSelect
                label="Assignee"
                value={assigneeFilter}
                onChange={setAssigneeFilter}
                options={allAssignees}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="px-6 py-3 text-left font-medium">Key</th>
                  <th className="px-6 py-3 text-left font-medium">Summary</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Assignee</th>
                  <th className="px-6 py-3 text-right font-medium">
                    Cycle time (days)
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleIssues.map((issue) => (
                  <tr
                    key={issue.key}
                    className="border-b border-slate-800/70 hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="px-6 py-2 text-sky-400 font-medium">
                      {issue.key}
                    </td>
                    <td className="px-6 py-2 text-slate-100">
                      {issue.summary}
                    </td>
                    <td className="px-6 py-2 text-slate-100">
                      {issue.status}
                    </td>
                    <td className="px-6 py-2 text-slate-100">
                      {issue.assignee}
                    </td>
                    <td className="px-6 py-2 text-right text-slate-100">
                      {issue.cycle_time_days}d
                    </td>
                  </tr>
                ))}

                {visibleIssues.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-slate-500 text-xs"
                    >
                      No issues match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

// Reusable metric card
function MetricCard({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-5 shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-slate-50">{value}</p>
      {helper && <p className="mt-2 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

// Small select helper (purely presentational)
function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-950/80 border border-slate-700 text-xs text-slate-100 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
