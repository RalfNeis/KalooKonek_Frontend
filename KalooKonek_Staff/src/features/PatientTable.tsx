import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientRow from '../components/PatientRow';

interface PatientDirectoryProps {
    searchTerm?: string;
}

const PatientTable: React.FC<PatientDirectoryProps> = ({ searchTerm: externalSearch }) => {
    const [patients, setPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('All Barangays');
    const [selectedStatus, setSelectedStatus] = useState('Filter Status');

    useEffect(() => {
        if (externalSearch !== undefined) {
            setLocalSearchTerm(externalSearch);
        }
    }, [externalSearch]);

    useEffect(() => {
        const fetchDirectory = async () => {
            setIsLoading(true);
            try {
                const savedSession = localStorage.getItem('kka_admin_session');
                const sessionData = savedSession ? JSON.parse(savedSession) : null;
                const token = sessionData?.token;

                if (!token) {
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8000/mp/directory/`, {
                    params: {
                        search: localSearchTerm,
                        // This handles passing the exact selected Brgy to your Django backend
                        barangay: selectedBarangay === 'All Barangays' ? '' : selectedBarangay,
                        status: selectedStatus === 'Filter Status' ? '' : selectedStatus
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                
                setPatients(response.data);
            } catch (error) {
                console.error("❌ Directory fetch failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchDirectory, 300);
        return () => clearTimeout(debounceTimer);
    }, [localSearchTerm, selectedBarangay, selectedStatus]);

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                    type="text"
                    placeholder="Search name or ID..."
                    className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                />
                
                <select 
                    className="p-3 border border-gray-200 rounded-xl text-sm outline-none cursor-pointer bg-white"
                    value={selectedBarangay}
                    onChange={(e) => setSelectedBarangay(e.target.value)}
                >
                    <option value="All Barangays">All Barangays</option>
                    {/* FIXED: Dynamically renders Brgy. 100 through Brgy. 110 */}
                    {Array.from({ length: 11 }, (_, i) => 100 + i).map(num => (
                        <option key={num} value={`Brgy. ${num}`}>
                            Brgy. {num}
                        </option>
                    ))}
                </select>

                <select 
                    className="p-3 border border-gray-200 rounded-xl text-sm outline-none cursor-pointer bg-white"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="Filter Status">Filter Status</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                </select>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-5 bg-gray-50/50 px-6 py-3 border-b border-gray-100 text-[10px] font-bold text-gray-400 tracking-widest">
                    <span>PATIENT NAME & ID</span>
                    <span>AGE / GENDER</span>
                    <span>BARANGAY</span>
                    <span>LAST VISIT</span>
                    <span className="text-right">ACTIONS</span>
                </div>

                <div className="flex flex-col min-h-50">
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center p-10 text-center animate-pulse text-xs text-gray-400">
                            Updating Directory...
                        </div>
                    ) : patients.length > 0 ? (
                        patients.map((patient: any) => (
                            <PatientRow 
                                key={patient.id} 
                                id={patient.display_id || patient.id} 
                                numeric_id={patient.id}
                                name={`${patient.first_name} ${patient.last_name}`} 
                                age={patient.age}
                                gender={patient.gender}
                                barangay={patient.barangay}
                                last_visit_date={patient.last_visit}
                                medical_tags={patient.age >= 60 ? ["SENIOR"] : []}
                            />
                        ))
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-10 text-center text-gray-400 text-xs italic">
                            No patients found {localSearchTerm && `for "${localSearchTerm}"`}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">
                Total: {patients.length} Registered Patients
            </div>
        </div>
    );
};

export default PatientTable;