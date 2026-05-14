import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Patient {
    id: number;
    patient_name: string;
    display_id: string;
    status: string;
}

interface DashboardProps {
    externalSearchTerm?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ externalSearchTerm }) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [vitals, setVitals] = useState({
        blood_pressure: '',
        temperature: '',
        weight: '',
        height: '',
        spo2: '',
        heart_rate: '',
        respiratory_rate: '',
        diagnosis: '',
        treatment: '',
        prescription: '',
        notes: '',
    });

    const getAuthHeader = () => {
        const session = localStorage.getItem('kka_admin_session');
        if (session) {
            const { token } = JSON.parse(session);
            return { Authorization: `Bearer ${token}` };
        }
        return {};
    };

    const getMedicalTags = () => {
        const tags: { label: string; color: string }[] = [];

        if (vitals.blood_pressure && vitals.blood_pressure.includes('/')) {
            const [sys, dia] = vitals.blood_pressure.split('/').map(Number);
            if (!isNaN(sys) && !isNaN(dia)) {
                if (sys > 180 || dia > 120) tags.push({ label: "Hypertensive Crisis", color: "bg-black text-white animate-pulse" });
                else if (sys >= 140 || dia >= 90) tags.push({ label: "Stage 2 HTN", color: "bg-red-600 text-white" });
                else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) tags.push({ label: "Stage 1 HTN", color: "bg-red-400 text-white" });
                else if ((sys >= 120 && sys <= 129) && dia < 80) tags.push({ label: "Elevated BP", color: "bg-orange-400 text-white" });
            }
        }

        const w = parseFloat(vitals.weight);
        const h = parseFloat(vitals.height) / 100;
        if (!isNaN(w) && !isNaN(h) && h > 0) {
            const bmi = w / (h * h);
            if (bmi >= 30) tags.push({ label: `Obese (${bmi.toFixed(1)})`, color: "bg-purple-700 text-white" });
            else if (bmi >= 25) tags.push({ label: `Overweight (${bmi.toFixed(1)})`, color: "bg-orange-500 text-white" });
            else if (bmi < 18.5) tags.push({ label: `Underweight (${bmi.toFixed(1)})`, color: "bg-blue-400 text-white" });
        }

        const rr = parseFloat(vitals.respiratory_rate);
        if (!isNaN(rr) && rr > 0) {
            if (rr > 20) tags.push({ label: "Tachypnea", color: "bg-red-500 text-white" });
            else if (rr < 12) tags.push({ label: "Bradypnea", color: "bg-blue-500 text-white" });
        }

        const hr = parseFloat(vitals.heart_rate);
        if (!isNaN(hr) && hr > 0) {
            if (hr >= 100) tags.push({ label: "Tachycardia", color: "bg-red-400 text-white" });
            else if (hr < 60) tags.push({ label: "Bradycardia", color: "bg-blue-400 text-white" });
        }

        const t = parseFloat(vitals.temperature);
        if (!isNaN(t)) {
            if (t >= 38.0) tags.push({ label: "Fever", color: "bg-orange-600 text-white" });
            else if (t < 35.0) tags.push({ label: "Hypothermia", color: "bg-cyan-600 text-white" });
        }

        const ox = parseFloat(vitals.spo2);
        if (!isNaN(ox) && ox > 0 && ox < 95) tags.push({ label: "Low SpO2", color: "bg-indigo-600 text-white" });

        return tags;
    };

    const handleManualLookup = async (query: string) => {
        if (!query || query.length < 2) return;
        try {
            const res = await axios.get(`http://127.0.0.1:8000/mp/appointments/?search=${query}`, {
                headers: getAuthHeader()
            });
            const found = res.data.find((p: Patient) => p.status !== 'FINISHED' && p.status !== 'COMPLETED');
            if (found) {
                setPatient(found);
                setVitals({
                    blood_pressure: '', temperature: '', weight: '', height: '',
                    spo2: '', heart_rate: '', respiratory_rate: '',
                    diagnosis: '', treatment: '', prescription: '', notes: ''
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
            if (!headers.Authorization) { setLoading(false); return; }
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

    const handleSaveRecord = async () => {
        if (!patient) return;
        try {
            await axios.post(
                `http://127.0.0.1:8000/mp/appointments/${patient.id}/save/`,
                { ...vitals },
                { headers: getAuthHeader() }
            );
            alert("Record Saved Successfully!");
            window.location.reload();
        } catch (err: any) {
            console.error("Save Error:", err.response?.data);
            alert("Save failed.");
        }
    };

    if (loading) return (
        <div className="p-10 text-center font-bold text-gray-400">
            Loading Clinical Data...
        </div>
    );

    return (
        <div className="w-full">
            {patient ? (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">

                        {/* LEFT — Patient Info */}
                        <div className="w-full lg:w-64 shrink-0 bg-white border-r border-gray-100 p-8 flex flex-col items-center text-center gap-4">
                            <div className="relative mt-2">
                                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white">
                                    👤
                                </div>
                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            <div>
                                <h1 className="text-lg font-black text-slate-800 leading-tight">
                                    {patient.patient_name}
                                </h1>
                                <p className="text-gray-400 font-bold text-[10px] mt-1 uppercase tracking-widest">
                                    ID: {patient.display_id}
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                                {getMedicalTags().length > 0 ? (
                                    getMedicalTags().map((tag, i) => (
                                        <span key={i} className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-tight ${tag.color}`}>
                                            {tag.label}
                                        </span>
                                    ))
                                ) : (
                                    <span className="px-2.5 py-1 bg-green-100 text-green-600 text-[8px] font-black rounded-lg uppercase">
                                        Stable / Normal
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* RIGHT — Form */}
                        <div className="flex-1 p-8">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                                New Medical Entry
                            </p>

                            {/* Vitals Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                                {[
                                    { label: 'BP', key: 'blood_pressure', ph: '120/80', unit: 'mmHg' },
                                    { label: 'Temp', key: 'temperature', ph: '36.5', unit: '°C' },
                                    { label: 'Weight', key: 'weight', ph: '65', unit: 'kg' },
                                    { label: 'Height', key: 'height', ph: '170', unit: 'cm' },
                                    { label: 'SpO2', key: 'spo2', ph: '98', unit: '%' },
                                    { label: 'HR', key: 'heart_rate', ph: '72', unit: 'bpm' },
                                    { label: 'RR', key: 'respiratory_rate', ph: '16', unit: 'bpm' },
                                ].map((field) => (
                                    <div key={field.key} className="bg-slate-50 rounded-2xl p-3 flex flex-col gap-1">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                            {field.label}
                                            <span className="normal-case font-medium ml-0.5 text-slate-300"> {field.unit}</span>
                                        </span>
                                        <input
                                            value={vitals[field.key as keyof typeof vitals]}
                                            className="bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300 w-full"
                                            placeholder={field.ph}
                                            onChange={(e) => setVitals({ ...vitals, [field.key]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Text Fields — 2x2 grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {[
                                    { label: 'Diagnosis', key: 'diagnosis', ph: 'Enter diagnosis...' },
                                    { label: 'Treatment', key: 'treatment', ph: 'Treatment plan...' },
                                    { label: 'Prescription', key: 'prescription', ph: 'Medications...' },
                                    { label: 'Notes', key: 'notes', ph: 'Additional notes...' },
                                ].map((field) => (
                                    <div key={field.key} className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            {field.label}
                                        </label>
                                        <textarea
                                            value={vitals[field.key as keyof typeof vitals]}
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-3 text-sm font-medium h-24 focus:bg-white focus:border-red-100 outline-none resize-none transition-all"
                                            placeholder={field.ph}
                                            onChange={(e) => setVitals({ ...vitals, [field.key]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-end gap-6">
                                <button
                                    onClick={() => window.location.href = '/appointments'}
                                    className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-[#E53E3E] transition-colors"
                                >
                                    View History
                                </button>
                                <button
                                    onClick={handleSaveRecord}
                                    className="bg-[#E53E3E] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-[#c53030] hover:-translate-y-0.5 active:scale-95 transition-all"
                                >
                                    Save Record
                                </button>
                            </div>
                        </div>
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