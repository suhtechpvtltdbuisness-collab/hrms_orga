import React from "react";
import { Lightbulb, Plus } from "lucide-react";

export function SectionIntro({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7D1EDB]">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold text-[#333333] sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">{description}</p>
    </div>
  );
}

export function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-lg border border-[#E4E0E0] bg-white p-4 shadow-sm ${className}`}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-[#333333]">{title}</h2>
        {action && <span className="text-xs font-semibold text-[#667085]">{action}</span>}
      </div>
      {children}
    </section>
  );
}

export function PanelEmpty({ message }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-xl bg-[#F8FAFC] p-6 text-center">
      <p className="max-w-xs text-sm font-medium text-[#98A2B3]">{message}</p>
    </div>
  );
}

export function ProgressRow({ label, value }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm font-semibold">
        <span className="text-[#333333]">{label}</span>
        <span className="text-[#333333]">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-[#EEF2F6]">
        <div className="h-2.5 rounded-full bg-[#7D1EDB]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function StackedList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="flex min-h-14 gap-3 rounded-lg border border-[#E4E0E0] bg-[#F9FAFB] p-4">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#22C55E]" />
          <p className="text-sm font-medium text-[#333333]">{item}</p>
        </div>
      ))}
    </div>
  );
}

export function StatusBadge({ label }) {
  const positive = ["Qualified", "Active", "Onboarding", "Renewed", "Converted", "Closed Won", "On Track"].includes(label);
  const warning = ["Renewal Due", "At Risk", "Pending Activation"].includes(label);
  const negative = ["Lost", "Closed Lost", "Churned"].includes(label);
  return (
    <span className={[
      
      "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
      positive ? "bg-[#DCFCE7] text-[#16A34A]" : warning ? "bg-[#FEF3C7] text-[#D97706]" : negative ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#F4ECFF] text-[#7D1EDB]",
    ].filter(Boolean).join(" ")}>
      {label}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description, cta, onAction }) {
  return (
    <div className="rounded-lg border border-[#E4E0E0] bg-[#F9FAFB] px-5 py-14 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-[#F4ECFF] text-[#7D1EDB]">
        {React.createElement(Icon, { className: "h-8 w-8" })}
      </div>
      <h2 className="text-xl font-semibold text-[#333333]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#667085]">{description}</p>
      {cta && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#7D1EDB] px-5 py-3 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          {cta}
        </button>
      )}
    </div>
  );
}

export function StatePanel({ title, description }) {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-[#E4E0E0] bg-[#F9FAFB] p-8 text-center">
      <div>
        <Lightbulb className="mx-auto mb-4 h-10 w-10 text-[#F59E0B]" />
        <h2 className="text-2xl font-semibold text-[#333333]">{title}</h2>
        <p className="mt-2 max-w-lg text-sm text-[#667085]">{description}</p>
      </div>
    </div>
  );
}

export function SalesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 rounded-2xl bg-[#F2F4F7]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => <div key={item} className="h-40 rounded-xl bg-[#F2F4F7]" />)}
      </div>
      <div className="h-72 rounded-2xl bg-[#F2F4F7]" />
    </div>
  );
}

export function NumberField({ label, value, onChange }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#333333]">
      {label}
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="min-h-12 w-full rounded-lg border border-[#D9D9D9] bg-white px-4 text-[#333333] outline-none focus:border-[#7D1EDB]"
      />
    </label>
  );
}


