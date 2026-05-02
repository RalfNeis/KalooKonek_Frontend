import React from 'react';

interface PatientRowProps {
    id: string;
    name: string;
    age: number;
    gender: string;
    barangay: string;
    last_visit_date?: string;
    last_visit_type?: string;
    medical_tags?: string[]; // To handle the "HYPERTENSION" tag
}

const PatientRow: React.FC<PatientRowProps> = ({ 
    name, id, age, gender, barangay, last_visit_date, last_visit_type, medical_tags 
}) => {
    return (
        <div className="grid grid-cols-5 px-6 py-5 items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            
            {/* COLUMN 1: PATIENT NAME & ID */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 shrink-0" /> {/* Avatar Circle */}
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

            {/* COLUMN 2: AGE / GENDER */}
            <div className="flex flex-col">
                <span className="text-[13px] font-bold text-gray-700">{age} yrs</span>
                <span className="text-[11px] text-gray-400">{gender}</span>
            </div>

            {/* COLUMN 3: BARANGAY */}
            <div className="text-[12px] text-gray-500 font-medium">
                {barangay}
            </div>

            {/* COLUMN 4: LAST VISIT */}
            <div className="flex flex-col">
                <span className="text-[12px] text-gray-600 font-semibold">{last_visit_date || '---'}</span>
                <span className="text-[10px] text-gray-400">{last_visit_type}</span>
            </div>

            {/* COLUMN 5: ACTIONS */}
            <div className="flex justify-end">
                <button className="bg-blue-50 text-blue-500 text-[10px] font-black px-4 py-2 rounded-lg hover:bg-blue-100 transition-all tracking-wider uppercase">
                    Open Record
                </button>
            </div>
        </div>
    );
};

export default PatientRow;