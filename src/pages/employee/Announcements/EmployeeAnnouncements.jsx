import React, { useState } from 'react';
import { Megaphone, Bell, FileText, Heart, ChevronRight, Search } from 'lucide-react';

const announcements = [
  { id:1, title:'Company Picnic — July 5th, 2025', category:'Event', date:'Jun 17, 2025', priority:'normal', content:'We are excited to announce our annual company picnic on July 5th at Cubbon Park! Come join the fun with your colleagues. Lunch and refreshments will be provided. RSVP by June 28th.', author:'HR Team', unread:true },
  { id:2, title:'Q2 All-Hands Meeting — June 25th', category:'Meeting', date:'Jun 15, 2025', priority:'high', content:'Mark your calendars! The Q2 All-Hands meeting is scheduled for June 25th at 3:00 PM IST via Google Meet. The agenda includes Q2 results, product updates, and the H2 roadmap.', author:'Leadership Team', unread:true },
  { id:3, title:'Updated Leave Policy — Effective July 1st', category:'Policy', date:'Jun 12, 2025', priority:'high', content:'Please review the updated Leave Policy document in the Documents section. Key changes include the addition of Menstrual Leave (2 days/month) and an increase in Earned Leave from 15 to 18 days annually.', author:'HR Team', unread:false },
  { id:4, title:'Happy Birthday, Ravi Kumar! 🎂', category:'Birthday', date:'Jun 10, 2025', priority:'normal', content:'Wishing Ravi Kumar from the Engineering team a very Happy Birthday! Please join us in wishing him well.', author:'HR Team', unread:false },
  { id:5, title:'Work Anniversary — Priya Nair (3 Years)', category:'Anniversary', date:'Jun 8, 2025', priority:'normal', content:'Congratulations to Priya Nair on completing 3 wonderful years with ORGA HRMS! Thank you for your dedication and contributions.', author:'HR Team', unread:false },
];

const catStyle = {
  Event:      { bg:'bg-blue-100', text:'text-blue-700', icon:'🎉' },
  Meeting:    { bg:'bg-violet-100', text:'text-violet-700', icon:'📅' },
  Policy:     { bg:'bg-red-100', text:'text-red-700', icon:'📋' },
  Birthday:   { bg:'bg-pink-100', text:'text-pink-700', icon:'🎂' },
  Anniversary:{ bg:'bg-amber-100', text:'text-amber-700', icon:'🏆' },
  default:    { bg:'bg-gray-100', text:'text-gray-600', icon:'📢' },
};

export default function EmployeeAnnouncements() {
  const [selected, setSelected] = useState(announcements[0]);
  const [search, setSearch] = useState('');

  const filtered = announcements.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Announcements</h1>
        <p className="text-sm text-gray-500 mt-0.5">Stay updated with company news, events and policies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 h-9 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search announcements..." className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 flex-1" />
          </div>
          <div className="space-y-2">
            {filtered.map(a => {
              const s = catStyle[a.category] || catStyle.default;
              return (
                <div
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selected?.id===a.id?'border-violet-400 ring-2 ring-violet-100':'border-gray-100 hover:border-gray-200'} ${a.unread?'border-l-4 border-l-violet-500':''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>{a.category}</span>
                        {a.unread && <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{a.title}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{a.date} · {a.author}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {(() => { const s = catStyle[selected.category] || catStyle.default; return (
                <div className="flex items-start gap-3 mb-5">
                  <span className="text-3xl">{s.icon}</span>
                  <div className="flex-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{selected.category}</span>
                    <h2 className="text-base font-bold text-gray-900 mt-2 leading-snug">{selected.title}</h2>
                    <p className="text-xs text-gray-400 mt-1">{selected.date} · Posted by {selected.author}</p>
                  </div>
                </div>
              ); })()}
              <div className="h-px bg-gray-100 mb-5" />
              <p className="text-sm text-gray-600 leading-relaxed">{selected.content}</p>
              <div className="mt-6 flex gap-3">
                <button className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-all">
                  <Heart className="w-3.5 h-3.5" /> Like
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Megaphone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Select an announcement to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
