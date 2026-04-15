import React, { useState } from 'react';
import { FileText, CalendarDays } from 'lucide-react';

const Appointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Today's List");
    const tabs = ["Today's List", 'Upcoming', 'Past Records'];

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header and Tab Switcher */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Clinical Schedule</h1>
                    <p className="text-sm text-gray-500">Manage your patient consultations and follow-ups.</p>
                </div>

                <div className="bg-slate-100/50 p-1 rounded-xl flex border border-slate-100 shadow-inner">
                    {tabs.map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                activeTab === tab 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {/* Appointment 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="text-center min-w-20">
                        <p className="font-bold text-blue-600 text-sm">10:30 AM</p>
                        <p className="text-[10px] text-slate-400">11:00 AM</p>
                    </div>
                    <div className="flex-1">
                        <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">Current Patient</span>
                        <h3 className="font-bold text-lg text-slate-800 mt-0.5">John Russel Gallanosa</h3>
                        <p className="text-xs text-slate-500">Female, 72 yrs • ID: 2024-088</p>
                        <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5 font-medium">
                            <FileText size={14} className="text-red-400" /> Blood Pressure Monitoring & Refill
                        </p>
                    </div>
                    <button className="bg-[#E32636] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#C52230] transition-all flex items-center gap-2">
                        <FileText size={14} /> Enter Medical Notes
                    </button>
                </div>

                {/* Appointment 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="text-center min-w-20">
                        <p className="font-bold text-slate-800 text-sm">1:00 PM</p>
                        <p className="text-[10px] text-slate-400">2:00 PM</p>
                    </div>
                    <div className="flex-1">
                        <span className="text-[9px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded uppercase tracking-wider">Scheduled</span>
                        <h3 className="font-bold text-lg text-slate-800 mt-0.5">Neo Gariando</h3>
                        <p className="text-xs text-slate-500">Male, 68 yrs • ID: 2025-001</p>
                        <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5 font-medium">
                            <CalendarDays size={14} className="text-amber-400" /> Post-operation Follow up
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">View History</button>
                        <button className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Reschedule</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointments;