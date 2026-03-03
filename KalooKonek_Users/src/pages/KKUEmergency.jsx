import React from 'react';
import { ArrowLeft, AlertCircle, PhoneCall, HeartPulse, ShieldAlert } from 'lucide-react';

export default function KKUEmergency({ navigate }) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center py-10 animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => navigate('dashboard')} className="self-start text-gray-400 hover:text-gray-900 mb-8 flex items-center gap-2 font-medium text-sm">
          <ArrowLeft size={20} /> Back to Dashboard
      </button>
      
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-3">
          <AlertCircle className="text-red-600" size={32} /> Emergency
        </h2>
        <p className="text-sm text-gray-500">Immediate access to medical professionals.</p>
      </div>

      <button onClick={() => alert("SOS Alert triggered!")} className="relative w-64 h-64 rounded-full bg-red-600 hover:bg-red-700 shadow-[0_0_50px_rgba(220,38,38,0.5)] flex flex-col items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 group mb-12">
        <div className="absolute inset-0 rounded-full border-4 border-red-400 opacity-50 animate-ping"></div>
        <PhoneCall size={64} className="mb-2 group-hover:animate-bounce" />
        <span className="text-4xl font-black tracking-widest">SOS</span>
        <span className="text-[10px] font-semibold mt-2 opacity-80 uppercase tracking-widest">Press for 3 Seconds</span>
      </button>

      <p className="text-sm text-gray-600 text-center mb-8 max-w-md bg-gray-100 py-3 px-4 rounded-xl border border-gray-200">
          This will alert the Barangay Quick Response Team and your listed guardian immediately.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 cursor-pointer hover:border-red-300 hover:shadow-md transition-all group">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors"><HeartPulse size={24} /></div>
          <div>
            <h4 className="font-bold text-gray-900 text-base">Ambulance</h4>
            <p className="text-xs text-gray-500 mt-0.5">Tap to call hotline</p>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><ShieldAlert size={24} /></div>
          <div>
            <h4 className="font-bold text-gray-900 text-base">Barangay Security</h4>
            <p className="text-xs text-gray-500 mt-0.5">Tap to call tanods</p>
          </div>
        </div>
      </div>
    </div>
  );
}