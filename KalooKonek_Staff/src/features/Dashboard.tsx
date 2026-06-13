import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Patient {
    id: number;
    patient_name: string;
    display_id: string;
    status: string;
    is_walk_in?: boolean;
    // Patient record fields from manual-lookup
    age?: number;
    sex?: string;
    blood_type?: string;
    barangay?: string;
    allergies?: string;
}

interface DashboardProps {
    externalSearchTerm?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ externalSearchTerm }) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);

    const getAuthHeader = () => {
        const session = localStorage.getItem('kka_admin_session');
        if (session) {
            const { token } = JSON.parse(session);
            return { Authorization: `Token ${token}` };
        }
        return {};
    };

    const handleManualLookup = async (query: string) => {
        if (!query || query.length < 2) return;
        try {
            const res = await axios.get(`http://127.0.0.1:8000/mp/manual-lookup/?query=${query}`, {
                headers: getAuthHeader()
            });
            const found = res.data[0];
            if (found) {
                setPatient({
                    id: found.id,
                    patient_name: found.name,
                    display_id: found.display_id,
                    status: 'WALK-IN',
                    is_walk_in: true,
                    age: found.age,
                    sex: found.sex,
                    blood_type: found.blood_type,
                    barangay: found.barangay,
                    allergies: found.allergies,
                });
            }
        } catch (err) {
            console.error("Lookup Error:", err);
        }
    };

    useEffect(() => {
        if (externalSearchTerm) handleManualLookup(externalSearchTerm);
    }, [externalSearchTerm]);

    useEffect(() => {
        const fetchCurrent = async () => {
            const headers = getAuthHeader();
            if (!headers.Authorization) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get("http://127.0.0.1:8000/mp/appointments/?tab=Today's List", { headers });
                const active = res.data.find((p: Patient) => p.status !== 'FINISHED' && p.status !== 'COMPLETED');
                if (active) setPatient(active);
            } catch (err) {
                console.error("Sync Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrent();
    }, []);

    if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Clinical Data...</div>;

    return (
        <div className="w-full">
            {patient ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">

                    {/* Header: Avatar + Name + Buttons */}
                    <div className="flex items-center gap-6 px-8 pt-8 pb-6 border-b border-gray-100">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl border-4 border-white shadow">👤</div>
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-slate-800">{patient.patient_name}</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {patient.display_id}</p>
                            <div className="mt-2">
                                {patient.is_walk_in ? (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[9px] font-black rounded-lg uppercase">Walk-In</span>
                                ) : (
                                    <span className="px-3 py-1 bg-green-100 text-green-600 text-[9px] font-black rounded-lg uppercase">Scheduled</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => window.location.href = `/staff/patient-history/${patient.id}`}
                                className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-[#E53E3E] transition-colors"
                            >
                                View History
                            </button>
                            {patient.is_walk_in ? (
                                <button
                                    onClick={async () => {
                                        try {
                                            const headers = getAuthHeader();
                                            const res = await axios.post(`http://127.0.0.1:8000/mp/walkin/`, { patient_id: patient.id }, { headers });
                                            window.location.href = `/staff/consultation/${res.data.id}`;
                                        } catch (err) {
                                            console.error("Walk-in error:", err);
                                            alert("Failed to start walk-in consultation.");
                                        }
                                    }}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all"
                                >
                                    Consult Now
                                </button>
                            ) : (
                                <button
                                    onClick={() => window.location.href = `/staff/consultation/${patient.id}`}
                                    className="bg-[#E53E3E] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-[#c53030] hover:-translate-y-0.5 active:scale-95 transition-all"
                                >
                                    Enter Medical Notes
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Body: Patient Record Info */}
                    <div className="px-8 py-7">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Patient Record</p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Patient ID</p>
                                <p className="text-sm font-bold text-slate-800">{patient.display_id || '—'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Age</p>
                                <p className="text-sm font-bold text-slate-800">{patient.age ? `${patient.age} yrs` : '—'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sex</p>
                                <p className="text-sm font-bold text-slate-800 uppercase">{patient.sex || '—'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Blood Type</p>
                                <p className="text-sm font-bold text-slate-800">{patient.blood_type || 'Unknown'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Barangay</p>
                                <p className="text-sm font-bold text-slate-800">{patient.barangay || '—'}</p>
                            </div>
                        </div>

                        {/* Allergies */}
                        {patient.allergies ? (
                            <div className="mt-6 bg-red-50 border border-red-100 rounded-xl px-5 py-3 flex items-start gap-2">
                                <span className="text-red-500 text-sm mt-0.5">⚠</span>
                                <div>
                                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-0.5">Allergies</p>
                                    <p className="text-sm font-semibold text-red-600">{patient.allergies}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl px-5 py-3">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Allergies</p>
                                <p className="text-sm text-gray-500">None on record</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-300 font-bold">Search or Scan QR to select a patient.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;