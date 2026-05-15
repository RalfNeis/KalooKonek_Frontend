import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PatientRowProps {
    id: string;
    numeric_id: number;  // ← added
    name: string;
    age: number;
    gender: string;
    barangay: string;
    last_visit_date?: string;
    last_visit_type?: string;
    medical_tags?: string[];
}

const PatientRow: React.FC<PatientRowProps> = ({ 
    name, id, numeric_id, age, gender, barangay, last_visit_date, last_visit_type, medical_tags  // ← added numeric_id
}) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-5 px-6 py-5 items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 shrink-0 flex items-center justify-center text-orange-600 font-bold text-xs">
                    {name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-800">{name}</span>
                        {medical_tags?.map(tag => (
                            <span key={tag} className="bg-red-50 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">ID: {id}</span>
                </div>
            </div>

            <div className="flex flex-col">
                <span className="text-[13px] font-bold text-gray-700">{age} yrs</span>
                <span className="text-[11px] text-gray-400">{gender}</span>
            </div>

            <div className="text-[12px] text-gray-500 font-medium">
                {barangay}
            </div>

            <div className="flex flex-col">
                <span className="text-[12px] text-gray-600 font-semibold">{last_visit_date || '---'}</span>
                <span className="text-[10px] text-gray-400">{last_visit_type}</span>
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={() => navigate(`/consultation/${numeric_id}`)}  // ← changed from id
                    className="bg-blue-50 text-blue-500 text-[10px] font-black px-4 py-2 rounded-lg hover:bg-blue-100 transition-all tracking-wider uppercase cursor-pointer"
                >
                    Open Record
                </button>
            </div>
        </div>
    );
};

export default PatientRow;