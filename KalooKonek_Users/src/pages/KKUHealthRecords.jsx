import React from 'react';
import { Heart, Activity, Scale, ArrowLeft } from 'lucide-react';

// Inlined for standalone compilation
const USER_DATA = {
  name: "Juan Cruz",
  firstName: "Juan",
  id: "2025-001",
  address: "Brgy. 172, Caloocan City",
  avatar: "🧑🏼‍🦳",
  bp: "120/80",
  sugar: "95 mg/dL",
  weight: "65 kg"
};

const PageHeader = ({ title, subtitle, onBack }) => (
  <div className="flex items-start gap-4 mb-8">
    <button onClick={onBack} className="text-gray-400 hover:text-gray-900 mt-1 transition-colors"><ArrowLeft size={24} /></button>
    <div>
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default function KKUHealthRecords({ navigate = () => {} }) {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300 p-6">
      <PageHeader title="Health Records" subtitle="View your medical history and vital signs." onBack={() => navigate('dashboard')} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <Heart className="text-blue-500 mb-3" size={24} />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Blood Pressure</p>
          <p className="text-3xl font-bold text-gray-900">{USER_DATA.bp}</p>
          <span className="mt-2 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">Normal</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <Activity className="text-red-500 mb-3" size={24} />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Blood Sugar</p>
          <p className="text-3xl font-bold text-gray-900">{USER_DATA.sugar}</p>
          <span className="mt-2 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">Healthy</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <Scale className="text-amber-500 mb-3" size={24} />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Weight</p>
          <p className="text-3xl font-bold text-gray-900">{USER_DATA.weight}</p>
          <span className="mt-2 text-gray-400 text-[10px]">Last checked: Oct 15</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Recent Checkups</h3>
          <button className="text-xs font-bold text-red-600 hover:text-red-700">Download Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Diagnosis/Purpose</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm bg-white">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">Oct 15, 2025</td>
                <td className="px-6 py-4 text-gray-600">Dr. Sarah Gomez</td>
                <td className="px-6 py-4 text-gray-600">Annual Physical Exam</td>
                <td className="px-6 py-4 text-right"><button className="text-blue-600 hover:text-blue-800 font-bold text-xs">View Details</button></td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">Aug 02, 2025</td>
                <td className="px-6 py-4 text-gray-600">Dr. Reyes</td>
                <td className="px-6 py-4 text-gray-600">Dental Cleaning</td>
                <td className="px-6 py-4 text-right"><button className="text-blue-600 hover:text-blue-800 font-bold text-xs">View Details</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}