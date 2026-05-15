import React from 'react';
import PatientTable from './PatientTable';

interface DirectoryProps {
  searchTerm?: string;
}

const PatientDirectory: React.FC<DirectoryProps> = ({ searchTerm }) => {
  return (
    <main className="max-w-6xl mx-auto px-6 space-y-4 mt-8">
      {/* Title & Action Header */}
      <div className="flex justify-between items-end ml-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Directory</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
            Registered Senior Citizens
          </p>
        </div>
      </div>

      {/* The full table with filtering logic */}
      <div className="pt-4">
        <PatientTable searchTerm={searchTerm} />
      </div>
    </main>
  );
};

export default PatientDirectory;