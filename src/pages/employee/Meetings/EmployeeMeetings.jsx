import React, { useState } from 'react';
import { Video, Clock, Users, Link, Plus, ChevronRight, Calendar } from 'lucide-react';

const meetings = [
  { id:1, title:'Weekly Team Standup', date:'Jun 18, 2025', time:'9:30 AM', duration:'30 min', platform:'Google Meet', organizer:'Amit Sharma', attendees:8, link:'#', status:'upcoming', type:'recurring' },
  { id:2, title:'Q2 Performance Review', date:'Jun 20, 2025', time:'2:00 PM', duration:'60 min', platform:'Zoom', organizer:'HR Team', attendees:2, link:'#', status:'upcoming', type:'one-time' },
  { id:3, title:'Product Roadmap Discussion', date:'Jun 25, 2025', time:'11:00 AM', duration:'90 min', platform:'Google Meet', organizer:'Product Team', attendees:15, link:'#', status:'upcoming', type:'one-time' },
  { id:4, title:'Q2 All-Hands Meeting', date:'Jun 25, 2025', time:'3:00 PM', duration:'60 min', platform:'Google Meet', organizer:'Leadership', attendees:120, link:'#', status:'upcoming', type:'all-hands' },
  { id:5, title:'Weekly Team Standup', date:'Jun 11, 2025', time:'9:30 AM', duration:'30 min', platform:'Google Meet', organizer:'Amit Sharma', attendees:8, link:'#', status:'completed', type:'recurring' },
];

const typeStyle = {
  recurring: 'bg-blue-100 text-blue-700',
  'one-time': 'bg-violet-100 text-violet-700',
  'all-hands': 'bg-green-100 text-green-700',
};

const platIcon = { 'Google Meet':'🎥', 'Zoom':'💻', 'Teams':'💬' };

export default function EmployeeMeetings() {
  const [tab, setTab] = useState('upcoming');
  const filtered = meetings.filter(m => tab === 'all' || m.status === tab);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Meetings</h1>
        <p className="text-sm text-gray-500 mt-0.5">View and join your scheduled meetings</p>
      </div>

      {/* Next Meeting Banner */}
      {meetings.filter(m=>m.status==='upcoming')[0] && (
        <div
          className="rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #756FCC 0%, #9B7FDC 50%, #B58CEC 100%)' }}
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 text-2xl">
            {platIcon[meetings[0].platform] || '📅'}
          </div>
          <div className="flex-1">
            <p className="text-purple-100 text-xs font-semibold uppercase tracking-wide">Next Meeting</p>
            <h2 className="text-lg font-bold mt-0.5">{meetings[0].title}</h2>
            <p className="text-purple-100 text-sm mt-0.5">{meetings[0].date} · {meetings[0].time} · {meetings[0].duration}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#756FCC] text-sm font-bold rounded-xl hover:bg-purple-50 transition-all active:scale-95 shrink-0">
            <Link className="w-3.5 h-3.5" /> Join Meeting
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-violet-600">{meetings.filter(m=>m.status==='upcoming').length}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Upcoming</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{meetings.filter(m=>m.status==='completed').length}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Completed</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-700">{meetings.length}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Total This Month</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-1 p-1 m-3 bg-gray-100 rounded-xl w-fit">
          {['upcoming','completed','all'].map(t => (
            <button key={t} onClick={()=>setTab(t)} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${tab===t?'bg-white shadow text-violet-700':'text-gray-500'}`}>{t}</button>
          ))}
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.map(m => (
            <div key={m.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shrink-0">{platIcon[m.platform]||'📅'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-800">{m.title}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${typeStyle[m.type]}`}>{m.type}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-gray-500"><Calendar className="w-3 h-3"/>{m.date}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500"><Clock className="w-3 h-3"/>{m.time} · {m.duration}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500"><Users className="w-3 h-3"/>{m.attendees}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Organized by {m.organizer} · {m.platform}</p>
              </div>
              {m.status === 'upcoming' && (
                <button
                  style={{ background: 'linear-gradient(135deg, #756FCC 0%, #B58CEC 100%)' }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all shrink-0">
                  <Link className="w-3 h-3" /> Join
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
