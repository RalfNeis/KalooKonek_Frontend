import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Pill, Activity, CheckCircle, Thermometer, Heart, Wind, Gauge } from 'lucide-react';
import axios from 'axios';

const Consultation: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [appointment, setAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    const [clinicalFindings, setClinicalFindings] = useState("");
    const [diagnosisPrescription, setDiagnosisPrescription] = useState("");
    const [saving, setSaving] = useState(false);

    const isReadOnly = appointment?.status === "FINISHED" || appointment?.status === "COMPLETED";

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try {
                const sessionData = JSON.parse(localStorage.getItem('kka_admin_session') || '{}');
                const token = sessionData.token;

                // Watch this URL! If it 404s, change 'accounts' to 'mp'
                const response = await axios.get(`http://127.0.0.1:8000/accounts/appointments/${id}/`, {
                    // FIXED: Changed Token to Bearer for Supabase
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setAppointment(response.data);
                setClinicalFindings(response.data.clinical_findings || "");
                setDiagnosisPrescription(response.data.diagnosis_prescription || "");
            } catch (error) {
                console.error("Error fetching appointment:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointmentDetails();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const sessionData = JSON.parse(localStorage.getItem('kka_admin_session') || '{}');
            const token = sessionData.token;

            // Watch this URL! If it 404s, change 'accounts' to 'mp'
            await axios.post(`http://127.0.0.1:8000/accounts/appointments/${id}/save/`, 
                { 
                    clinical_findings: clinicalFindings, 
                    diagnosis_prescription: diagnosisPrescription,
                    status: "COMPLETED" 
                }, 
                // FIXED: Changed Token to Bearer for Supabase
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert("Consultation saved successfully!");
            navigate('/appointments'); 
        } catch (error) {
            console.error("Error saving consultation:", error);
            alert("Failed to save. Check your terminal for a 404 or 500 error.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading consultation details...</div>;
    if (!appointment) return <div className="p-10 text-center text-red-500 font-medium">Appointment not found.</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isReadOnly ? "Consultation Record" : "Active Consultation"}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Appointment ID: {appointment?.display_id || id}
                        </p>
                    </div>
                </div>
                
                {isReadOnly && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl border border-green-100">
                        <CheckCircle size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                    </div>
                )}
            </div>

            {/* Vitals Summary Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                {[
                    { label: 'BP', value: appointment.bp, unit: 'mmHg', icon: <Gauge size={14} className="text-blue-500"/> },
                    { label: 'Temp', value: appointment.temp, unit: '°C', icon: <Thermometer size={14} className="text-orange-500"/> },
                    { label: 'HR', value: appointment.heart_rate, unit: 'bpm', icon: <Heart size={14} className="text-red-500"/> },
                    { label: 'RR', value: appointment.respiratory_rate, unit: 'bpm', icon: <Wind size={14} className="text-green-500"/> },
                    { label: 'SpO2', value: appointment.spo2, unit: '%', icon: <Activity size={14} className="text-cyan-500"/> },
                    { label: 'Wt', value: appointment.weight, unit: 'kg' },
                    { label: 'Ht', value: appointment.height, unit: 'cm' },
                ].map((vital, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 flex items-center gap-1">
                            {vital.icon} {vital.label}
                        </span>
                        <p className="text-sm font-bold text-slate-700">
                            {vital.value || '--'} 
                            <span className="text-[10px] ml-0.5 font-medium text-slate-400">{vital.unit}</span>
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-6">
                    {/* Clinical Findings */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Activity size={16} className="text-blue-500" /> Clinical Findings
                        </label>
                        <textarea 
                            readOnly={isReadOnly}
                            className={`w-full h-40 p-4 rounded-xl outline-none text-sm transition-all border ${
                                isReadOnly ? 'bg-slate-50 border-transparent text-slate-600' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500'
                            }`}
                            placeholder="Findings..."
                            value={clinicalFindings}
                            onChange={(e) => setClinicalFindings(e.target.value)}
                        />
                    </div>

                    {/* Diagnosis & Prescription */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Pill size={16} className="text-red-500" /> Diagnosis & Prescription
                        </label>
                        <textarea 
                            readOnly={isReadOnly}
                            className={`w-full h-32 p-4 rounded-xl outline-none text-sm transition-all border ${
                                isReadOnly ? 'bg-slate-50 border-transparent text-slate-600' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500'
                            }`}
                            placeholder="Medicine..."
                            value={diagnosisPrescription}
                            onChange={(e) => setDiagnosisPrescription(e.target.value)}
                        />
                    </div>

                    {!isReadOnly ? (
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className={`w-full ${saving ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer`}
                        >
                            <Save size={18} /> {saving ? 'Saving...' : 'Complete Consultation & Save'}
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate('/appointments')}
                            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition-all cursor-pointer"
                        >
                            Back to Schedule
                        </button>
                    )}
                </div>

                {/* Patient Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
                        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Patient Profile</p>
                        <h2 className="text-xl font-bold mb-4">{appointment.patient_name || "Unknown Patient"}</h2>
                        <div className="space-y-3 border-t border-slate-800 pt-4">
                            <div className="flex justify-between">
                                <span className="text-slate-400 text-xs">Patient ID</span>
                                <span className="text-xs font-bold">{appointment.patient_id_display || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 text-xs">Status</span>
                                <span className="text-xs font-bold uppercase">{appointment.status || "Pending"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Consultation;