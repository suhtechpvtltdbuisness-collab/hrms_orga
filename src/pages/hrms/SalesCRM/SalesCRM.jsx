import React, { useEffect, useMemo, useState } from "react";
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

const salesCrmService = {
  async getWorkspace() {
    return {
      updatedAt: "4 minutes ago",
      metrics: [
        { title: "Today's Revenue", value: "INR 4.2L", trend: "+12.4%", icon: CircleDollarSign },
        { title: "Monthly Revenue", value: "INR 86.4L", trend: "+9.1%", icon: TrendingUp },
        { title: "Total Leads", value: "184", trend: "+28 this week", icon: Users },
        { title: "Qualified Leads", value: "68", trend: "37% quality", icon: Trophy },
        { title: "Lost Leads", value: "19", trend: "-6 this month", icon: Activity },
        { title: "Won Deals", value: "23", trend: "+4 vs Jan", icon: Handshake },
        { title: "Active Opportunities", value: "47", trend: "INR 4.65Cr", icon: Target },
        { title: "Conversion Rate", value: "31.4%", trend: "-1.8 pts", icon: BarChart3 },
        { title: "Average Deal Size", value: "INR 9.9L", trend: "+7.2%", icon: BriefcaseBusiness },
        { title: "Target Achievement", value: "78%", trend: "INR 24L left", icon: ClipboardList },
      ],
      revenueTrend: [42, 58, 51, 76, 69, 84, 96],
      leadSources: [
        { label: "Website", value: 38 },
        { label: "Referral", value: 26 },
        { label: "Campaign", value: 21 },
        { label: "Partner", value: 15 },
      ],
      activities: [
        "Apex Manufacturing moved to negotiation",
        "Proposal sent to Nova Foods",
        "Discovery call completed with Trident Logistics",
        "Meridian Textiles renewal added to pipeline",
      ],
      followUps: [
        { client: "Orbit Retail Group", time: "Today, 4:30 PM", owner: "Priya N." },
        { client: "Sunrise Diagnostics", time: "Tomorrow, 11:00 AM", owner: "Aman M." },
        { client: "Bluewave Fintech", time: "18 Jul, 2:15 PM", owner: "Karan S." },
      ],
      deals: [
        { name: "Apex Manufacturing", amount: "INR 14.2L", stage: "Discovery", owner: "KS", health: 62 },
        { name: "Nova Foods", amount: "INR 7.4L", stage: "Qualified", owner: "DR", health: 71 },
        { name: "Sunrise Diagnostics", amount: "INR 6.2L", stage: "Proposal", owner: "AM", health: 78 },
        { name: "Orbit Retail Group", amount: "INR 11.9L", stage: "Negotiation", owner: "PN", health: 86 },
        { name: "Bluewave Fintech", amount: "INR 5.1L", stage: "Discovery", owner: "PN", health: 48 },
        { name: "Stellar EdTech", amount: "INR 3.6L", stage: "Qualified", owner: "PN", health: 66 },
        { name: "Trident Logistics", amount: "INR 4.8L", stage: "Proposal", owner: "DR", health: 82 },
        { name: "Meridian Textiles", amount: "INR 18.6L", stage: "Won", owner: "AM", health: 94 },
      ],
      knowledge: [
        { title: "ORGA Payroll and Attendance bundle playbook", category: "Services", owner: "Soumya S.", views: 412, confidence: 96, updated: "2d ago" },
        { title: "Case study: faster payroll close at Meridian Textiles", category: "Case Studies", owner: "Priya N.", views: 388, confidence: 94, updated: "5d ago" },
        { title: "Competitor comparison for growing teams", category: "Competitor Comparison", owner: "Aman M.", views: 281, confidence: 91, updated: "1w ago" },
      ],
      rows: {
        leads: [
          { name: "Ravi Sharma", company: "Apex Manufacturing", status: "Qualified", owner: "Karan S.", value: "INR 14.2L", next: "Demo tomorrow" },
          { name: "Meera Joshi", company: "Bluewave Fintech", status: "New", owner: "Priya N.", value: "INR 5.1L", next: "Intro call pending" },
          { name: "Arjun Rao", company: "Nova Foods", status: "Contacted", owner: "Dev R.", value: "INR 7.4L", next: "Send ROI note" },
        ],
        clients: [
          { name: "Meridian Textiles", company: "Manufacturing", status: "Active", owner: "Aman M.", value: "INR 18.6L", next: "Renewal in 45 days" },
          { name: "Orbit Retail Group", company: "Retail", status: "Expansion", owner: "Priya N.", value: "INR 11.9L", next: "Branch rollout plan" },
        ],
        opportunities: [
          { name: "Payroll automation rollout", company: "Sunrise Diagnostics", status: "Proposal", owner: "Aman M.", value: "INR 6.2L", next: "CFO approval" },
          { name: "Attendance and shift suite", company: "Trident Logistics", status: "Negotiation", owner: "Dev R.", value: "INR 4.8L", next: "Pricing review" },
        ],
      },
    };
  },
};

