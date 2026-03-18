import React from 'react';
import type { RecentPatient } from '../types/patient';

const PatientRow: React.FC<RecentPatient> = ({ time, name, purpose, status }) => {
  return (
    <div className = 'grid grid-cols-4 py-4 px-6 border-b border-gray-50 items-center hover:bg-gray-50 transition-colors'>
      <span className = 'text-sm text-gray-400'>{time}</span>
      <span className = 'text-sm font-bold text-slate-800'>{name}</span>
      <span className = 'text-sm text-gray-500'>{purpose}</span>
      <div className = 'flex justify-start'>
        <span className = {`px-3 py-1 rounded text-[10px] font-bold ${
          status === 'COMPLETED' ? 'bg-green-50 text-green-500' : 'bg-yellow-50 text-yellow-600'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default PatientRow;