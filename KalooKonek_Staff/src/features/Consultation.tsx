import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Pill, Activity, CheckCircle, Thermometer, Heart, Wind, Gauge } from 'lucide-react';
import axios from 'axios';

const Consultation: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [appointment, setAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [vitals, setVitals] = useState({
        blood_pressure: '', temperature: '', weight: '',
        height: '', heart_rate: '', respiratory_rate: '', spo2: ''
    });
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [prescription, setPrescription] = useState('');
    const [notes, setNotes] = useState('');

    const isReadOnly = appointment?.status === 'COMPLETED' || appointment?.status === 'FINISHED';

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try {
                const sessionData = JSON.parse(localStorage.getItem('kka_admin_session') || '{}');
                const token = sessionData.token;
                const response = await axios.get(`http://127.0.0.1:8000/mp/appointments/${id}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const d = response.data;
                setAppointment(d);
                setVitals({
                    blood_pressure: d.blood_pressure || '',
                    temperature: d.temperature || '',
                    weight: d.weight || '',
                    height: d.height || '',
                    heart_rate: d.heart_rate || '',
                    respiratory_rate: d.respiratory_rate || '',
                    spo2: d.spo2 || '',
                });
                setDiagnosis(d.diagnosis || '');
                setTreatment(d.treatment || '');
                setPrescription(d.prescription || '');
                setNotes(d.notes || '');
            } catch (error) {
                console.error('Error fetching appointment:', error);
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
            await axios.post(`http://127.0.0.1:8000/mp/appointments/${id}/save/`,
                { ...vitals, diagnosis, treatment, prescription, notes },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert('Consultation saved successfully!');
            navigate('/appointments');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Loading...</div>;
    if (!appointment) return <div className="p-10 text-center text-red-500">Appointment not found.</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isReadOnly ? 'Consultation Record' : 'Active Consultation'}
                        </h1>
                        <p className="text-sm text-gray-500">Visit Date: {appointment.visit_date}</p>
                    </div>
                </div>
                {isReadOnly && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl border border-green-100">
                        <CheckCircle size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                    </div>
                )}
            </div>

            {/* Vitals */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                {[
                    { label: 'BP', key: 'blood_pressure', unit: 'mmHg', icon: <Gauge size={14} className="text-blue-500"/> },
                    { label: 'Temp', key: 'temperature', unit: '°C', icon: <Thermometer size={14} className="text-orange-500"/> },
                    { label: 'HR', key: 'heart_rate', unit: 'bpm', icon: <Heart size={14} className="text-red-500"/> },
                    { label: 'RR', key: 'respiratory_rate', unit: 'bpm', icon: <Wind size={14} className="text-green-500"/> },
                    { label: 'SpO2', key: 'spo2', unit: '%', icon: <Activity size={14} className="text-cyan-500"/> },
                    { label: 'Wt', key: 'weight', unit: 'kg' },
                    { label: 'Ht', key: 'height', unit: 'cm' },
                ].map((v) => (
                    <div key={v.key} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 flex items-center gap-1">
                            {v.icon} {v.label}
                        </span>
                        {isReadOnly ? (
                            <p className="text-sm font-bold text-slate-700">
                                {vitals[v.key as keyof typeof vitals] || '--'}
                                <span className="text-[10px] ml-0.5 font-medium text-slate-400">{v.unit}</span>
                            </p>
                        ) : (
                            <input
                                className="w-full text-center text-sm font-bold text-slate-700 bg-transparent outline-none border-b border-slate-200 focus:border-blue-400"
                                value={vitals[v.key as keyof typeof vitals]}
                                onChange={(e) => setVitals({ ...vitals, [v.key]: e.target.value })}
                                placeholder="--"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-5">

                    {/* Diagnosis */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Pill size={16} className="text-red-500" /> Diagnosis
                        </label>
                        <textarea
                            readOnly={isReadOnly}
                            className={`w-full h-24 p-4 rounded-xl outline-none text-sm border transition-all ${isReadOnly ? 'bg-slate-50 border-transparent' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500'}`}
                            placeholder="Diagnosis..."
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                        />
                    </div>

                    {/* Treatment */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Activity size={16} className="text-blue-500" /> Treatment
                        </label>
                        <textarea
                            readOnly={isReadOnly}
                            className={`w-full h-24 p-4 rounded-xl outline-none text-sm border transition-all ${isReadOnly ? 'bg-slate-50 border-transparent' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500'}`}
                            placeholder="Treatment plan..."
                            value={treatment}
                            onChange={(e) => setTreatment(e.target.value)}
                        />
                    </div>

                    {/* Prescription */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Pill size={16} className="text-purple-500" /> Prescription
                        </label>
                        <textarea
                            readOnly={isReadOnly}
                            className={`w-full h-24 p-4 rounded-xl outline-none text-sm border transition-all ${isReadOnly ? 'bg-slate-50 border-transparent' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500'}`}
                            placeholder="Medications..."
                            value={prescription}
                            onChange={(e) => setPrescription(e.target.value)}
                        />
                    </div>

                    {/* Notes */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Activity size={16} className="text-green-500" /> Notes
                        </label>
                        <textarea
                            readOnly={isReadOnly}
                            className={`w-full h-24 p-4 rounded-xl outline-none text-sm border transition-all ${isReadOnly ? 'bg-slate-50 border-transparent' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500'}`}
                            placeholder="Additional notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {!isReadOnly ? (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`w-full ${saving ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2`}
                        >
                            <Save size={18} /> {saving ? 'Saving...' : 'Complete Consultation & Save'}
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/appointments')}
                            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition-all"
                        >
                            Back to Schedule
                        </button>
                    )}
                </div>

                {/* Patient Sidebar */}
                <div className="space-y-4">
                    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
                        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Patient Profile</p>
                        <h2 className="text-xl font-bold mb-4">{appointment.patient_name}</h2>
                        <div className="space-y-3 border-t border-slate-800 pt-4 text-xs">
                            {[
                                { label: 'Patient ID', value: appointment.patient_id_display },
                                { label: 'Age', value: appointment.age ? `${appointment.age} yrs` : 'N/A' },
                                { label: 'Sex', value: appointment.sex || 'N/A' },
                                { label: 'Blood Type', value: appointment.blood_type || 'N/A' },
                                { label: 'Barangay', value: appointment.barangay || 'N/A' },
                                { label: 'Status', value: appointment.status },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between">
                                    <span className="text-slate-400">{label}</span>
                                    <span className="font-bold uppercase">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Allergies */}
                    {appointment.allergies && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">⚠ Allergies</p>
                            <p className="text-xs text-red-700">{appointment.allergies}</p>
                        </div>
                    )}

                    {/* Emergency Contact */}
                    {appointment.emergency_contact_name && (
                        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Emergency Contact</p>
                            <p className="text-sm font-bold text-slate-700">{appointment.emergency_contact_name}</p>
                            <p className="text-xs text-slate-500">{appointment.emergency_contact_number}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Consultation;