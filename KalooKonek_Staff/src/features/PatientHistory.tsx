import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, FileText } from 'lucide-react';

interface Record {
    id: number;
    visit_date: string;
    appointment_time: string;
    status: string;
    diagnosis: string;
    attending_staff_name: string;
}

const PatientHistory: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [patientName, setPatientName] = useState("");
    const [displayId, setDisplayId] = useState("");
    const [records, setRecords] = useState<Record[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const sessionData = JSON.parse(localStorage.getItem('kka_admin_session') || '{}');
                const token = sessionData.token;

                // Backend now returns { patient_name, display_id, records }
                const response = await axios.get(`http://127.0.0.1:8000/mp/patient-history/${id}/`, {
                    headers: { 'Authorization': `Token ${token}` }
                });
                
                setPatientName(response.data.patient_name);
                setDisplayId(response.data.display_id);
                setRecords(response.data.records);
            } catch (error) {
                console.error("Failed to load patient history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [id]);

    if (loading) {
        return <div className="p-10 text-center font-bold text-gray-400">Loading History...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Patient History: <span className="text-[#E53E3E]">{patientName}</span>
                    </h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-1">
                        ID: {displayId}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-6 bg-gray-50/50 px-6 py-4 border-b border-gray-100 text-[10px] font-bold text-gray-400 tracking-widest">
                    <span>DATE</span>
                    <span>TIME</span>
                    <span className="col-span-2">DIAGNOSIS</span>
                    <span>ATTENDING STAFF</span>
                    <span className="text-right">ACTION</span>
                </div>

                <div className="flex flex-col min-h-[300px]">
                    {records.length > 0 ? (
                        records.map((record) => (
                            <div key={record.id} className="grid grid-cols-6 px-6 py-5 items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <div className="text-[13px] font-bold text-gray-800">
                                    {record.visit_date || '---'}
                                </div>
                                <div className="text-[12px] text-gray-500 font-medium">
                                    {record.appointment_time || '---'}
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <FileText size={14} className="text-blue-500" />
                                    <span className="text-[13px] font-medium text-gray-700 truncate pr-4">
                                        {record.diagnosis || 'No diagnosis recorded'}
                                    </span>
                                </div>
                                <div className="text-[12px] font-bold text-slate-600">
                                    {record.attending_staff_name}
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        onClick={() => navigate(`/staff/consultation/${record.id}`)}
                                        className="bg-blue-50 text-blue-500 text-[10px] font-black px-4 py-2 rounded-lg hover:bg-blue-100 transition-all tracking-wider uppercase"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <FileText size={24} className="text-gray-300" />
                            </div>
                            <p className="text-sm font-bold">No Medical Records Found</p>
                            <p className="text-xs mt-1">This patient hasn't had any consultations yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientHistory;
