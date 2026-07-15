import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Building2,
  Calculator,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  FileCheck2,
  FileText,
  Filter,
  FolderOpen,
  Handshake,
  LayoutDashboard,
  Lightbulb,
  MessageSquareText,
  Package,
  Plus,
  ReceiptText,
  Search,
  Send,
  ShieldQuestion,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { salesCrmService } from "../../../service";

const routeBase = "/hrms/sales";

const salesSections = [
  { label: "Overview", slug: "overview", icon: LayoutDashboard },
  { label: "Leads", slug: "leads", icon: Users },
  { label: "Clients", slug: "clients", icon: Building2 },
  { label: "Opportunities", slug: "opportunities", icon: Target },
  { label: "Pipeline", slug: "pipeline", icon: BarChart3 },
  { label: "Sales AI Co-Pilot", slug: "sales-ai-co-pilot", icon: Sparkles },
  { label: "Knowledge Hub", slug: "knowledge-hub", icon: BookOpen },
  { label: "Proposal Builder", slug: "proposal-builder", icon: FileText },
  { label: "Quotations", slug: "quotations", icon: ReceiptText },
  { label: "Contracts", slug: "contracts", icon: FileCheck2 },
  { label: "Products & Services", slug: "products-services", icon: Package },
  { label: "Pricing Calculator", slug: "pricing-calculator", icon: Calculator },
  { label: "Case Studies", slug: "case-studies", icon: FolderOpen },
  { label: "Competitor Battlecards", slug: "competitor-battlecards", icon: ShieldQuestion },
  { label: "Objection Playbooks", slug: "objection-playbooks", icon: MessageSquareText },
];

const cx = (...classes) => classes.filter(Boolean).join(" ");

// ---------- Formatting helpers ----------

const formatINR = (value) => {
  const numeric = Number(value) || 0;
  if (numeric >= 1e7) return `INR ${(numeric / 1e7).toFixed(1)}Cr`;
  if (numeric >= 1e5) return `INR ${(numeric / 1e5).toFixed(1)}L`;
  return `INR ${numeric.toLocaleString("en-IN")}`;
};

const formatDateTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const timeAgo = (iso) => {
  if (!iso) return "recently";
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

const ownerInitials = (owner) => {
  if (!owner) return "--";
  return owner
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const parseAmount = (raw) => {
  if (raw === undefined || raw === null || raw === "") return undefined;
  const numeric = Number(String(raw).replace(/[^0-9.]/g, ""));
  return isNaN(numeric) ? undefined : numeric;
};

const toTableRow = (record) => ({
  id: record.id,
  name: record.name,
  company: record.company || "—",
  status: record.status,
  owner: record.owner || "—",
  value: formatINR(record.value),
  next: record.nextAction || (record.followUpAt ? `Follow-up ${formatDateTime(record.followUpAt)}` : "—"),
});

// ---------- Action → API mapping ----------

const DOC_ACTION_TYPES = {
  "Create Proposal": "proposal",
  "Preview Proposal": "proposal",
  "Export PDF": "proposal",
  "Send Proposal": "proposal",
  "Generate Quote": "quotation",
  "Upload Contract": "contract",
  "Add Case Study": "case-study",
  "Create Battlecard": "battlecard",
  "Add Objection": "objection-playbook",
};

const recordTypeForAction = (action, section) => {
  if (action === "New Deal" || action.startsWith("Add Deal")) return "deal";
  if (action === "Add Lead" || action === "Schedule Follow-up") return "lead";
  if (action === "Import Clients") return "client";
  if (action === "New Opportunity") return "opportunity";
  if (section === "leads") return "lead";
  if (section === "clients") return "client";
  if (section === "opportunities") return "opportunity";
  return "deal";
};

const submitSalesAction = async (action, section, form) => {
  const name = form.name?.trim();
  const company = form.company?.trim();
  const value = parseAmount(form.value);
  const notes = form.notes?.trim();
  const owner = form.owner?.trim();

  if (action === "New Article") {
    return salesCrmService.createKnowledge({
      title: name,
      category: company || "Services",
      owner,
      content: notes,
    });
  }

  if (action === "Add Product") {
    return salesCrmService.createProduct({
      name,
      category: company || "Subscription",
      team: owner,
      priceLabel: form.value?.trim(),
      note: notes,
    });
  }

  if (DOC_ACTION_TYPES[action]) {
    return salesCrmService.createDocument({
      docType: DOC_ACTION_TYPES[action],
      title: name,
      clientName: company,
      owner,
      amount: value,
      notes,
    });
  }

  const recordType = recordTypeForAction(action, section);
  let status = form.stage;
  if (recordType === "deal" && !["Discovery", "Qualified", "Proposal", "Negotiation", "Won", "Lost"].includes(status)) {
    status = "Discovery";
  }

  return salesCrmService.createRecord({
    recordType,
    name,
    company,
    status,
    owner,
    value,
    followUpAt: form.followUp || undefined,
    notes,
  });
};

// ---------- Data hook ----------

function useSalesWorkspace() {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setState((prev) => ({ ...prev, loading: !prev.data, error: "" }));
        const result = await salesCrmService.getWorkspace();
        if (!mounted) return;
        if (result.success) {
          setState({ loading: false, error: "", data: result.data });
        } else {
          setState({ loading: false, error: result.message || "Unable to load Sales CRM data.", data: null });
        }
      } catch (error) {
        if (mounted) {
          setState({
            loading: false,
            error: error?.message || "Unable to load Sales CRM data.",
            data: null,
          });
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  return { ...state, refresh };
}

function SalesCRM() {
  const navigate = useNavigate();
  const { section = "overview" } = useParams();
  const activeSection = salesSections.some((item) => item.slug === section) ? section : "overview";
  const { loading, error, data, refresh } = useSalesWorkspace();
  const [actionModal, setActionModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openActionModal = (action = "New Deal") => {
    setActionModal({ action, section: activeSection });
  };

  const closeActionModal = () => {
    setActionModal(null);
  };

  const handleActionSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
    setSubmitting(true);
    try {
      const result = await submitSalesAction(actionModal.action, actionModal.section, formData);
      if (result.success) {
        toast.success(`${actionModal?.action || "Sales item"} saved successfully`);
        closeActionModal();
        refresh();
      } else {
        toast.error(result.message || "Failed to save. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (section !== activeSection) {
      navigate(`${routeBase}/${activeSection}`, { replace: true });
    }
  }, [activeSection, navigate, section]);

  return (
    <div className="bg-white px-4 sm:px-6 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] overflow-y-auto border border-[#D9D9D9]">
      <PageHeader activeSection={activeSection} onNewDeal={() => openActionModal("New Deal")} />
      <SalesSectionTabs activeSection={activeSection} />

      <div className="mt-6">
        {loading && <SalesSkeleton />}
        {!loading && error && <StatePanel title="Sales workspace unavailable" description={error} />}
        {!loading && !error && data && (
          <SalesContent
            section={activeSection}
            data={data}
            onAction={openActionModal}
          />
        )}
      </div>
      {actionModal && (
        <SalesActionModal
          action={actionModal.action}
          section={actionModal.section}
          submitting={submitting}
          onClose={closeActionModal}
          onSubmit={handleActionSubmit}
        />
      )}
    </div>
  );
}

function PageHeader({ activeSection, onNewDeal }) {
  const section = salesSections.find((item) => item.slug === activeSection);

  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Link to="/hrms" className="text-[#7D1EDB]">HRMS Dashboard</Link>
          <ChevronRight className="h-4 w-4 text-[#667085]" />
          <Link to={`${routeBase}/overview`} className="text-[#7D1EDB]">Sales</Link>
          <ChevronRight className="h-4 w-4 text-[#667085]" />
          <span className="text-[#667085]">{section?.label || "Overview"}</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#333333] sm:text-3xl">{section?.label || "Sales Overview"}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">
          Manage leads, clients, opportunities, pipeline, proposals, pricing, and sales knowledge from one CRM workspace.
        </p>
      </div>
      <button
        type="button"
        onClick={onNewDeal}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7D1EDB] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6916BF]"
      >
        <Plus className="h-4 w-4" />
        New Deal
      </button>
    </header>
  );
}

function SalesSectionTabs({ activeSection }) {
  return (
    <div className="mt-6 border-b border-[#E5E7EB] pb-3">
      <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
        {salesSections.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.slug;

          return (
            <Link
              key={item.slug}
              to={`${routeBase}/${item.slug}`}
              className={cx(
                "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                active
                  ? "border-[#7D1EDB] bg-[#F4ECFF] text-[#7D1EDB]"
                  : "border-[#E5E7EB] bg-white text-[#667085] hover:border-[#C7A3F4] hover:text-[#7D1EDB]"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const LIBRARY_SECTIONS = {
  quotations: { title: "Quotations", cta: "Generate Quote", icon: ReceiptText, docType: "quotation" },
  contracts: { title: "Contracts", cta: "Upload Contract", icon: FileCheck2, docType: "contract" },
  "case-studies": { title: "Case Studies", cta: "Add Case Study", icon: FolderOpen, docType: "case-study" },
  "competitor-battlecards": { title: "Competitor Battlecards", cta: "Create Battlecard", icon: ShieldQuestion, docType: "battlecard" },
  "objection-playbooks": { title: "Objection Playbooks", cta: "Add Objection", icon: MessageSquareText, docType: "objection-playbook" },
};

function SalesContent({ section, data, onAction }) {
  if (section === "overview") return <Overview data={data} onAction={onAction} />;
  if (section === "pipeline") return <Pipeline deals={data.deals} onAction={onAction} />;
  if (section === "sales-ai-co-pilot") return <CoPilot />;
  if (section === "knowledge-hub") return <KnowledgeHub items={data.knowledge} onAction={onAction} />;
  if (["leads", "clients", "opportunities"].includes(section)) {
    return <RecordsPage section={section} records={data.rows[section] || []} onAction={onAction} />;
  }
  if (section === "proposal-builder") return <ProposalBuilder documents={data.documents?.proposal || []} onAction={onAction} />;
  if (section === "pricing-calculator") return <PricingCalculator />;
  if (section === "products-services") return <ProductsServices products={data.products} onAction={onAction} />;
  if (LIBRARY_SECTIONS[section]) {
    const config = LIBRARY_SECTIONS[section];
    return (
      <WorkspaceLibrary
        title={config.title}
        cta={config.cta}
        icon={config.icon}
        documents={data.documents?.[config.docType] || []}
        onAction={onAction}
      />
    );
  }

  return <StatePanel title="Sales page not found" description="Choose a Sales workspace section from the navigation." />;
}

function Overview({ data, onAction }) {
  const metrics = useMemo(() => {
    const summary = data.metrics || {};
    const openPipelineValue = (data.deals || [])
      .filter((deal) => !["Won", "Lost"].includes(deal.status))
      .reduce((sum, deal) => sum + (Number(deal.value) || 0), 0);
    const leadQuality = summary.totalLeads > 0
      ? Math.round((summary.qualifiedLeads / summary.totalLeads) * 100)
      : 0;

    return [
      { title: "Today's Revenue", value: formatINR(summary.todayRevenue), trend: "Won today", icon: CircleDollarSign },
      { title: "Monthly Revenue", value: formatINR(summary.monthlyRevenue), trend: "This month", icon: TrendingUp },
      { title: "Total Leads", value: String(summary.totalLeads ?? 0), trend: "All time", icon: Users },
      { title: "Qualified Leads", value: String(summary.qualifiedLeads ?? 0), trend: `${leadQuality}% quality`, icon: Trophy },
      { title: "Lost Leads", value: String(summary.lostLeads ?? 0), trend: "All time", icon: Activity },
      { title: "Won Deals", value: String(summary.wonDeals ?? 0), trend: "All time", icon: Handshake },
      { title: "Active Opportunities", value: String(summary.activeOpportunities ?? 0), trend: formatINR(summary.opportunityValue), icon: Target },
      { title: "Conversion Rate", value: `${summary.conversionRate ?? 0}%`, trend: "Won vs closed", icon: BarChart3 },
      { title: "Average Deal Size", value: formatINR(summary.averageDealSize), trend: "Per won deal", icon: BriefcaseBusiness },
      { title: "Open Pipeline", value: formatINR(openPipelineValue), trend: "Across active deals", icon: ClipboardList },
    ];
  }, [data]);

  const trendBars = useMemo(() => {
    const trend = data.revenueTrend || [];
    const max = Math.max(...trend.map((item) => item.total), 1);
    return trend.map((item) => ({
      ...item,
      pct: Math.round((item.total / max) * 88) + 12,
    }));
  }, [data.revenueTrend]);

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Sales Workspace"
        title="Sales Overview"
        description={`Performance at a glance. Last refreshed ${timeAgo(data.updatedAt)}.`}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Revenue Trend" action="Won deals by week" className="min-h-[360px]">
          {trendBars.length ? (
            <div className="flex h-56 items-end gap-3 rounded-xl bg-[#F8FAFC] p-4">
              {trendBars.map((item, index) => (
                <div key={item.week} className="flex flex-1 flex-col items-center gap-2" title={formatINR(item.total)}>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#7D1EDB] to-[#C084FC]"
                    style={{ height: `${item.pct}%` }}
                  />
                  <span className="text-xs text-[#667085]">W{index + 1}</span>
                </div>
              ))}
            </div>
          ) : (
            <PanelEmpty message="Revenue trend will appear once deals are marked Won." />
          )}
        </Panel>
        <Panel title="Lead Sources" action="Live Mix" className="min-h-[360px]">
          {data.leadSources?.length ? (
            <div className="space-y-4">
              {data.leadSources.map((source) => (
                <ProgressRow key={source.label} label={source.label} value={source.value} />
              ))}
            </div>
          ) : (
            <PanelEmpty message="Lead sources will appear once leads are added." />
          )}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Recent Activities" className="min-h-[280px]">
          {data.activities?.length ? (
            <StackedList items={data.activities} />
          ) : (
            <PanelEmpty message="Activity will appear as your team works the pipeline." />
          )}
        </Panel>
        <Panel title="Upcoming Follow-ups" className="min-h-[280px]">
          {data.followUps?.length ? (
            <div className="space-y-3">
              {data.followUps.map((item) => (
                <div key={item.id} className="rounded-lg border border-[#E4E0E0] bg-[#F9FAFB] p-4">
                  <p className="font-semibold text-[#333333]">{item.client}</p>
                  <p className="mt-1 text-sm text-[#667085]">{formatDateTime(item.time)} - {item.owner || "Unassigned"}</p>
                </div>
              ))}
            </div>
          ) : (
            <PanelEmpty message="No follow-ups scheduled. Add one from any record." />
          )}
        </Panel>
        <Panel title="Quick Actions" className="min-h-[280px]">
          <div className="grid gap-3">
            {["Add Lead", "Create Proposal", "Schedule Follow-up", "Import Clients"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => onAction(label)}
                className="flex min-h-12 items-center justify-between rounded-lg border border-[#E4E0E0] bg-white px-4 text-left text-sm font-semibold text-[#333333] transition hover:border-[#7D1EDB] hover:text-[#7D1EDB]"
              >
                {label}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;
  const isNegative = metric.trend.startsWith("-");

  return (
    <article className="flex min-h-[160px] flex-col justify-between rounded-lg border border-[#E4E0E0] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F4ECFF] text-[#7D1EDB]">
          <Icon className="h-5 w-5" />
        </div>
        <span className={cx("text-xs font-semibold", isNegative ? "text-[#F59E0B]" : "text-[#16A34A]")}>
          {metric.trend}
        </span>
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#333333]">{metric.value}</p>
        <p className="mt-2 text-sm font-medium text-[#667085]">{metric.title}</p>
      </div>
    </article>
  );
}

function RecordsPage({ section, records, onAction }) {
  const [search, setSearch] = useState("");
  const title = section.charAt(0).toUpperCase() + section.slice(1);
  const cta = section === "leads" ? "Add Lead" : section === "clients" ? "Import Clients" : "New Opportunity";

  const rows = useMemo(() => {
    const mapped = records.map(toTableRow);
    if (!search.trim()) return mapped;
    const term = search.trim().toLowerCase();
    return mapped.filter((row) =>
      [row.name, row.company, row.owner, row.status].some((field) =>
        String(field).toLowerCase().includes(term),
      ),
    );
  }, [records, search]);

  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title={title} description="Search, filter, assign owners, track activities, and keep follow-ups moving." />
      <DataToolbar cta={cta} search={search} onSearch={setSearch} onAction={() => onAction(cta)} />
      {rows.length ? (
        <SalesTable rows={rows} />
      ) : (
        <EmptyState
          icon={Users}
          title={search ? `No ${section} match "${search}"` : `No ${section} added yet`}
          description={search ? "Try a different search term." : `Create your first ${section.slice(0, -1)} to get started.`}
          cta={cta}
          onAction={() => onAction(cta)}
        />
      )}
    </div>
  );
}

function DataToolbar({ cta, search = "", onSearch, onAction }) {
  return (
    <div className="flex min-h-[82px] flex-col gap-3 rounded-lg border border-[#E4E0E0] bg-white p-3 lg:flex-row lg:items-center lg:justify-between">
      <label className="flex min-h-12 flex-1 items-center gap-3 rounded-lg border border-[#D9D9D9] bg-white px-4 text-sm text-[#667085]">
        <Search className="h-4 w-4" />
        <input
          className="w-full bg-transparent outline-none placeholder:text-[#98A2B3]"
          placeholder="Search by name, company, owner, status..."
          value={search}
          onChange={(event) => onSearch?.(event.target.value)}
        />
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => toast("Use the search box to filter records.")}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-[#D9D9D9] bg-white px-4 text-sm font-semibold text-[#333333] transition hover:bg-[#F9FAFB] lg:flex-none"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
        <button
          type="button"
          onClick={onAction}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#7D1EDB] px-4 text-sm font-semibold text-white transition hover:bg-[#6916BF] lg:flex-none"
        >
          <Plus className="h-4 w-4" />
          {cta}
        </button>
      </div>
    </div>
  );
}

function SalesTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E4E0E0]">
      <div className="overflow-x-auto">
        <table className="min-w-[880px] w-full text-left text-sm">
          <thead className="bg-[#F9FAFB] text-xs uppercase tracking-[0.08em] text-[#667085]">
            <tr>
              {["Name", "Company", "Status", "Owner", "Value", "Next Action"].map((head) => (
                <th key={head} className="px-5 py-4 font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {rows.map((row) => (
              <tr key={row.id ?? `${row.name}-${row.company}`} className="bg-white text-[#667085]">
                <td className="px-5 py-4 font-semibold text-[#333333]">{row.name}</td>
                <td className="px-5 py-4">{row.company}</td>
                <td className="px-5 py-4"><StatusBadge label={row.status} /></td>
                <td className="px-5 py-4">{row.owner}</td>
                <td className="px-5 py-4 font-semibold text-[#333333]">{row.value}</td>
                <td className="px-5 py-4">{row.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PIPELINE_STAGES = ["Discovery", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

function Pipeline({ deals, onAction }) {
  const grouped = useMemo(() => {
    return PIPELINE_STAGES.map((stage) => ({
      stage,
      deals: (deals || []).filter((deal) => deal.status === stage),
    }));
  }, [deals]);

  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title="Pipeline" description="Track stage totals, revenue, probability, activities, notes, and card details from one board." />
      <div className="flex gap-4 overflow-x-auto pb-3">
        {grouped.map((column) => (
          <div key={column.stage} className="w-[310px] shrink-0 space-y-3 rounded-lg border border-[#E4E0E0] bg-[#F9FAFB] p-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#333333]">
                <span className={cx("h-2.5 w-2.5 rounded-full", column.stage === "Won" ? "bg-[#22C55E]" : column.stage === "Lost" ? "bg-[#EF4444]" : "bg-[#7D1EDB]")} />
                {column.stage}
              </h3>
              <span className="text-sm font-semibold text-[#667085]">{column.deals.length}</span>
            </div>
            {column.deals.map((deal) => <DealCard key={deal.id} deal={deal} />)}
            <button
              type="button"
              onClick={() => onAction(`Add Deal - ${column.stage}`)}
              className="flex h-12 w-full items-center justify-center rounded-lg border border-dashed border-[#D9D9D9] text-sm font-semibold text-[#667085] transition hover:border-[#7D1EDB] hover:text-[#7D1EDB]"
            >
              + Add Deal
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DealCard({ deal }) {
  return (
    <article className="min-h-[178px] rounded-lg border border-[#E4E0E0] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-[#333333]">{deal.name}</h4>
          <p className="mt-4 text-lg font-semibold text-[#333333]">{formatINR(deal.value)}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4ECFF] text-xs font-semibold text-[#7D1EDB]">
          {ownerInitials(deal.owner)}
        </span>
      </div>
      <div className="mt-4 flex justify-between text-sm font-medium text-[#667085]">
        <span>Deal Heat</span>
        <span>{deal.health}%</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-[#EEF2F6]">
        <div className={cx("h-2 rounded-full", deal.health >= 80 ? "bg-[#22C55E]" : "bg-[#7D1EDB]")} style={{ width: `${deal.health}%` }} />
      </div>
    </article>
  );
}

const COPILOT_SUGGESTIONS = [
  "How much sales did we do this month?",
  "Which employee closed the most deals?",
  "What deals are in negotiation right now?",
  "Which follow-ups are coming up?",
];

const SALES_DATA_KEYWORDS = [
  "sales", "revenue", "deal", "lead", "client", "customer", "pipeline",
  "opportunit", "follow", "employee", "team", "owner", "month", "today",
  "week", "year", "quarter", "target", "conversion", "won", "lost",
  "product", "quotation", "proposal", "amount", "value", "performance",
  "how much", "how many", "top", "best", "most", "total",
];

const GREETING_PATTERNS =
  /^(hi+|hii+|hello+|hey+|good\s+(morning|afternoon|evening|day)|thanks?|thank you|bye+|what can you do|help|who are you|how are you)/i;

const loadingLabelFor = (question) => {
  const lower = question.trim().toLowerCase();
  if (GREETING_PATTERNS.test(lower)) {
    return "Thinking...";
  }
  return SALES_DATA_KEYWORDS.some((keyword) => lower.includes(keyword))
    ? "Analyzing your sales data..."
    : "Thinking...";
};

function CoPilot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [asking, setAsking] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Thinking...");

  const ask = async (rawQuestion) => {
    const question = (rawQuestion ?? input).trim();
    if (!question || asking) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setLoadingLabel(loadingLabelFor(question));
    setAsking(true);
    try {
      const result = await salesCrmService.askCopilot(question);
      if (result.success) {
        setMessages((prev) => [...prev, { role: "assistant", text: result.data.answer }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", text: result.message, isError: true }]);
      }
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-lg border border-[#E4E0E0] bg-[#F9FAFB] px-4 py-8 sm:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-[#F4ECFF] text-[#7D1EDB]">
          <Bot className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-[#333333] sm:text-3xl">Sales AI Co-Pilot</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#667085]">
          Ask questions about your sales data — revenue, employee performance, pipeline, leads, and follow-ups. Answers come only from your organization's CRM records.
        </p>
      </div>

      {messages.length > 0 && (
        <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-lg border border-[#E4E0E0] bg-white p-4 text-left">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cx("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cx(
                  "max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-6",
                  message.role === "user"
                    ? "bg-[#7D1EDB] font-medium text-white"
                    : message.isError
                      ? "bg-[#FEF3F2] font-medium text-[#B42318]"
                      : "bg-[#F4ECFF] font-medium text-[#333333]",
                )}
              >
                {message.text}
              </div>
            </div>
          ))}
          {asking && (
            <div className="flex justify-start">
              <div className="rounded-xl bg-[#F4ECFF] px-4 py-3 text-sm font-medium text-[#7D1EDB]">
                {loadingLabel}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-[#D9D9D9] bg-white p-3">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            ask();
          }}
        >
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-lg bg-[#F9FAFB] px-4 text-[#667085]">
            <Sparkles className="h-5 w-5 text-[#7D1EDB]" />
            <input
              className="w-full bg-transparent text-sm font-medium outline-none"
              placeholder="e.g. How much sales did we do this month?"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={500}
            />
          </label>
          <button
            type="submit"
            disabled={asking || !input.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7D1EDB] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {asking ? "Asking..." : "Ask Co-Pilot"}
          </button>
        </form>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {COPILOT_SUGGESTIONS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={asking}
            onClick={() => ask(prompt)}
            className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#667085] transition hover:border-[#7D1EDB] hover:text-[#7D1EDB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

const KNOWLEDGE_CATEGORIES = ["All", "Services", "Products", "Pricing", "Proposal Templates", "Case Studies", "Competitor Comparison", "FAQs", "Legal Documents", "Implementation Guides", "Contracts", "Email Templates", "Sales Scripts", "Objection Handling"];

function KnowledgeHub({ items, onAction }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = items || [];
    if (category !== "All") {
      list = list.filter((item) => item.category === category);
    }
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((item) => item.title.toLowerCase().includes(term));
    }
    return list;
  }, [items, category, search]);

  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title="Knowledge Hub" description="Searchable sales knowledge for proposals, pitches, battlecards, and Co-Pilot answers." />
      <DataToolbar cta="New Article" search={search} onSearch={setSearch} onAction={() => onAction("New Article")} />
      <div className="flex flex-wrap gap-3">
        {KNOWLEDGE_CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={cx("rounded-full border px-4 py-2 text-sm font-semibold transition", category === item ? "border-[#7D1EDB] bg-[#F4ECFF] text-[#7D1EDB]" : "border-[#E5E7EB] bg-white text-[#667085] hover:border-[#7D1EDB]")}
          >
            {item}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="space-y-4">
          {filtered.map((item) => (
            <article key={item.id} className="min-h-[136px] rounded-lg border border-[#E4E0E0] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <span className="rounded-full bg-[#F4ECFF] px-3 py-1 text-xs font-semibold text-[#7D1EDB]">{item.category}</span>
                  <h3 className="mt-5 text-lg font-semibold text-[#333333]">{item.title}</h3>
                  <p className="mt-3 text-sm font-medium text-[#667085]">{item.views} views - by {item.owner || "Unknown"}</p>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-sm font-semibold text-[#0EA5E9]">{item.confidence}% AI confidence</p>
                  <p className="mt-4 text-sm font-medium text-[#667085] lg:mt-12">Updated {timeAgo(item.updatedAt)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No articles yet"
          description="Publish your first knowledge article to power proposals and Co-Pilot answers."
          cta="New Article"
          onAction={() => onAction("New Article")}
        />
      )}
    </div>
  );
}

function ProposalBuilder({ documents, onAction }) {
  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title="Proposal Builder" description="Build proposals with client details, services, pricing, scope, deliverables, terms, preview, export, and send actions." />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Recent Proposals">
          {documents.length ? (
            <SalesTable
              rows={documents.map((doc) => ({
                id: doc.id,
                name: doc.title,
                company: doc.clientName || "—",
                status: doc.status,
                owner: doc.owner || "—",
                value: doc.amount ? formatINR(doc.amount) : "—",
                next: `Created ${timeAgo(doc.createdAt)}`,
              }))}
            />
          ) : (
            <PanelEmpty message="No proposals yet. Create one to see it listed here." />
          )}
        </Panel>
        <Panel title="Proposal Actions">
          <div className="grid gap-3">
            {["Create Proposal", "Send Proposal"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => onAction(label)}
                className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-left text-sm font-semibold text-[#333333] transition hover:border-[#7D1EDB] hover:text-[#7D1EDB]"
              >
                {label}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function PricingCalculator() {
  const [qty, setQty] = useState(120);
  const [price, setPrice] = useState(249);
  const [discount, setDiscount] = useState(12);
  const subtotal = qty * price;
  const discounted = subtotal - subtotal * (discount / 100);
  const gst = discounted * 0.18;
  const total = discounted + gst;

  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title="Pricing Calculator" description="Estimate quantity, discounts, GST, margin, and net amount before exporting a quotation." />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Inputs">
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField label="Quantity" value={qty} onChange={setQty} />
            <NumberField label="Unit Price" value={price} onChange={setPrice} />
            <NumberField label="Discount %" value={discount} onChange={setDiscount} />
          </div>
        </Panel>
        <Panel title="Net Amount">
          <div className="space-y-3 text-sm font-medium text-[#667085]">
            <SummaryLine label="Subtotal" value={`INR ${subtotal.toLocaleString("en-IN")}`} />
            <SummaryLine label="After Discount" value={`INR ${Math.round(discounted).toLocaleString("en-IN")}`} />
            <SummaryLine label="GST 18%" value={`INR ${Math.round(gst).toLocaleString("en-IN")}`} />
            <div className="border-t border-[#E5E7EB] pt-4 text-xl font-semibold text-[#333333]">INR {Math.round(total).toLocaleString("en-IN")}</div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ProductsServices({ products, onAction }) {
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    let list = (products || []).map((product) => ({
      id: product.id,
      name: product.name,
      company: product.category,
      status: product.status,
      owner: product.team || "—",
      value: product.priceLabel || "—",
      next: product.note || "—",
    }));
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((row) =>
        [row.name, row.company, row.owner].some((field) => String(field).toLowerCase().includes(term)),
      );
    }
    return list;
  }, [products, search]);

  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title="Products & Services" description="Manage product categories, pricing, taxes, discount rules, service packages, images, and descriptions." />
      <DataToolbar cta="Add Product" search={search} onSearch={setSearch} onAction={() => onAction("Add Product")} />
      {rows.length ? (
        <SalesTable rows={rows} />
      ) : (
        <EmptyState
          icon={Package}
          title="No products added yet"
          description="Add your subscriptions and service packages to use them in quotes and proposals."
          cta="Add Product"
          onAction={() => onAction("Add Product")}
        />
      )}
    </div>
  );
}

function WorkspaceLibrary({ title, cta, icon: Icon, documents, onAction }) {
  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title={title} description="Create and track records for this workspace. New entries appear instantly below." />
      {documents.length ? (
        <>
          <DataToolbar cta={cta} onAction={() => onAction(cta)} />
          <SalesTable
            rows={documents.map((doc) => ({
              id: doc.id,
              name: doc.title,
              company: doc.clientName || "—",
              status: doc.status,
              owner: doc.owner || "—",
              value: doc.amount ? formatINR(doc.amount) : "—",
              next: `Created ${timeAgo(doc.createdAt)}`,
            }))}
          />
        </>
      ) : (
        <EmptyState icon={Icon} title={`No ${title.toLowerCase()} yet`} description={`Create your first entry with "${cta}" and it will be listed here.`} cta={cta} onAction={() => onAction(cta)} />
      )}
    </div>
  );
}

function SectionIntro({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7D1EDB]">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold text-[#333333] sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">{description}</p>
    </div>
  );
}

function Panel({ title, action, children, className = "" }) {
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

function PanelEmpty({ message }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-xl bg-[#F8FAFC] p-6 text-center">
      <p className="max-w-xs text-sm font-medium text-[#98A2B3]">{message}</p>
    </div>
  );
}

function ProgressRow({ label, value }) {
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

function StackedList({ items }) {
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

function StatusBadge({ label }) {
  const positive = ["Qualified", "Active", "Expansion", "Won"].includes(label);
  return (
    <span className={cx("inline-flex rounded-full px-3 py-1 text-xs font-semibold", positive ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F4ECFF] text-[#7D1EDB]")}>
      {label}
    </span>
  );
}

function EmptyState({ icon: Icon, title, description, cta, onAction }) {
  return (
    <div className="rounded-lg border border-[#E4E0E0] bg-[#F9FAFB] px-5 py-14 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-[#F4ECFF] text-[#7D1EDB]">
        <Icon className="h-8 w-8" />
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

function StatePanel({ title, description }) {
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

function SalesSkeleton() {
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

function NumberField({ label, value, onChange }) {
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

function SalesActionModal({ action, section, submitting = false, onClose, onSubmit }) {
  const title = action || "New Deal";
  const defaultStage = action?.includes(" - ")
    ? action.split(" - ")[1]
    : section === "pipeline" || action === "New Deal"
      ? "Discovery"
      : "New";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-2xl rounded-xl border border-[#D9D9D9] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7D1EDB]">
              Sales CRM
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#333333]">{title}</h2>
            <p className="mt-1 text-sm text-[#667085]">
              Fill the details below and save to create the record.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] text-[#667085] transition hover:bg-[#F9FAFB] hover:text-[#333333]"
            aria-label="Close sales form"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Deal / Record Name" name="name" placeholder="Enter name" required />
            <FormField label="Company / Client" name="company" placeholder="Enter company" required />
            <FormField label="Expected Value" name="value" placeholder="INR 0.00" />
            <label className="space-y-2 text-sm font-semibold text-[#333333]">
              Stage
              <select
                name="stage"
                defaultValue={defaultStage}
                className="h-12 w-full rounded-lg border border-[#D9D9D9] bg-white px-4 text-[#333333] outline-none focus:border-[#7D1EDB]"
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Discovery</option>
                <option>Qualified</option>
                <option>Proposal</option>
                <option>Negotiation</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
            </label>
            <FormField label="Owner" name="owner" placeholder="Assign owner" />
            <FormField label="Next Follow-up" name="followUp" type="date" />
          </div>

          <label className="space-y-2 text-sm font-semibold text-[#333333]">
            Notes
            <textarea
              name="notes"
              rows={4}
              placeholder="Add requirements, next action, objections, or proposal notes"
              className="w-full resize-none rounded-lg border border-[#D9D9D9] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#7D1EDB]"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-[#E5E7EB] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 items-center justify-center rounded-lg border border-[#D9D9D9] bg-white px-5 text-sm font-semibold text-[#333333] transition hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#7D1EDB] px-5 text-sm font-semibold text-white transition hover:bg-[#6916BF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, name, placeholder, type = "text", required = false }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#333333]">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-lg border border-[#D9D9D9] bg-white px-4 text-[#333333] outline-none focus:border-[#7D1EDB]"
      />
    </label>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="font-semibold text-[#333333]">{value}</span>
    </div>
  );
}

export { salesSections };
export default SalesCRM;
