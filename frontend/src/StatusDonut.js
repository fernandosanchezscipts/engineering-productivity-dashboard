// frontend/src/StatusDonut.js
import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SLICE_COLORS = [
  "rgba(96,165,250,0.9)", // blue
  "rgba(52,211,153,0.9)", // green
  "rgba(251,191,36,0.9)", // yellow
  "rgba(248,113,113,0.9)", // red
];

function getColors(count) {
  // If there are more statuses than colors, just cycle the palette.
  return Array.from({ length: count }, (_, i) => SLICE_COLORS[i % SLICE_COLORS.length]);
}

export default function StatusDonut({ statusCounts = {} }) {
  const labels = useMemo(() => Object.keys(statusCounts), [statusCounts]);
  const values = useMemo(() => Object.values(statusCounts), [statusCounts]);

  const chartData = useMemo(() => {
    const colors = getColors(labels.length);

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 2,
          hoverOffset: 18,
        },
      ],
    };
  }, [labels, values]);

  const chartOptions = useMemo(() => {
    return {
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0f172a",
          titleColor: "#ffffff",
          bodyColor: "#cbd5e1",
          borderColor: "#334155",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}`,
          },
        },
      },
      layout: { padding: 20 },
      maintainAspectRatio: false,
      cutout: "70%",
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1200,
        easing: "easeOutQuart",
      },
    };
  }, []);

  const hasData = labels.length > 0;

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-sky-500/20">
      <h2 className="mb-4 text-xl font-semibold text-slate-100">
        Issue Status Breakdown
      </h2>

      <div className="relative h-64">
        {hasData ? (
          <Doughnut data={chartData} options={chartOptions} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No status data available
          </div>
        )}
      </div>

      {hasData && (
        <div className="mt-6 flex flex-wrap gap-3">
          {labels.map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/40 px-3 py-1.5"
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: chartData.datasets[0].backgroundColor[i] }}
              />
              <span className="text-sm text-slate-300">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
