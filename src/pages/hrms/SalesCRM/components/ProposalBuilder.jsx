import React, { useRef } from "react";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import SalesTable from "./SalesTable";
import { Panel, PanelEmpty, SectionIntro } from "./SalesUi";

const formatINR = (value) => {
  const numeric = Number(value) || 0;
  if (numeric >= 1e7) return `INR ${(numeric / 1e7).toFixed(1)}Cr`;
  if (numeric >= 1e5) return `INR ${(numeric / 1e5).toFixed(1)}L`;
  return `INR ${numeric.toLocaleString("en-IN")}`;
};

const timeAgo = (iso) => {
  if (!iso) return "—";
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d ago` : `${Math.floor(days / 7)}w ago`;
};

const DOC_TABLE_COLUMNS = ["Title", "Client", "Status", "Owner", "Amount", "Created"];

export default function ProposalBuilder({ documents, onAction }) {
  const templateInputRef = useRef(null);

  const handleTemplateUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast.success(`${file.name} selected as proposal template`);
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      <SectionIntro eyebrow="Sales Workspace" title="Proposal Builder" description="Build proposals with client details, services, pricing, scope, deliverables, terms, preview, export, and send actions." />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Recent Proposals">
          {documents.length ? (
            <SalesTable
              columns={DOC_TABLE_COLUMNS}
              rows={documents.map((doc) => ({
                id: doc.id,
                name: doc.title,
                company: doc.clientName || "—",
                status: doc.status,
                owner: doc.owner || "—",
                value: doc.amount ? formatINR(doc.amount) : "—",
                next: timeAgo(doc.createdAt),
              }))}
            />
          ) : (
            <PanelEmpty message="No proposals yet. Create one to see it listed here." />
          )}
        </Panel>
        <Panel title="Proposal Actions">
          <div className="grid gap-3">
            <input
              ref={templateInputRef}
              type="file"
              accept=".doc,.docx,.pdf,.ppt,.pptx"
              onChange={handleTemplateUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => templateInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-left text-sm font-semibold text-[#333333] transition hover:border-[#7D1EDB] hover:text-[#7D1EDB]"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              Upload Template
            </button>
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


