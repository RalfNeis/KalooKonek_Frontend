import React from 'react';
import PatientRow from '../components/PatientRow';
import type { RecentPatient } from '../types/patient';

// Mock Data (In a real app, this comes from an API)
const dummyPatients: RecentPatient[] = [
  { id: '1', time: '09:30 AM', name: 'John Russel Gallanosa', purpose: 'General Checkup', status: 'COMPLETED' },
  { id: '2', time: '09:15 AM', name: 'Maverick Sandoval', purpose: 'Dental', status: 'COMPLETED' },
];

const PatientTable: React.FC = () => {
  return (
    <div className= "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className = "grid grid-cols-4 bg-gray-50/50 px-6 py-3 border-b border-gray-100">
        {['TIME', 'NAME', 'PURPOSE', 'STATUS'].map((head) => (
          <span key = {head} className="text-[10px] font-bold text-gray-400 tracking-widest">
            {head}
          </span>
        ))}
      </div>

      {/* Table Body - This is where the magic happens */}
      <div className = "flex flex-col">
        {dummyPatients.map((patient) => (
          <PatientRow key={patient.id} {...patient} />
        ))}
      </div>
    </div>
  );
};

export default PatientTable;