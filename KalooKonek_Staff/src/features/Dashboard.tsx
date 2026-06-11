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
        bp: '', temp: '', weight: '', height: '',
        spo2: '', heartRate: '', respiRate: '', 
        notes: '', diagnosis: '', prescription: '' 
    });

    const getAuthHeader = () => {
        const session = localStorage.getItem('kka_admin_session');
        if (session) {
            const { token } = JSON.parse(session);
            return { Authorization: `Token ${token}` };
        }
        return {};
    };

    const getMedicalTags = () => {
        const tags: { label: string; color: string }[] = [];
        
        if (vitals.bp && vitals.bp.includes('/')) {
            const [sys, dia] = vitals.bp.split('/').map(Number);
            if (!isNaN(sys) && !isNaN(dia)) {
                if (sys > 180 || dia > 120) {
                    tags.push({ label: "Hypertensive Crisis", color: "bg-black text-white animate-pulse" });
                } else if (sys >= 140 || dia >= 90) {
                    tags.push({ label: "Stage 2 Hypertension", color: "bg-red-600 text-white" });
                } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
                    tags.push({ label: "Stage 1 Hypertension", color: "bg-red-400 text-white" });
                } else if ((sys >= 120 && sys <= 129) && dia < 80) {
                    tags.push({ label: "Elevated BP", color: "bg-orange-400 text-white" });
                }
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

        const rr = parseFloat(vitals.respiRate);
        if (!isNaN(rr) && rr > 0) {
            if (rr > 20) tags.push({ label: "Tachypnea", color: "bg-red-500 text-white" });
            else if (rr < 12) tags.push({ label: "Bradypnea", color: "bg-blue-500 text-white" });
        }

        const hr = parseFloat(vitals.heartRate);
        if (!isNaN(hr) && hr > 0) {
            if (hr >= 100) tags.push({ label: "Tachycardia", color: "bg-red-400 text-white" });
            else if (hr < 60) tags.push({ label: "Bradycardia", color: "bg-blue-400 text-white" });
        }

        const t = parseFloat(vitals.temp);
        if (!isNaN(t)) {
            if (t >= 38.0) tags.push({ label: "Fever", color: "bg-orange-600 text-white" });
            else if (t < 35.0) tags.push({ label: "Hypothermia", color: "bg-cyan-600 text-white" });
        }

        const ox = parseFloat(vitals.spo2);
        if (!isNaN(ox) && ox > 0 && ox < 95) {
            tags.push({ label: "Low SpO2", color: "bg-indigo-600 text-white" });
        }

        return tags;
    };

    const handleManualLookup = async (query: string) => {
        if (!query || query.length < 2) return;
        try {
            const res = await axios.get(`http://127.0.0.1:8000/accounts/appointments/?search=${query}`, {
                headers: getAuthHeader()
            });
            const found = res.data.find((p: Patient) => p.status !== 'FINISHED' && p.status !== 'COMPLETED');
            if (found) {
                setPatient(found);
                setVitals({
                    bp: '', temp: '', weight: '', height: '',
                    spo2: '', heartRate: '', respiRate: '',
                    notes: '', diagnosis: '', prescription: '' 
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
                const res = await axios.get("http://127.0.0.1:8000/accounts/appointments/?tab=Today's List", { headers });
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
            // Note: Sending 'prescription' separately if your backend needs it, 
            // otherwise common Django setups use 'diagnosis' for the second box.
            await axios.post(`http://127.0.0.1:8000/accounts/appointments/${patient.id}/save/`, 
                { ...vitals }, 
                { headers: getAuthHeader() }
            );
            alert("Record Saved Successfully!");
            window.location.reload(); 
        } catch (err: any) {
            console.error("Save Error:", err.response?.data);
            alert("Save failed. Make sure your model has the correct fields.");
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Clinical Data...</div>;

    return (
        <div className="w-full">
            {patient ? (
                <div className="bg-white rounded-4xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in duration-500">
                    <div className="flex flex-col md:flex-row">
                        
                        <div className="w-full md:w-1/3 bg-slate-50/50 p-8 border-r border-gray-100 flex flex-col items-center text-center">
                            <div className="relative mb-6">
                                <div className="w-28 h-28 bg-orange-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white">👤</div>
                                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <h1 className="text-2xl font-black text-slate-800 leading-tight mb-1">{patient.patient_name}</h1>
                            <p className="text-gray-400 font-bold text-xs mb-4 uppercase tracking-widest">ID: {patient.display_id}</p>
                            
                            <div className="flex flex-wrap justify-center gap-2">
                                {getMedicalTags().length > 0 ? (
                                    getMedicalTags().map((tag, i) => (
                                        <span key={i} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${tag.color}`}>
                                            {tag.label}
                                        </span>
                                    ))
                                ) : (
                                    <span className="px-3 py-1 bg-green-100 text-green-600 text-[9px] font-black rounded-lg uppercase">Stable / Normal</span>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-2/3 p-8">
                            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">New Medical Entry</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                                {[
                                    { label: 'BP (MMHG)', key: 'bp', ph: '120/80' },
                                    { label: 'TEMP (°C)', key: 'temp', ph: '36.5' },
                                    { label: 'WEIGHT (KG)', key: 'weight', ph: '65' },
                                    { label: 'HEIGHT (CM)', key: 'height', ph: '170' },
                                    { label: 'SpO2 (%)', key: 'spo2', ph: '98' },
                                    { label: 'HR (BPM)', key: 'heartRate', ph: '72' },
                                    { label: 'RR (BPM)', key: 'respiRate', ph: '16' }
                                ].map((field) => (
                                    <div key={field.key} className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{field.label}</label>
                                        <input 
                                            value={vitals[field.key as keyof typeof vitals]}
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-xl p-3 text-sm font-bold focus:bg-white focus:border-red-100 outline-none transition-all shadow-sm"
                                            placeholder={field.ph}
                                            onChange={(e) => setVitals({...vitals, [field.key as keyof typeof vitals]: e.target.value})}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Clinical Findings</label>
                                    <textarea 
                                        value={vitals.notes}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-sm font-medium h-24 focus:bg-white focus:border-red-100 outline-none resize-none transition-all"
                                        placeholder="Findings..."
                                        // FIXED: Only updates 'notes' now
                                        onChange={(e) => setVitals({...vitals, notes: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Diagnosis & Prescription</label>
                                    <textarea 
                                        value={vitals.diagnosis}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-sm font-medium h-20 focus:bg-white focus:border-red-100 outline-none resize-none transition-all"
                                        placeholder="Diagnosis and Medicine..."
                                        // FIXED: Correctly maps to 'diagnosis'
                                        onChange={(e) => setVitals({...vitals, diagnosis: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-6 mt-8">
                                <button 
                                    onClick={() => window.location.href = '/staff/appointments'}
                                    className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-[#E53E3E] transition-colors"
                                >
                                    View History
                                </button>
                                <button 
                                    onClick={handleSaveRecord}
                                    className="bg-[#E53E3E] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-[#c53030] hover:-translate-y-0.5 active:scale-95 transition-all"
                                >
                                    Save Record
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-12 text-center bg-white rounded-4xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-300 font-bold">Search or Scan QR to select a patient.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;