import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileText, CalendarDays } from 'lucide-react';

interface Patient {
    id: string;
    patient_name: string;
    display_id: string;
    status: string;
    age?: number | null;
    sex?: string | null;
    blood_type?: string | null;
    barangay?: string | null;
    allergies?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_number?: string | null;
}

interface SearchResult {
    id: string;
    name: string;
    display_id: string;
    barangay: string | null;
    allergies: string | null;
    address: string | null;
    blood_type: string | null;
    age: number | null;
    sex: string | null;
    emergency_contact_name: string | null;
    emergency_contact_number: string | null;
}

interface medicalHistory {
    id: number;
    visit_date: string;
    diagnosis: string;
    treatment: string;
    prescription: string;
    status: string;
    appointment_time?: string;
}

interface DashboardProps {
    externalSearchTerm?: string;
    qrPatient?: any;                    // patient object passed in from QRScanner via App
    onQrPatientConsumed?: () => void;   // clears qrPatient after Dashboard loads it
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard: React.FC<DashboardProps> = ({ externalSearchTerm, qrPatient, onQrPatientConsumed }) => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [medicalHistory, setmedicalHistory] = useState<medicalHistory[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getAuthHeader = () => {
        const session = localStorage.getItem('kka_admin_session');
        if (session) {
            const { token } = JSON.parse(session);
            return { Authorization: `Bearer ${token}` };
        }
        return {};
    };

    const fetchmedicalHistory = async (patientId: string) => {
        setHistoryLoading(true);
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/mp/patient-history/${patientId}/`,
                { headers: getAuthHeader() }
            );
            
            // The backend returns a flat array of records directly
            if (Array.isArray(res.data)) {
                setmedicalHistory(res.data);
            } else {
                console.error('API did not return an array:', res.data);
                setmedicalHistory([]);
            }
        } catch (err) {
            console.error('History fetch error:', err);
            setmedicalHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const selectPatient = (data: SearchResult) => {
        const p: Patient = {
            id: data.id,
            patient_name: data.name,
            display_id: data.display_id,
            status: 'ACTIVE',
            age: data.age,
            sex: data.sex,
            blood_type: data.blood_type,
            barangay: data.barangay,
            allergies: data.allergies,
            emergency_contact_name: data.emergency_contact_name,
            emergency_contact_number: data.emergency_contact_number,
        };
        setPatient(p);
        setShowDropdown(false);
        setSearchResults([]);
        fetchmedicalHistory(data.id);
    };

    const handleManualLookup = async (query: string) => {
        if (!query || query.length < 3) return;
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/mp/manual-lookup/?query=${query}`,
                { headers: getAuthHeader() }
            );
            const results = res.data;
            if (!Array.isArray(results) || results.length === 0) {
                setPatient(null); setSearchResults([]); setShowDropdown(false);
                return;
            }
            if (results.length === 1) {
                selectPatient(results[0]);
            } else {
                setSearchResults(results);
                setShowDropdown(true);
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setPatient(null); setSearchResults([]); setShowDropdown(false);
            }
        }
    };

    useEffect(() => {
        if (externalSearchTerm) handleManualLookup(externalSearchTerm);
    }, [externalSearchTerm]);

    // Consume patient passed in from the QRScanner in App/HeaderActions
    useEffect(() => {
        if (qrPatient) {
            selectPatient({
                id: qrPatient.id,
                name: qrPatient.name,
                display_id: qrPatient.display_id,
                age: qrPatient.age,
                sex: qrPatient.sex,
                blood_type: qrPatient.blood_type,
                barangay: qrPatient.barangay,
                allergies: qrPatient.allergies,
                address: null,
                emergency_contact_name: qrPatient.emergency_contact_name ?? null,
                emergency_contact_number: qrPatient.emergency_contact_number ?? null,
            });
            if (onQrPatientConsumed) onQrPatientConsumed();
        }
    }, [qrPatient]);

    useEffect(() => {
        const fetchCurrent = async () => {
            const headers = getAuthHeader();
            if (!(headers as any).Authorization) { setLoading(false); return; }
            try {
                const res = await axios.get("http://127.0.0.1:8000/mp/appointments/?tab=Today's List", { headers });
                const active = res.data.find((p: any) => p.status !== 'FINISHED' && p.status !== 'COMPLETED');
                if (active) setPatient(active);
            } catch (err) {
                console.error('Sync Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrent();
    }, []);

    if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Clinical Data...</div>;

    const capitalize = (s?: string | null) =>
        s ? s.charAt(0).toUpperCase() + s.slice(1) : 'N/A';

    return (
        <div className="w-full">

            {/* Search Dropdown */}
            {showDropdown && searchResults.length > 0 && (
                <div ref={dropdownRef} className="relative z-50 mb-4">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                {searchResults.length} patients found
                            </p>
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="text-gray-300 hover:text-gray-500 text-xs font-bold transition-colors"
                            >
                                ✕ Close
                            </button>
                        </div>
                        <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                            {searchResults.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => selectPatient(result)}
                                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-red-50 transition-colors text-left group"
                                >
                                    <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-base shrink-0">
                                        👤
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{result.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">ID: {result.display_id}</p>
                                    </div>
                                    {result.barangay && (
                                        <span className="text-[9px] text-gray-300 font-medium shrink-0 hidden sm:block">
                                            {result.barangay}
                                        </span>
                                    )}
                                    <span className="text-[#E32636] text-xs font-black shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Select →
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Patient Card or Empty State */}
            {patient ? (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">

                        {/* LEFT — Patient Avatar & Switch */}
                        <div className="w-full lg:w-64 shrink-0 bg-white border-r border-gray-100 p-8 flex flex-col items-center text-center gap-4">
                            <div className="relative mt-2">
                                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white">
                                    👤
                                </div>
                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h1 className="text-lg font-black text-slate-800 leading-tight">{patient.patient_name}</h1>
                                <p className="text-gray-400 font-bold text-[10px] mt-1 uppercase tracking-widest">
                                    ID: {patient.display_id}
                                </p>
                            </div>
                            <span className="px-2.5 py-1 bg-green-100 text-green-600 text-[8px] font-black rounded-lg uppercase tracking-wider">
                                Stable
                            </span>
                            <button
                                onClick={() => { setPatient(null); setmedicalHistory([]); }}
                                className="text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-[#E32636] transition-colors mt-2"
                            >
                                ← Switch Patient
                            </button>
                        </div>

                        {/* RIGHT — Content */}
                        <div className="flex-1 p-8">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                                Medical Record & Profile
                            </p>

                            {/* ── PATIENT RECORD INFO (replaces vitals grid) ── */}
                            <div className="bg-slate-900 text-white rounded-2xl p-5 mb-6">
                                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Patient Record</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 border-t border-slate-800 pt-4 text-xs">
                                    {[
                                        { label: 'Patient ID', value: patient.display_id },
                                        { label: 'Age', value: patient.age ? `${patient.age} yrs` : 'N/A' },
                                        { label: 'Sex', value: capitalize(patient.sex) },
                                        { label: 'Blood Type', value: patient.blood_type?.toUpperCase() || 'N/A' },
                                        { label: 'Barangay', value: patient.barangay || 'N/A' },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex flex-col gap-0.5">
                                            <span className="text-slate-400 text-[9px] uppercase tracking-wider">{label}</span>
                                            <span className="font-bold uppercase text-white">{value}</span>
                                        </div>
                                    ))}
                                </div>
                                {patient.allergies && patient.allergies !== 'None' && (
                                    <div className="mt-3 pt-3 border-t border-slate-800">
                                        <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">⚠ Allergies: </span>
                                        <span className="text-xs text-red-300">{patient.allergies}</span>
                                    </div>
                                )}
                            </div>

                            {/* ── MEDICAL HISTORY (replaces 4 boxes) ── */}
                            <div className="mb-6">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Medical History
                                </p>

                                <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                                    {historyLoading ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full mx-auto mb-2" />
                                            <p className="text-slate-400 text-xs">Loading records...</p>
                                        </div>
                                    ) : medicalHistory.length === 0 ? (
                                        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-slate-400 text-xs italic">No medical records found.</p>
                                        </div>
                                    ) : (
                                        medicalHistory.map((record) => (
                                            <div
                                                key={record.id}
                                                className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-100 transition-all shadow-sm group"
                                            >
                                                {/* Time / Date */}
                                                <div className="text-center min-w-15">
                                                    <p className="font-bold text-sm text-slate-800">
                                                        {record.appointment_time || 'TBA'}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">{record.visit_date}</p>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {/* Status badge */}
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                                        record.status === 'COMPLETED'
                                                            ? 'bg-slate-100 text-slate-500'
                                                            : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                        {record.status === 'COMPLETED' ? 'Finished' : record.status}
                                                    </span>

                                                    <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5 font-medium">
                                                        <CalendarDays size={12} className="text-slate-300 shrink-0" />
                                                        <span className="truncate">
                                                            {record.diagnosis
                                                                ? record.diagnosis.slice(0, 40) + (record.diagnosis.length > 40 ? '...' : '')
                                                                : 'Medical Consultation'}
                                                        </span>
                                                    </p>
                                                </div>

                                                {/* View button */}
                                                <button
                                                    onClick={() => navigate(`/consultation/${record.id}`)}
                                                    className="shrink-0 flex items-center gap-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                                                >
                                                    <FileText size={12} />
                                                    View
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* ── ACTIONS ── */}
                            <div className="flex items-center justify-end gap-4">
                                <button
                                    onClick={() => navigate(`/consultation/new?patient=${patient.id}`)}
                                    className="bg-[#E32636] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-[#C52230] hover:-translate-y-0.5 active:scale-95 transition-all"
                                >
                                    Consult
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