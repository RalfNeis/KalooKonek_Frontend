import React, { useState, useEffect } from 'react';
import { FileText, CalendarDays } from 'lucide-react';
import axios from 'axios';

// 1. Define an Interface for your Appointment data
interface Appointment {
    id: number;
    patient_name: string;
    display_id: string;
    time: string;
    end_time: string;
    purpose: string;
    status: 'CURRENT' | 'SCHEDULED' | 'COMPLETED';
}

const Appointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Today's List");
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    
    const tabs = ["Today's List", 'Upcoming', 'Past Records'];

    // 2. Fetch data from Django
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Get the session data we saved during login in Screenshot (3507).jpg
                const sessionData = JSON.parse(localStorage.getItem('kka_admin_session') || '{}');
                const token = sessionData.token;

                const response = await axios.get('http://127.0.0.1:8000/accounts/appointments/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setAppointments(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching appointments:", error);
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
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

            {/* 3. Dynamic Appointments List */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-slate-400 py-10">Loading schedule...</p>
                ) : appointments.length === 0 ? (
                    <p className="text-center text-slate-400 py-10">No appointments found for today.</p>
                ) : (
                    appointments.map((appt) => (
                        <div key={appt.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                            <div className="text-center min-w-20">
                                <p className={`font-bold text-sm ${appt.status === 'CURRENT' ? 'text-blue-600' : 'text-slate-800'}`}>
                                    {appt.time}
                                </p>
                                <p className="text-[10px] text-slate-400">{appt.end_time}</p>
                            </div>
                            
                            <div className="flex-1">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                    appt.status === 'CURRENT' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                    {appt.status === 'CURRENT' ? 'Current Patient' : 'Scheduled'}
                                </span>
                                
                                <h3 className="font-bold text-lg text-slate-800 mt-0.5">{appt.patient_name}</h3>
                                <p className="text-xs text-slate-500">ID: {appt.display_id}</p>
                                
                                <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5 font-medium">
                                    {appt.status === 'CURRENT' ? (
                                        <FileText size={14} className="text-red-400" />
                                    ) : (
                                        <CalendarDays size={14} className="text-amber-400" />
                                    )}
                                    {appt.purpose}
                                </p>
                            </div>

                            {/* Conditional Buttons based on status */}
                            {appt.status === 'CURRENT' ? (
                                <button className="bg-[#E32636] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#C52230] transition-all flex items-center gap-2">
                                    <FileText size={14} /> Enter Medical Notes
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">View History</button>
                                    <button className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Reschedule</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Appointments;