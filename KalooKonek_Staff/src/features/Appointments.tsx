import React, { useState, useEffect } from 'react';
import { FileText, CalendarDays } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Today's List");
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    
    const tabs = ["Today's List", 'Upcoming', 'Past Records'];

    // --- RESCHEDULE HANDLER ---
    const handleReschedule = async (appointmentId: number) => {
        const newDate = prompt("Enter new date (YYYY-MM-DD):", "2026-05-13");
        const newTime = prompt("Enter new time (HH:MM):", "10:00");

        if (newDate && newTime) {
            try {
                const sessionData = JSON.parse(localStorage.getItem('kka_admin_session') || '{}');
                const token = sessionData.token;

                await axios.post(`http://127.0.0.1:8000/accounts/appointments/${appointmentId}/reschedule/`, 
                    { date: newDate, time: newTime },
                    { headers: { 'Authorization': `Token ${token}` } }
                );

                alert("Rescheduled successfully!");
                // Refresh list
                fetchAppointments(); 
            } catch (error) {
                console.error("Reschedule error:", error);
                alert("Failed to reschedule. Please check the date/time format.");
            }
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const sessionData = JSON.parse(localStorage.getItem('kka_admin_session') || '{}');
            const token = sessionData.token;

            const response = await axios.get('http://127.0.0.1:8000/accounts/appointments/', {
                params: { tab: activeTab },
                headers: { 'Authorization': `Token ${token}` }
            });
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [activeTab]);

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

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-slate-400 text-sm">Loading schedule...</p>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-400 text-sm italic">No records found for "{activeTab}"</p>
                    </div>
                ) : (
                    appointments.map((appt) => (
                        <div key={appt.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-blue-100 transition-all">
                            <div className="text-center min-w-20">
                                <p className={`font-bold text-sm ${appt.status === 'CURRENT' ? 'text-blue-600' : 'text-slate-800'}`}>
                                    {appt.time}
                                </p>
                                <p className="text-[10px] text-slate-400">{appt.end_time}</p>
                            </div>
                            
                            <div className="flex-1">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                    appt.status === 'CURRENT' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : appt.status === 'COMPLETED'
                                            ? 'bg-slate-100 text-slate-500' 
                                            : 'bg-amber-50 text-amber-600'
                                }`}>
                                    {appt.status === 'CURRENT' ? 'Current Patient' : appt.status === 'COMPLETED' ? 'Finished' : 'Scheduled'}
                                </span>
                                
                                <h3 className={`font-bold text-lg mt-0.5 ${
                                    appt.status === 'COMPLETED' ? 'text-slate-400' : 'text-slate-800'
                                }`}>
                                    {appt.patient_name}
                                </h3>
                                <p className="text-xs text-slate-500 font-mono">ID: {appt.display_id}</p>
                                
                                <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5 font-medium">
                                    {appt.status === 'CURRENT' ? (
                                        <FileText size={14} className="text-red-400" />
                                    ) : (
                                        <CalendarDays size={14} className={appt.status === 'COMPLETED' ? 'text-slate-300' : 'text-amber-400'} />
                                    )}
                                    {appt.purpose}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                {appt.status === 'CURRENT' ? (
                                    <button 
                                        onClick={() => navigate(`/staff/consultation/${appt.id}`)}
                                        className="bg-[#E32636] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#C52230] transition-all"
                                    >
                                        Enter Medical Notes
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => navigate(`/staff/consultation/${appt.id}`)}
                                            className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                        >
                                            View History
                                        </button>
                                        
                                        {appt.status !== 'COMPLETED' && (
                                            <button 
                                                onClick={() => handleReschedule(appt.id)}
                                                className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                            >
                                                Reschedule
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Appointments;