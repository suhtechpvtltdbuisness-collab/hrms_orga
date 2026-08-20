import { useEffect, useState, useCallback } from 'react';
import {
  Users, User, Building2, Mail, Phone, Briefcase, Globe,
  Calendar, Clock, Activity, TrendingUp, ArrowLeft, Eye,
  MapPin, Monitor, RefreshCw, ChevronRight, Flame, Minus, Circle
} from 'lucide-react';

const API_PREFIXES = ['/api', '/api/api'];

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function apiFetch(path) {
  let lastError = 'Something went wrong';

  for (const prefix of API_PREFIXES) {
    const res = await fetch(`${prefix}${path}`, { headers: getAuthHeaders() });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }

    lastError = await res.text();
    if (res.status !== 404) break;
  }

  throw new Error(lastError);
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function fmtDateTime(d) {
  if (!d) return '—';
  return `${fmtDate(d)} ${fmtTime(d)}`;
}

function IntentBadge({ score }) {
  if (score >= 30) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
      <Flame size={12} /> High Intent
    </span>
  );
  if (score >= 10) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
      <Minus size={12} /> Medium Intent
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
      <Circle size={12} /> Low Intent
    </span>
  );
}

function IdentityBadge({ status }) {
  const map = {
    authenticated: 'bg-green-100 text-green-700',
    person_identified: 'bg-blue-100 text-blue-700',
    company_identified: 'bg-purple-100 text-purple-700',
    anonymous: 'bg-gray-100 text-gray-500',
  };
  const label = {
    authenticated: 'Authenticated',
    person_identified: 'Person ID\'d',
    company_identified: 'Company ID\'d',
    anonymous: 'Anonymous',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || map.anonymous}`}>
      {label[status] || 'Anonymous'}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Visitor List View
// ---------------------------------------------------------------------------

function VisitorList({ onSelect }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch('/admin/visitors?limit=100');
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      <RefreshCw size={20} className="animate-spin mr-2" /> Loading visitors…
    </div>
  );
  if (error) return (
    <div className="p-6 text-red-500">Failed to load: {error}</div>
  );

  const { stats, visitors } = data;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard label="Total Visitors" value={stats.total} icon={Users} color="bg-blue-500" />
        <StatCard label="Known Users" value={stats.known} icon={User} color="bg-green-500" />
        <StatCard label="Person ID'd" value={stats.identified} icon={Mail} color="bg-purple-500" />
        <StatCard label="Anonymous" value={stats.anonymous} icon={Eye} color="bg-gray-400" />
        <StatCard label="Today" value={stats.today} icon={Calendar} color="bg-orange-500" />
        <StatCard label="Returning" value={stats.returning} icon={RefreshCw} color="bg-teal-500" />
        <StatCard label="Lead Score" value="∑" icon={TrendingUp} color="bg-pink-500" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Visitor List</h2>
          <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Visitor</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Job Title</th>
                <th className="px-4 py-3 text-left">First Seen</th>
                <th className="px-4 py-3 text-left">Last Seen</th>
                <th className="px-4 py-3 text-right">Pages</th>
                <th className="px-4 py-3 text-right">Sessions</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Intent</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitors.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-gray-400">No visitors yet</td>
                </tr>
              )}
              {visitors.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(v.visitorId)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs flex-shrink-0">
                        {v.personName ? v.personName[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[120px]">
                          {v.personName || 'Anonymous Visitor'}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">{v.visitorId.slice(0, 16)}…</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 truncate max-w-[120px]">{v.companyName || '—'}</td>
                  <td className="px-4 py-3 text-gray-700 truncate max-w-[160px]">{v.workEmail || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[120px]">{v.jobTitle || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(v.firstSeenAt)}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(v.lastSeenAt)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{v.pageViewCount}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{v.sessionCount}</td>
                  <td className="px-4 py-3"><IdentityBadge status={v.identityStatus} /></td>
                  <td className="px-4 py-3"><IntentBadge score={v.leadScore} /></td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRight size={16} className="text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Visitor Detail View
// ---------------------------------------------------------------------------

function EventTimeline({ events }) {
  return (
    <div className="space-y-1">
      {events.slice(0, 40).map((e) => (
        <div key={e.id} className="flex items-start gap-3 py-1.5">
          <span className="text-xs text-gray-400 w-20 flex-shrink-0 pt-0.5">{fmtTime(e.createdAt)}</span>
          <div className="flex-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs font-mono text-gray-700">
              {e.eventName}
            </span>
            {e.pageUrl && (
              <span className="ml-2 text-xs text-gray-500 truncate max-w-xs inline-block">
                {new URL(e.pageUrl, window.location.origin).pathname}
              </span>
            )}
          </div>
        </div>
      ))}
      {events.length === 0 && <p className="text-sm text-gray-400">No events recorded</p>}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-800 break-all">{value}</p>
      </div>
    </div>
  );
}

function VisitorDetail({ visitorId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await apiFetch(`/admin/visitors/${encodeURIComponent(visitorId)}`);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [visitorId]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      <RefreshCw size={20} className="animate-spin mr-2" /> Loading…
    </div>
  );
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!data) return null;

  const { visitor: v, sessions, events } = data;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back to visitor list
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: profile card */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {v.personName ? v.personName[0].toUpperCase() : '?'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{v.personName || 'Anonymous Visitor'}</h3>
                <IdentityBadge status={v.identityStatus} />
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              <InfoRow icon={Mail} label="Work Email" value={v.workEmail} />
              <InfoRow icon={Phone} label="Phone" value={v.phone} />
              <InfoRow icon={Briefcase} label="Job Title" value={v.jobTitle} />
              <InfoRow icon={Building2} label="Company" value={v.companyName} />
              <InfoRow icon={Globe} label="Domain" value={v.companyDomain} />
              <InfoRow icon={User} label="LinkedIn" value={v.linkedinUrl} />
            </div>

            {v.identityProvider && (
              <p className="mt-4 text-xs text-gray-400">
                Identified via <span className="font-medium">{v.identityProvider}</span>
                {v.matchConfidence ? ` · ${Math.round(v.matchConfidence * 100)}% confidence` : ''}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Lead Score</h4>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-gray-900">{v.leadScore}</span>
              <IntentBadge score={v.leadScore} />
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-orange-400 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, (v.leadScore / 60) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Journey</h4>
            <InfoRow icon={Calendar} label="First Seen" value={fmtDateTime(v.firstSeenAt)} />
            <InfoRow icon={Clock} label="Last Seen" value={fmtDateTime(v.lastSeenAt)} />
            <InfoRow icon={Globe} label="First Referrer" value={v.firstReferrer} />
            <InfoRow icon={Globe} label="Last Referrer" value={v.lastReferrer} />
            <InfoRow icon={Activity} label="UTM Campaign" value={v.utmCampaign} />
            <InfoRow icon={Activity} label="UTM Source" value={v.utmSource} />
            <InfoRow icon={MapPin} label="Location" value={[v.city, v.region, v.country].filter(Boolean).join(', ') || null} />
            <InfoRow icon={Monitor} label="IP Address" value={v.ipAddress} />
          </div>
        </div>

        {/* Right: sessions + events */}
        <div className="xl:col-span-2 space-y-4">
          {/* Sessions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Sessions ({sessions.length})</h4>
            {sessions.length === 0 ? (
              <p className="text-sm text-gray-400">No sessions recorded</p>
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div key={s.id} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {s.landingPage ? new URL(s.landingPage, window.location.origin).pathname : 'Unknown page'}
                        </span>
                        {s.durationSeconds != null && (
                          <span className="text-xs text-gray-400">{Math.round(s.durationSeconds / 60)}m</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {fmtDateTime(s.startedAt)}
                        {s.device ? ` · ${s.device}` : ''}
                        {s.browser ? ` · ${s.browser}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Events timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Event Timeline ({events.length})</h4>
            <EventTimeline events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function VisitorIntelligence() {
  const [selectedVisitorId, setSelectedVisitorId] = useState(null);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Visitor Intelligence</h1>
        <p className="text-sm text-gray-500 mt-1">
          Anonymous and identified website visitors · super admin only
        </p>
      </div>

      {selectedVisitorId ? (
        <VisitorDetail visitorId={selectedVisitorId} onBack={() => setSelectedVisitorId(null)} />
      ) : (
        <VisitorList onSelect={setSelectedVisitorId} />
      )}
    </div>
  );
}
