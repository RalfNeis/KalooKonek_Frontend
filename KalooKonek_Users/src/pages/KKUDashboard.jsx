import React from 'react';
import { HeartPulse, Pill, Calendar as CalendarIcon, PhoneCall, ShieldAlert, ArrowRight, QrCode, Download } from 'lucide-react';

const USER_DATA = {
  name: "Juan Cruz",
  firstName: "Juan",
  id: "2025-001",
  address: "Brgy. 172, Caloocan City",
  avatar: "🧑🏼‍🦳",
  bp: "120/80",
  sugar: "95 mg/dL",
  weight: "65 kg"
};

const ANNOUNCEMENTS = [
  { id: 1, type: 'URGENT', date: 'Today, 8:00 AM', title: 'Free Medical Mission', desc: 'The Barangay Health Center will be conducting free checkups and medicine distribution this weekend.' },
  { id: 2, type: 'PENSION', date: 'Yesterday', title: 'Social Pension Update', desc: 'The DSWD Social Pension payout schedule has been released for the 3rd quarter.' }
];

export default function KKUDashboard({ navigate = () => {} }) {
  const actions = [
    { icon: HeartPulse, label: 'Health Records', desc: 'View checkups', color: 'text-blue-500', bg: 'bg-blue-50', path: 'health' },
    { icon: Pill, label: 'Medicine', desc: 'Request refill', color: 'text-emerald-500', bg: 'bg-emerald-50', path: 'medicine' },
    { icon: CalendarIcon, label: 'Appointments', desc: 'OSCA Schedule', color: 'text-amber-500', bg: 'bg-amber-50', path: 'appointments' },
    { icon: PhoneCall, label: 'Emergency', desc: 'Contact Barangay', color: 'text-purple-500', bg: 'bg-purple-50', path: 'emergency' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mabuhay, <span className="text-red-600">{USER_DATA.firstName}!</span></h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-lg">Welcome to your official Barangay portal. Access your benefits, view announcements, and manage your health records here.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((act, i) => (
            <button key={i} onClick={() => navigate(act.path)} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group text-left">
              <div className={`${act.bg} ${act.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}><act.icon size={24} /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{act.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{act.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><ShieldAlert size={18} className="text-red-500" /> Barangay Announcements</h3>
            <button className="text-xs font-bold text-red-600 hover:text-red-700">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ANNOUNCEMENTS.map(ann => (
              <div key={ann.id} className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-sm border-t-4 ${ann.type === 'URGENT' ? 'border-t-red-500' : 'border-t-blue-500'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${ann.type === 'URGENT' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{ann.type}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{ann.date}</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">{ann.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{ann.desc}</p>
                <button className="text-xs font-bold text-red-600 flex items-center gap-1 hover:gap-2 transition-all">Read More <ArrowRight size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex justify-center lg:justify-end">
        <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden self-start">
          <div className="bg-red-600 p-6 text-white flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><ShieldAlert size={20} /></div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold opacity-90">Senior Citizen ID</p>
              <p className="font-medium text-sm">Caloocan City</p>
            </div>
          </div>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-orange-100 text-5xl flex items-center justify-center mb-4 relative shadow-inner border-4 border-white">
              {USER_DATA.avatar}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{USER_DATA.name}</h3>
            <p className="text-red-600 font-bold text-sm mt-1">ID: {USER_DATA.id}</p>
            <p className="text-xs text-gray-500 mt-2">{USER_DATA.address}</p>
            
            <button onClick={() => navigate('qrcode')} className="mt-6 w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-2xl p-6 flex flex-col items-center gap-3 transition-colors group cursor-pointer">
              <QrCode size={48} className="text-gray-800 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tap to Scan Verification</span>
            </button>
            <button className="mt-6 text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-2"><Download size={14} /> Download Digital Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
}