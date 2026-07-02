import React, { useCallback, useEffect, useState } from 'react';
import { Check, Edit3, Package, Plus, Trash2, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscriptionService } from '../../../service';

const EMPTY_FORM = {
  planType: '',
  name: '',
  description: '',
  priceInr: 0,
  pricePerEmployeeInr: 0,
  durationDays: 30,
  maxEmployees: 1,
  module: 'hrms',
  organizationType: 'sme',
  featuresText: '',
  active: true,
  sortOrder: 0,
};

const getDynamicDescription = (plan) => {
  const description = String(plan.description || '');
  return description.replace(
    /up to\s+\d+\s+employees/gi,
    `up to ${plan.maxEmployees} employees`,
  );
};

const PlansTab = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    const response = await subscriptionService.getManagedPlans();
    if (response.success) setPlans(response.data);
    else toast.error(response.message);
    setLoading(false);
  }, []);

  useEffect(() => { loadPlans(); }, [loadPlans]);

  const openCreate = () => {
    setEditingPlan({ id: null });
    setForm(EMPTY_FORM);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      planType: plan.planType,
      name: plan.name,
      description: plan.description,
      priceInr: plan.priceInr,
      pricePerEmployeeInr: plan.pricePerEmployeeInr,
      durationDays: plan.durationDays,
      maxEmployees: plan.maxEmployees,
      module: plan.module,
      organizationType: plan.organizationType,
      featuresText: (plan.features || []).join('\n'),
      active: plan.active,
      sortOrder: plan.sortOrder,
    });
  };

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      planType: form.planType,
      name: form.name,
      description: form.description,
      priceInr: Number(form.priceInr),
      pricePerEmployeeInr: Number(form.pricePerEmployeeInr),
      durationDays: Number(form.durationDays),
      maxEmployees: Number(form.maxEmployees),
      module: form.module,
      organizationType: form.organizationType,
      features: form.featuresText.split('\n').map((feature) => feature.trim()).filter(Boolean),
      active: form.active,
      sortOrder: Number(form.sortOrder),
    };
    const response = editingPlan.id
      ? await subscriptionService.updateManagedPlan(editingPlan.id, payload)
      : await subscriptionService.createManagedPlan(payload);
    setSaving(false);
    if (!response.success) return toast.error(response.message);
    toast.success(response.message || 'Plan saved');
    setEditingPlan(null);
    loadPlans();
  };

  const handleDelete = async (plan) => {
    if (!window.confirm(`Delete ${plan.name}? Existing subscriptions will remain active, but this plan will no longer be sold.`)) return;
    const response = await subscriptionService.deleteManagedPlan(plan.id);
    if (!response.success) return toast.error(response.message);
    toast.success(response.message || 'Plan deleted');
    loadPlans();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
          <p className="mt-1 text-sm text-gray-500">Manage pricing, employee limits, duration, availability, and plan features.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6D28D9]">
          <Plus size={17} /> Create plan
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">Loading plans...</div>
      ) : plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Package className="mx-auto text-gray-300" size={40} />
          <p className="mt-3 text-sm text-gray-500">No plans are configured.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.id} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${plan.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {plan.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">{plan.planType}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(plan)} className="rounded-lg p-2 text-gray-500 hover:bg-purple-50 hover:text-purple-700" aria-label={`Edit ${plan.name}`}><Edit3 size={16} /></button>
                  <button onClick={() => handleDelete(plan)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${plan.name}`}><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-3xl font-bold text-gray-900">₹{Number(plan.priceInr).toLocaleString('en-IN')}</span>
                <span className="pb-1 text-sm text-gray-500">/{plan.durationDays} days</span>
              </div>
              <p className="mt-3 min-h-10 text-sm text-gray-600">{getDynamicDescription(plan)}</p>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-purple-50 px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2 font-medium text-purple-800"><Users size={16} /> Employee limit</span>
                <span className="font-bold text-purple-900">{plan.maxEmployees}</span>
              </div>
              <div className="mt-4 flex-1 space-y-2">
                {(plan.features || []).map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm text-gray-600"><Check size={15} className="mt-0.5 shrink-0 text-emerald-500" />{feature}</div>
                ))}
              </div>
              <p className="mt-5 border-t border-gray-100 pt-3 text-xs text-gray-400">{plan.subscriptionCount} existing subscription{plan.subscriptionCount === 1 ? '' : 's'}</p>
            </article>
          ))}
        </div>
      )}

      {editingPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleSave} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div><h2 className="text-xl font-bold text-gray-900">{editingPlan.id ? 'Edit plan' : 'Create plan'}</h2><p className="text-sm text-gray-500">Changes affect new purchases immediately.</p></div>
              <button type="button" onClick={() => setEditingPlan(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">Plan name<input required name="name" value={form.name} onChange={updateField} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-purple-500" /></label>
              <label className="text-sm font-medium text-gray-700">Plan key<input required disabled={Boolean(editingPlan.id)} name="planType" value={form.planType} onChange={updateField} placeholder="growth_plus" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none disabled:bg-gray-100 focus:border-purple-500" /></label>
              <label className="sm:col-span-2 text-sm font-medium text-gray-700">Description<textarea required name="description" value={form.description} onChange={updateField} rows={2} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-purple-500" /></label>
              <label className="text-sm font-medium text-gray-700">Price (₹)<input required min="0" type="number" name="priceInr" value={form.priceInr} onChange={updateField} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5" /></label>
              <label className="text-sm font-medium text-gray-700">Extra employee price (₹)<input required min="0" type="number" name="pricePerEmployeeInr" value={form.pricePerEmployeeInr} onChange={updateField} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5" /></label>
              <label className="text-sm font-medium text-gray-700">Employee limit<input required min="1" type="number" name="maxEmployees" value={form.maxEmployees} onChange={updateField} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5" /></label>
              <label className="text-sm font-medium text-gray-700">Duration (days)<input required min="1" type="number" name="durationDays" value={form.durationDays} onChange={updateField} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5" /></label>
              <label className="text-sm font-medium text-gray-700">Organization type<select name="organizationType" value={form.organizationType} onChange={updateField} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5"><option value="startup">Startup</option><option value="sme">SME</option><option value="enterprise">Enterprise</option></select></label>
              <label className="text-sm font-medium text-gray-700">Sort order<input required min="0" type="number" name="sortOrder" value={form.sortOrder} onChange={updateField} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5" /></label>
              <label className="sm:col-span-2 text-sm font-medium text-gray-700">Features <span className="font-normal text-gray-400">(one per line)</span><textarea name="featuresText" value={form.featuresText} onChange={updateField} rows={5} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-purple-500" /></label>
              <label className="sm:col-span-2 flex items-center gap-3 rounded-xl bg-gray-50 p-3 text-sm font-medium text-gray-700"><input type="checkbox" name="active" checked={form.active} onChange={updateField} className="h-4 w-4 accent-purple-600" />Available for purchase</label>
            </div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setEditingPlan(null)} className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700">Cancel</button><button disabled={saving} className="rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save plan'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlansTab;
