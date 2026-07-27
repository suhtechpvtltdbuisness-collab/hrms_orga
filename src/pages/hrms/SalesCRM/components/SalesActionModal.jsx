import React, { useState } from "react";
import { Building2, Check, Sparkles, Target, UserPlus, X } from "lucide-react";

const cx = (...classes) => classes.filter(Boolean).join(" ");
const meta = (record) => record.metadata || {};

const isDealOpportunityAction = (action) =>
  action === "New Deal" || action === "New Opportunity" || action?.startsWith("Add Deal");

const leadSources = ["Website", "Referral", "LinkedIn", "Cold outreach", "Event", "Partner"];
const leadOwners = ["Anaya Mehta", "Rohan Sharma", "Priya Nair", "Arjun Verma"];
const leadStages = ["New", "Contacted", "Qualified", "Lost"];
const leadModules = ["Attendance", "Payroll", "Leave & Shifts", "Recruitment", "Performance", "Employee Self-Service"];
const accountManagers = ["Anaya Mehta", "Rohan Sharma", "Priya Nair", "Arjun Verma"];
const renewalStatuses = ["On Track", "At Risk", "Renewal Due", "Churned"];
const industries = ["Finance", "Technology", "Healthcare", "Manufacturing", "Retail", "Education"];
const plans = ["Growth", "Professional", "Enterprise"];
const opportunityStages = ["Discovery", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
const competitors = ["Darwinbox", "Keka", "Zoho People", "GreytHR", "BambooHR", "None"];

function SalesModalShell({ icon: Icon, title, description, closeLabel, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-3 py-6">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-[#D9D9D9] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F4ECFF] text-[#7D1EDB] sm:h-12 sm:w-12">
              {React.createElement(Icon, { className: "h-5 w-5 sm:h-6 sm:w-6" })}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold leading-tight text-[#333333] sm:text-xl">{title}</h2>
              <p className="mt-1 text-sm font-medium leading-5 text-[#667085]">{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] text-[#667085] transition hover:bg-[#F9FAFB] hover:text-[#333333]"
            aria-label={closeLabel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AddLeadModal({ submitting = false, onClose, onSubmit }) {
  const fieldClass = "h-12 w-full rounded-lg border border-[#D9D9D9] bg-white px-4 text-sm font-medium text-[#333333] outline-none placeholder:text-[#98A2B3] focus:border-[#7D1EDB] focus:ring-2 focus:ring-[#7D1EDB]/15";

  return (
    <SalesModalShell
      icon={UserPlus}
      title="Add lead"
      description="Keep the pipeline current for conversion tracking and revenue forecasting."
      closeLabel="Close add lead form"
      onClose={onClose}
    >
        <form onSubmit={onSubmit} className="overflow-y-auto px-4 py-5 sm:px-6">
          <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
            <LeadTextField label="Lead name" name="leadName" placeholder="e.g. Grace Morgan" required fieldClass={fieldClass} />
            <LeadTextField label="Contact" name="contact" type="email" placeholder="grace@bluepeak.io" required fieldClass={fieldClass} />
            <LeadTextField label="Company" name="company" placeholder="e.g. Bluepeak Technologies" fieldClass={fieldClass} />
            <LeadTextField label="Phone" name="phone" type="tel" placeholder="+91" fieldClass={fieldClass} />
            <LeadSelectField label="Source" name="source" options={leadSources} fieldClass={fieldClass} />
            <LeadSelectField label="Lead owner" name="leadOwner" options={leadOwners} fieldClass={fieldClass} />
            <LeadSelectField label="Stage" name="stage" options={leadStages} defaultValue="New" fieldClass={fieldClass} />
            <LeadTextField label="Estimated value (₹)" name="estimatedValue" type="number" placeholder="0" fieldClass={fieldClass} />
            <LeadTextField label="Acquisition cost (₹)" name="acquisitionCost" type="number" placeholder="0" fieldClass={fieldClass} />
            <LeadTextField label="Expected close date" name="expectedCloseDate" type="date" fieldClass={fieldClass} />
            <LeadTextField label="Last contact" name="lastContact" type="date" fieldClass={fieldClass} />
            <LeadTextField
              label="Employees"
              name="employees"
              type="number"
              placeholder="300"
              hint="drives pricing & scoring"
              fieldClass={fieldClass}
            />
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-[#333333]">Interested modules</legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {leadModules.map((module, index) => (
                <LeadModulePill key={module} module={module} defaultChecked={index < 2} />
              ))}
            </div>
          </fieldset>

          <label className="mt-6 block space-y-2 text-sm font-semibold text-[#333333]">
            Notes
            <textarea
              name="notes"
              rows={4}
              placeholder="Context from the first conversation - pain points, current tools, urgency..."
              className="min-h-[120px] w-full resize-none rounded-lg border border-[#D9D9D9] bg-white px-4 py-3 text-sm font-medium text-[#333333] outline-none placeholder:text-[#98A2B3] focus:border-[#7D1EDB] focus:ring-2 focus:ring-[#7D1EDB]/15"
            />
          </label>

          <div className="mt-6 rounded-lg border border-[#D9D9D9] bg-[#F9FAFB] px-4 py-3 text-sm leading-6 text-[#667085]">
            Status saves as <strong className="text-[#333333]">Not Converted</strong> until the lead converts to an opportunity or is marked Lost. Qualified leads can be converted in one click from the Leads table.
          </div>

          <div className="mt-4 rounded-lg border border-[#C7A3F4] bg-[#F4ECFF] px-4 py-3 text-sm font-semibold text-[#7D1EDB]">
            <Sparkles className="mr-2 inline h-4 w-4" />
            Co-Pilot will score this lead and suggest an opening email as soon as it's saved.
          </div>

          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[#E5E7EB] pt-5 sm:flex-row sm:justify-end">
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
              {submitting ? "Saving..." : "Save lead"}
            </button>
          </div>
        </form>
    </SalesModalShell>
  );
}

function AddClientModal({ submitting = false, onClose, onSubmit }) {
  const fieldClass = "h-12 w-full rounded-lg border border-[#D9D9D9] bg-white px-4 text-sm font-medium text-[#333333] outline-none placeholder:text-[#98A2B3] focus:border-[#7D1EDB] focus:ring-2 focus:ring-[#7D1EDB]/15";

  return (
    <SalesModalShell
      icon={Building2}
      title="Add client"
      description="Maintain client details, billing value, and relationship ownership."
      closeLabel="Close add client form"
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="overflow-y-auto px-4 py-5 sm:px-6">
        <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
          <LeadTextField label="Primary contact" name="primaryContact" placeholder="e.g. Isabella Ward" required fieldClass={fieldClass} />
          <LeadTextField label="Company" name="company" placeholder="e.g. Northstar Finance" required fieldClass={fieldClass} />
          <LeadTextField label="Email" name="email" type="email" placeholder="hello@company.com" required fieldClass={fieldClass} />
          <LeadTextField label="Phone" name="phone" type="tel" placeholder="+91" fieldClass={fieldClass} />
          <div className="md:col-span-2">
            <LeadTextField label="Monthly revenue (₹)" name="monthlyRevenue" type="number" placeholder="0" fieldClass={fieldClass} />
          </div>
          <LeadSelectField label="Account manager" name="accountManager" options={accountManagers} fieldClass={fieldClass} />
          <LeadSelectField label="Renewal status" name="renewalStatus" options={renewalStatuses} defaultValue="On Track" fieldClass={fieldClass} />
          <LeadTextField label="Contract start" name="contractStart" type="date" fieldClass={fieldClass} />
          <LeadTextField label="Contract end" name="contractEnd" type="date" fieldClass={fieldClass} />
          <LeadSelectField label="Industry" name="industry" options={industries} fieldClass={fieldClass} />
          <LeadSelectField label="Plan" name="plan" options={plans} fieldClass={fieldClass} />
          <LeadTextField label="Employees" name="employees" type="number" placeholder="850" fieldClass={fieldClass} />
          <LeadTextField label="GSTIN" name="gstin" placeholder="22AAAAA0000A1Z5" fieldClass={fieldClass} />
        </div>

        <label className="mt-6 block space-y-2 text-sm font-semibold text-[#333333]">
          Billing address
          <textarea
            name="billingAddress"
            rows={4}
            placeholder="Registered office address for invoices..."
            className="min-h-[120px] w-full resize-none rounded-lg border border-[#D9D9D9] bg-white px-4 py-3 text-sm font-medium text-[#333333] outline-none placeholder:text-[#98A2B3] focus:border-[#7D1EDB] focus:ring-2 focus:ring-[#7D1EDB]/15"
          />
        </label>

        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[#E5E7EB] pt-5 sm:flex-row sm:justify-end">
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
            {submitting ? "Saving..." : "Save client"}
          </button>
        </div>
      </form>
    </SalesModalShell>
  );
}

function DealOpportunityModal({ action, submitting = false, onClose, onSubmit }) {
  const [winProbability, setWinProbability] = useState(60);
  const fieldClass = "h-12 w-full rounded-lg border border-[#D9D9D9] bg-white px-4 text-sm font-medium text-[#333333] outline-none placeholder:text-[#98A2B3] focus:border-[#7D1EDB] focus:ring-2 focus:ring-[#7D1EDB]/15";
  const isNewDeal = action === "New Deal" || action?.startsWith("Add Deal");
  const defaultStage = action?.includes(" - ") ? action.split(" - ")[1] : "Discovery";

  return (
    <SalesModalShell
      icon={Target}
      title={isNewDeal ? "New deal" : "New opportunity"}
      description={isNewDeal ? "Capture company, value, ownership, scope, and probability." : "Appears on the pipeline board in the stage you pick."}
      closeLabel={isNewDeal ? "Close new deal form" : "Close new opportunity form"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="overflow-y-auto px-4 py-5 sm:px-6">
        <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
          <LeadTextField label="Company" name="company" placeholder="e.g. Bluewave Fintech" required fieldClass={fieldClass} />
          <LeadTextField label="Primary contact" name="primaryContact" placeholder="Name - designation" fieldClass={fieldClass} />
          <LeadTextField label="Deal value (₹)" name="dealValue" type="number" placeholder="620000" required fieldClass={fieldClass} />
          <LeadTextField label="Employees" name="employees" type="number" placeholder="300" fieldClass={fieldClass} />
          <LeadSelectField label="Stage" name="stage" options={opportunityStages} defaultValue={defaultStage} required fieldClass={fieldClass} />
          <LeadTextField label="Expected close" name="expectedClose" type="date" fieldClass={fieldClass} />
          <LeadSelectField label="Owner" name="owner" options={leadOwners} fieldClass={fieldClass} />
          <LeadSelectField label="Competitor in deal" name="competitor" options={competitors} fieldClass={fieldClass} />
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold text-[#333333]">Modules in scope</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {leadModules.map((module, index) => (
              <LeadModulePill key={module} module={module} defaultChecked={index < 2} />
            ))}
          </div>
        </fieldset>

        <label className="mt-6 block space-y-3 text-sm font-semibold text-[#333333]">
          <span>Win probability - {winProbability}%</span>
          <input type="hidden" name="winProbability" value={winProbability} />
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={winProbability}
            onChange={(event) => setWinProbability(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#E9D7FE] accent-[#7D1EDB]"
          />
        </label>

        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[#E5E7EB] pt-5 sm:flex-row sm:justify-end">
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
            {submitting ? "Saving..." : isNewDeal ? "Save deal" : "Save opportunity"}
          </button>
        </div>
      </form>
    </SalesModalShell>
  );
}

function LeadModulePill({ module, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="cursor-pointer">
      <input
        type="checkbox"
        name="modules"
        value={module}
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        className="sr-only"
      />
      <span
        className={cx(
          "inline-flex h-10 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
          checked
            ? "border-[#7D1EDB] bg-[#F4ECFF] text-[#7D1EDB]"
            : "border-[#D9D9D9] bg-white text-[#667085] hover:border-[#C7A3F4] hover:text-[#7D1EDB]",
        )}
      >
        {checked && <Check className="h-4 w-4" />}
        {module}
      </span>
    </label>
  );
}

function LeadTextField({ label, name, placeholder, type = "text", required = false, hint, fieldClass, defaultValue, readOnly = false }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#333333]">
      <span className="flex items-center justify-between gap-4">
        <span>{label}{required && <span className="text-[#7D1EDB]"> *</span>}</span>
        {hint && <span className="text-sm font-medium text-[#667085]">{hint}</span>}
      </span>
      <input
        name={name}
        type={type}
        inputMode={type === "tel" ? "numeric" : undefined}
        maxLength={type === "tel" ? 10 : undefined}
        pattern={type === "tel" ? "[0-9]{10}" : undefined}
        onInput={type === "tel" ? (event) => {
          event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10);
        } : undefined}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        readOnly={readOnly}
        className={cx(fieldClass, readOnly && "bg-[#F9FAFB] text-[#667085]")}
      />
    </label>
  );
}

function LeadSelectField({ label, name, options, defaultValue = "", required = false, fieldClass }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#333333]">
      <span>{label}{required && <span className="text-[#7D1EDB]"> *</span>}</span>
      <select name={name} defaultValue={defaultValue} required={required} className={fieldClass}>
        <option value="" />
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ConvertLeadModal({ lead, submitting = false, onClose, onSubmit }) {
  const fieldClass = "h-12 w-full rounded-lg border border-[#D9D9D9] bg-white px-4 text-sm font-medium text-[#333333] outline-none placeholder:text-[#98A2B3] focus:border-[#7D1EDB] focus:ring-2 focus:ring-[#7D1EDB]/15";
  const leadMeta = meta(lead || {});
  const primaryContact = [lead?.name, leadMeta.contact].filter(Boolean).join(" — ");

  return (
    <SalesModalShell
      icon={Target}
      title="Convert lead to opportunity"
      description="All lead details carry over — confirm deal value and stage. The lead becomes read-only after conversion."
      closeLabel="Close convert lead form"
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="overflow-y-auto px-4 py-5 sm:px-6">
        <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
          <LeadTextField label="Company" name="company" defaultValue={lead?.company} required fieldClass={fieldClass} />
          <LeadTextField label="Primary contact" name="primaryContact" defaultValue={primaryContact} fieldClass={fieldClass} />
          <LeadTextField label="Deal value (₹)" name="dealValue" type="number" defaultValue={lead?.value} required fieldClass={fieldClass} />
          <LeadSelectField label="Stage" name="stage" options={["Discovery", "Qualified"]} defaultValue="Discovery" fieldClass={fieldClass} />
          <LeadTextField label="Expected close" name="expectedClose" type="date" defaultValue={lead?.followUpAt?.slice(0, 10)} fieldClass={fieldClass} />
          <LeadSelectField label="Owner" name="owner" options={leadOwners} defaultValue={lead?.owner} fieldClass={fieldClass} />
        </div>
        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[#E5E7EB] pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="inline-flex h-12 items-center justify-center rounded-lg border border-[#D9D9D9] bg-white px-5 text-sm font-semibold text-[#333333]">Cancel</button>
          <button type="submit" disabled={submitting} className="inline-flex h-12 items-center justify-center rounded-lg bg-[#7D1EDB] px-5 text-sm font-semibold text-white disabled:opacity-60">
            {submitting ? "Converting..." : "Convert to opportunity"}
          </button>
        </div>
      </form>
    </SalesModalShell>
  );
}

function ActivateClientModal({ opportunity, submitting = false, onClose, onSubmit }) {
  const fieldClass = "h-12 w-full rounded-lg border border-[#D9D9D9] bg-white px-4 text-sm font-medium text-[#333333] outline-none placeholder:text-[#98A2B3] focus:border-[#7D1EDB] focus:ring-2 focus:ring-[#7D1EDB]/15";
  const monthlyDefault = opportunity?.value ? Math.round(Number(opportunity.value) / 12) : "";

  return (
    <SalesModalShell
      icon={Building2}
      title="Activate client"
      description="Payment or contract confirmed — client record is auto-created with full pre-sale history. No re-entry required."
      closeLabel="Close activate client form"
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="overflow-y-auto px-4 py-5 sm:px-6">
        <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
          <LeadTextField label="Company" name="company" defaultValue={opportunity?.company} readOnly fieldClass={fieldClass} />
          <LeadTextField label="Monthly revenue (₹)" name="monthlyRevenue" type="number" defaultValue={monthlyDefault} fieldClass={fieldClass} />
          <LeadSelectField label="Account manager" name="accountManager" options={accountManagers} defaultValue={opportunity?.owner} fieldClass={fieldClass} />
          <LeadSelectField label="Plan" name="plan" options={plans} fieldClass={fieldClass} />
          <LeadSelectField label="Industry" name="industry" options={industries} fieldClass={fieldClass} />
          <LeadTextField label="Contract start" name="contractStart" type="date" fieldClass={fieldClass} />
          <LeadTextField label="Contract end" name="contractEnd" type="date" fieldClass={fieldClass} />
          <LeadTextField label="GSTIN" name="gstin" placeholder="22AAAAA0000A1Z5" fieldClass={fieldClass} />
        </div>
        <label className="mt-6 block space-y-2 text-sm font-semibold text-[#333333]">
          Billing address
          <textarea name="billingAddress" rows={3} className="min-h-[96px] w-full resize-none rounded-lg border border-[#D9D9D9] bg-white px-4 py-3 text-sm font-medium text-[#333333] outline-none focus:border-[#7D1EDB]" />
        </label>
        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[#E5E7EB] pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="inline-flex h-12 items-center justify-center rounded-lg border border-[#D9D9D9] bg-white px-5 text-sm font-semibold text-[#333333]">Cancel</button>
          <button type="submit" disabled={submitting} className="inline-flex h-12 items-center justify-center rounded-lg bg-[#7D1EDB] px-5 text-sm font-semibold text-white disabled:opacity-60">
            {submitting ? "Activating..." : "Confirm & create client"}
          </button>
        </div>
      </form>
    </SalesModalShell>
  );
}

export default function SalesActionModal({ action, section, lead, opportunity, submitting = false, onClose, onSubmit }) {
  if (action?.startsWith("Convert Lead -")) {
    return <ConvertLeadModal lead={lead} submitting={submitting} onClose={onClose} onSubmit={onSubmit} />;
  }

  if (action?.startsWith("Activate Client -")) {
    return <ActivateClientModal opportunity={opportunity} submitting={submitting} onClose={onClose} onSubmit={onSubmit} />;
  }

  if (action === "Add Lead") {
    return (
      <AddLeadModal
        submitting={submitting}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );
  }

  if (action === "Import Clients") {
    return (
      <AddClientModal
        submitting={submitting}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );
  }

  if (isDealOpportunityAction(action)) {
    return (
      <DealOpportunityModal
        action={action}
        submitting={submitting}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );
  }

  const title = action || "New Deal";
  const isSendingProposal = action === "Send Proposal";
  const submitLabel = isSendingProposal ? "Send" : "Create";
  const submittingLabel = isSendingProposal ? "Sending..." : "Creating...";
  const modalDescription = isSendingProposal
    ? "Fill in the proposal details below and send it to the client."
    : "Fill in the details below to create the record.";
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
              {modalDescription}
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
              {submitting ? submittingLabel : submitLabel}
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
