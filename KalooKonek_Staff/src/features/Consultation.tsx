import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Pill, Activity, CheckCircle, Thermometer, Heart, Wind, Gauge, Stethoscope, FileText } from 'lucide-react';
import axios from 'axios';

const Consultation: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Vitals state — field names match Django model exactly
    const [vitals, setVitals] = useState({
        blood_pressure: '',
        temperature: '',
        weight: '',
        height: '',
        heart_rate: '',
        respiratory_rate: '',
        spo2: '',
    });

    // Notes/diagnosis state — separate fields matching Django model
    const [notes, setNotes] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [prescription, setPrescription] = useState('');

    const isReadOnly = appointment?.status === 'FINISHED' || appointment?.status === 'COMPLETED';

    const getAuthHeader = () => {
        const session = localStorage.getItem('kka_admin_session');
        if (session) {
            const { token } = JSON.parse(session);
            return { Authorization: `Token ${token}` };
        }
        return {};
    };

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/mp/appointments/${id}/`, {
                    headers: getAuthHeader()
                });
                const data = response.data;
                setAppointment(data);

                // Populate vitals from backend
                setVitals({
                    blood_pressure: data.blood_pressure || '',
                    temperature: data.temperature || '',
                    weight: data.weight || '',
                    height: data.height || '',
                    heart_rate: data.heart_rate || '',
                    respiratory_rate: data.respiratory_rate || '',
                    spo2: data.spo2 || '',
                });

                // Populate text fields from backend
                setNotes(data.notes || '');
                setDiagnosis(data.diagnosis || '');
                setTreatment(data.treatment || '');
                setPrescription(data.prescription || '');
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
            // Send payload with field names matching Django model exactly
            await axios.post(`http://127.0.0.1:8000/mp/appointments/${id}/save/`,
                {
                    ...vitals,
                    notes,
                    diagnosis,
                    treatment,
                    prescription,
                    status: 'COMPLETED'
                },
                { headers: getAuthHeader() }
            );

            alert('Consultation saved successfully!');
            navigate('/staff/appointments');
        } catch (error: any) {
            console.error('Error saving consultation:', error);
            alert(`Failed to save: ${error.response?.data?.error || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading consultation details...</div>;
    if (!appointment) return <div className="p-10 text-center text-red-500 font-medium">Appointment not found.</div>;

    const vitalFields = [
        { label: 'BP', key: 'blood_pressure', unit: 'mmHg', ph: '120/80', icon: <Gauge size={14} className="text-blue-500" /> },
        { label: 'TEMP', key: 'temperature', unit: '°C', ph: '36.5', icon: <Thermometer size={14} className="text-orange-500" /> },
        { label: 'HR', key: 'heart_rate', unit: 'bpm', ph: '72', icon: <Heart size={14} className="text-red-500" /> },
        { label: 'RR', key: 'respiratory_rate', unit: 'bpm', ph: '16', icon: <Wind size={14} className="text-green-500" /> },
        { label: 'SPO2', key: 'spo2', unit: '%', ph: '98', icon: <Activity size={14} className="text-cyan-500" /> },
        { label: 'WT', key: 'weight', unit: 'kg', ph: '65', icon: null },
        { label: 'HT', key: 'height', unit: 'cm', ph: '170', icon: null },
    ];

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
                        <p className="text-sm text-gray-500">Appointment ID: {id}</p>
                    </div>
                </div>

                {isReadOnly && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl border border-green-100">
                        <CheckCircle size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                    </div>
                )}
            </div>

            {/* Vitals Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                {vitalFields.map((vital) => (
                    <div key={vital.key} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 flex items-center gap-1">
                            {vital.icon} {vital.label}
                        </span>
                        {isReadOnly ? (
                            <p className="text-sm font-bold text-slate-700">
                                {vitals[vital.key as keyof typeof vitals] || '--'}
                                <span className="text-[10px] ml-0.5 font-medium text-slate-400">{vital.unit}</span>
                            </p>
                        ) : (
                            <input
                                type="text"
                                value={vitals[vital.key as keyof typeof vitals]}
                                placeholder={vital.ph}
                                onChange={(e) => setVitals({ ...vitals, [vital.key]: e.target.value })}
                                className="w-full text-center text-sm font-bold text-slate-700 bg-slate-50 rounded-lg border border-slate-200 p-1 outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        )}
                        {!isReadOnly && (
                            <span className="text-[9px] text-slate-400 mt-0.5">{vital.unit}</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-5">

                    {/* Clinical Findings / Notes */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Activity size={16} className="text-blue-500" /> Clinical Findings
                        </label>
                        <textarea
                            readOnly={isReadOnly}
                            className={`w-full h-32 p-4 rounded-xl outline-none text-sm transition-all border ${
                                isReadOnly ? 'bg-slate-50 border-transparent text-slate-600' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500'
                            }`}
                            placeholder="Findings and observations..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* Diagnosis */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Stethoscope size={16} className="text-purple-500" /> Diagnosis
                        </label>
                        <textarea
                            readOnly={isReadOnly}
                            className={`w-full h-24 p-4 rounded-xl outline-none text-sm transition-all border ${
                                isReadOnly ? 'bg-slate-50 border-transparent text-slate-600' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-purple-400'
                            }`}
                            placeholder="Diagnosis..."
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                        />
                    </div>

                    {/* Treatment */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-green-500" /> Treatment
                        </label>
                        <textarea
                            readOnly={isReadOnly}
                            className={`w-full h-24 p-4 rounded-xl outline-none text-sm transition-all border ${
                                isReadOnly ? 'bg-slate-50 border-transparent text-slate-600' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-green-400'
                            }`}
                            placeholder="Treatment plan..."
                            value={treatment}
                            onChange={(e) => setTreatment(e.target.value)}
                        />
                    </div>

                    {/* Prescription */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Pill size={16} className="text-red-500" /> Prescription
                        </label>
                        <textarea
                            readOnly={isReadOnly}
                            className={`w-full h-24 p-4 rounded-xl outline-none text-sm transition-all border ${
                                isReadOnly ? 'bg-slate-50 border-transparent text-slate-600' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-red-400'
                            }`}
                            placeholder="Prescribed medicines and dosage..."
                            value={prescription}
                            onChange={(e) => setPrescription(e.target.value)}
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
                            onClick={() => navigate('/staff/appointments')}
                            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition-all"
                        >
                            Back to Schedule
                        </button>
                    )}
                </div>

                {/* Patient Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
                        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Patient Profile</p>
                        <h2 className="text-xl font-bold mb-4">{appointment.patient_name}</h2>
                        <div className="space-y-3 border-t border-slate-800 pt-4">
                            <div className="flex justify-between">
                                <span className="text-slate-400 text-xs">Patient ID</span>
                                <span className="text-xs font-bold">{appointment.patient_id_display || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 text-xs">Status</span>
                                <span className="text-xs font-bold uppercase">{appointment.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 text-xs">Attending Staff</span>
                                <span className="text-xs font-bold">{appointment.attending_staff_name || 'Unassigned'}</span>
                            </div>
                            {appointment.visit_date && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400 text-xs">Visit Date</span>
                                    <span className="text-xs font-bold">{appointment.visit_date}</span>
                                </div>
                            )}
                            {appointment.age && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400 text-xs">Age</span>
                                    <span className="text-xs font-bold">{appointment.age} yrs</span>
                                </div>
                            )}
                            {appointment.allergies && (
                                <div className="flex justify-between items-start gap-2">
                                    <span className="text-slate-400 text-xs shrink-0">Allergies</span>
                                    <span className="text-xs font-bold text-right text-red-400">{appointment.allergies}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Consultation;