function useSalesWorkspace() {
  const [state, setState] = useState({ loading: true, error: "", data: null });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setState({ loading: true, error: "", data: null });
        const result = await salesCrmService.getWorkspace();
        await new Promise((resolve) => setTimeout(resolve, 250));
        if (mounted) setState({ loading: false, error: "", data: result });
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
  }, []);

  return state;
}

function SalesCRM() {
  const navigate = useNavigate();
  const { section = "overview" } = useParams();
  const activeSection = salesSections.some((item) => item.slug === section) ? section : "overview";
  const { loading, error, data } = useSalesWorkspace();
  const [actionModal, setActionModal] = useState(null);

  const openActionModal = (action = "New Deal") => {
    setActionModal({ action, section: activeSection });
  };

  const closeActionModal = () => {
    setActionModal(null);
  };

  const handleActionSubmit = (event) => {
    event.preventDefault();
    toast.success(`${actionModal?.action || "Sales item"} created successfully`);
    closeActionModal();
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

function SalesContent({ section, data, onAction }) {
  if (section === "overview") return <Overview data={data} onAction={onAction} />;
  if (section === "pipeline") return <Pipeline deals={data.deals} onAction={onAction} />;
  if (section === "sales-ai-co-pilot") return <CoPilot />;
  if (section === "knowledge-hub") return <KnowledgeHub items={data.knowledge} onAction={onAction} />;
  if (["leads", "clients", "opportunities"].includes(section)) {
    return <RecordsPage section={section} rows={data.rows[section] || []} onAction={onAction} />;
  }
  if (section === "proposal-builder") return <ProposalBuilder onAction={onAction} />;
  if (section === "pricing-calculator") return <PricingCalculator />;
  if (section === "products-services") return <ProductsServices onAction={onAction} />;
  if (section === "quotations") return <WorkspaceLibrary title="Quotations" cta="Generate Quote" icon={ReceiptText} onAction={onAction} />;
  if (section === "contracts") return <WorkspaceLibrary title="Contracts" cta="Upload Contract" icon={FileCheck2} onAction={onAction} />;
  if (section === "case-studies") return <WorkspaceLibrary title="Case Studies" cta="Add Case Study" icon={FolderOpen} onAction={onAction} />;
  if (section === "competitor-battlecards") return <WorkspaceLibrary title="Competitor Battlecards" cta="Create Battlecard" icon={ShieldQuestion} onAction={onAction} />;
  if (section === "objection-playbooks") return <WorkspaceLibrary title="Objection Playbooks" cta="Add Objection" icon={MessageSquareText} onAction={onAction} />;

  return <StatePanel title="Sales page not found" description="Choose a Sales workspace section from the navigation." />;
}

function Overview({ data, onAction }) {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Sales Workspace"
        title="Sales Overview"
        description={`Performance at a glance. Last refreshed ${data.updatedAt}.`}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Revenue Trend" action="Last 7 periods" className="min-h-[360px]">
          <div className="flex h-56 items-end gap-3 rounded-xl bg-[#F8FAFC] p-4">
            {data.revenueTrend.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#7D1EDB] to-[#C084FC]"
                  style={{ height: `${value}%` }}
                />
                <span className="text-xs text-[#667085]">W{index + 1}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Lead Sources" action="Live Mix" className="min-h-[360px]">
          <div className="space-y-4">
            {data.leadSources.map((source) => (
              <ProgressRow key={source.label} label={source.label} value={source.value} />
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Recent Activities" className="min-h-[280px]">
          <StackedList items={data.activities} />
        </Panel>
        <Panel title="Upcoming Follow-ups" className="min-h-[280px]">
          <div className="space-y-3">
            {data.followUps.map((item) => (
              <div key={item.client} className="rounded-lg border border-[#E4E0E0] bg-[#F9FAFB] p-4">
                <p className="font-semibold text-[#333333]">{item.client}</p>
                <p className="mt-1 text-sm text-[#667085]">{item.time} - {item.owner}</p>
              </div>
            ))}
          </div>
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

function RecordsPage({ section, rows, onAction }) {
  const title = section.charAt(0).toUpperCase() + section.slice(1);
  const cta = section === "leads" ? "Add Lead" : section === "clients" ? "Import Clients" : "New Opportunity";

  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title={title} description="Search, filter, assign owners, track activities, and keep follow-ups moving." />
      <DataToolbar cta={cta} onAction={() => onAction(cta)} />
      {rows.length ? <SalesTable rows={rows} /> : <EmptyState icon={Users} title={`No ${section} added yet`} description="Records created from backend APIs will appear here with actions and pagination." cta={cta} onAction={() => onAction(cta)} />}
    </div>
  );
}

function DataToolbar({ cta, onAction }) {
  return (
    <div className="flex min-h-[82px] flex-col gap-3 rounded-lg border border-[#E4E0E0] bg-white p-3 lg:flex-row lg:items-center lg:justify-between">
      <label className="flex min-h-12 flex-1 items-center gap-3 rounded-lg border border-[#D9D9D9] bg-white px-4 text-sm text-[#667085]">
        <Search className="h-4 w-4" />
        <input className="w-full bg-transparent outline-none placeholder:text-[#98A2B3]" placeholder="Search by name, company, owner, status..." />
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => toast("Filters will be connected with backend data.")}
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
              {["Name", "Company", "Status", "Owner", "Value", "Next Action", "Action"].map((head) => (
                <th key={head} className="px-5 py-4 font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {rows.map((row) => (
              <tr key={`${row.name}-${row.company}`} className="bg-white text-[#667085]">
                <td className="px-5 py-4 font-semibold text-[#333333]">{row.name}</td>
                <td className="px-5 py-4">{row.company}</td>
                <td className="px-5 py-4"><StatusBadge label={row.status} /></td>
                <td className="px-5 py-4">{row.owner}</td>
                <td className="px-5 py-4 font-semibold text-[#333333]">{row.value}</td>
                <td className="px-5 py-4">{row.next}</td>
                <td className="px-5 py-4">
                  <button className="text-sm font-semibold text-[#7D1EDB] hover:text-[#6916BF]">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pipeline({ deals, onAction }) {
  const stages = ["Discovery", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
  const grouped = useMemo(() => {
    return stages.map((stage) => ({
      stage,
      deals: deals.filter((deal) => deal.stage === stage),
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
            {column.deals.map((deal) => <DealCard key={deal.name} deal={deal} />)}
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
          <p className="mt-4 text-lg font-semibold text-[#333333]">{deal.amount}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4ECFF] text-xs font-semibold text-[#7D1EDB]">
          {deal.owner}
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

function CoPilot() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-lg border border-[#E4E0E0] bg-[#F9FAFB] px-4 py-10 text-center sm:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-[#F4ECFF] text-[#7D1EDB]">
        <Bot className="h-8 w-8" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-[#333333] sm:text-3xl">Sales AI Co-Pilot</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#667085]">
          This UI is ready for an LLM service layer to generate proposals, emails, meeting summaries, next-best-actions, pricing suggestions, and objection replies.
        </p>
      </div>
      <div className="rounded-lg border border-[#D9D9D9] bg-white p-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-lg bg-[#F9FAFB] px-4 text-[#667085]">
            <Sparkles className="h-5 w-5 text-[#7D1EDB]" />
            <input className="w-full bg-transparent text-sm font-medium outline-none" defaultValue="Our client has 300 employees and needs attendance with payroll." />
          </label>
          <button
            type="button"
            onClick={() => toast.success("Co-Pilot request queued")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7D1EDB] px-6 py-3 text-sm font-semibold text-white"
          >
            <Send className="h-4 w-4" />
            Ask Co-Pilot
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {["300 employees, attendance and payroll", "Retail chain, 12 branches", "Client comparing us on price"].map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => toast.success("Prompt selected")}
            className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#667085] transition hover:border-[#7D1EDB] hover:text-[#7D1EDB]"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function KnowledgeHub({ items, onAction }) {
  const categories = ["All", "Services", "Products", "Pricing", "Proposal Templates", "Case Studies", "Competitor Comparison", "FAQs", "Legal Documents", "Implementation Guides", "Contracts", "Email Templates", "Sales Scripts", "Objection Handling"];

  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title="Knowledge Hub" description="Searchable sales knowledge for proposals, pitches, battlecards, and Co-Pilot answers." />
      <DataToolbar cta="New Article" onAction={() => onAction("New Article")} />
      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => (
          <button key={category} className={cx("rounded-full border px-4 py-2 text-sm font-semibold transition", index === 0 ? "border-[#7D1EDB] bg-[#F4ECFF] text-[#7D1EDB]" : "border-[#E5E7EB] bg-white text-[#667085] hover:border-[#7D1EDB]")}>
            {category}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <article key={item.title} className="min-h-[136px] rounded-lg border border-[#E4E0E0] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <span className="rounded-full bg-[#F4ECFF] px-3 py-1 text-xs font-semibold text-[#7D1EDB]">{item.category}</span>
                <h3 className="mt-5 text-lg font-semibold text-[#333333]">{item.title}</h3>
                <p className="mt-3 text-sm font-medium text-[#667085]">Cross-industry - {item.views} views - by {item.owner}</p>
              </div>
              <div className="text-left lg:text-right">
                <p className="text-sm font-semibold text-[#0EA5E9]">{item.confidence}% AI confidence</p>
                <p className="mt-4 text-sm font-medium text-[#667085] lg:mt-12">Updated {item.updated}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProposalBuilder({ onAction }) {
  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title="Proposal Builder" description="Build proposals with client details, services, pricing, scope, deliverables, terms, preview, export, and send actions." />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Proposal Setup">
          <div className="grid gap-4 md:grid-cols-2">
            {["Client", "Products / Services", "Timeline", "Terms"].map((label) => (
              <label key={label} className="space-y-2 text-sm font-semibold text-[#333333]">
                {label}
                <input className="min-h-12 w-full rounded-lg border border-[#D9D9D9] bg-white px-4 text-[#333333] outline-none focus:border-[#7D1EDB]" placeholder={`Select ${label.toLowerCase()}`} />
              </label>
            ))}
          </div>
        </Panel>
        <Panel title="Proposal Actions">
          <div className="grid gap-3">
            {["Preview Proposal", "Export PDF", "Send Proposal"].map((label) => (
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

function ProductsServices({ onAction }) {
  const rows = [
    { name: "Payroll Core", company: "Subscription", status: "Active", owner: "Finance", value: "INR 249/user", next: "GST 18%" },
    { name: "Attendance Suite", company: "Subscription", status: "Active", owner: "HRMS", value: "INR 149/user", next: "Bundled discount" },
    { name: "Implementation Package", company: "Services", status: "Active", owner: "Sales Ops", value: "INR 75,000", next: "One-time fee" },
  ];

  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title="Products & Services" description="Manage product categories, pricing, taxes, discount rules, service packages, images, and descriptions." />
      <DataToolbar cta="Add Product" onAction={() => onAction("Add Product")} />
      <SalesTable rows={rows} />
    </div>
  );
}

function WorkspaceLibrary({ title, cta, icon: Icon, onAction }) {
  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title={title} description="This workspace is ready for backend APIs, advanced filters, bulk actions, version history, exports, and approvals." />
      <EmptyState icon={Icon} title={`${title} workspace is ready`} description="Connect the API to start listing real records here. Loading, empty, and action states are already in place." cta={cta} onAction={() => onAction(cta)} />
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
      {items.map((item) => (
        <div key={item} className="flex min-h-14 gap-3 rounded-lg border border-[#E4E0E0] bg-[#F9FAFB] p-4">
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

function SalesActionModal({ action, section, onClose, onSubmit }) {
  const title = action || "New Deal";

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
              Fill the details below. This form is ready to connect with the backend API.
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
                defaultValue={section === "pipeline" ? "Discovery" : "New"}
                className="h-12 w-full rounded-lg border border-[#D9D9D9] bg-white px-4 text-[#333333] outline-none focus:border-[#7D1EDB]"
              >
                <option>New</option>
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
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#7D1EDB] px-5 text-sm font-semibold text-white transition hover:bg-[#6916BF]"
            >
              Create
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
