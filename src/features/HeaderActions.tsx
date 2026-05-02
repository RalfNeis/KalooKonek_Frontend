import React from 'react';
import { Search, QrCode } from 'lucide-react'; 

interface HeaderActionsProps {
  adminName?: string;
  // 1. Add the onSearch prop to handle text changes
  onSearch: (value: string) => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ adminName, onSearch }) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Personalized Welcome Message */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, <span className="text-[#E53E3E]">{adminName || "Admin"}</span>!
        </h1>
        <p className="text-sm text-gray-500">
          Manage senior citizens and appointments for your barangay today.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Scan Patient QR Card */}
        <button className="flex-1 bg-[#E53E3E] rounded-2xl p-6 flex items-center justify-between text-white hover:bg-red-700 transition-all shadow-lg shadow-red-100/50 group text-left">
          <div>
            <h2 className="text-xl font-bold">Scan Patient QR</h2>
            <p className="text-sm opacity-80">Identify senior & view history</p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl group-hover:scale-110 transition-transform">
            <QrCode size={32} />
          </div>
        </button>

        {/* Manual Lookup Card */}
        <div className="flex-[1.5] bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">
            Manual Lookup
          </label>
          <div className="flex gap-2">
            {/* 2. Connect the input to the onSearch function */}
            <input 
              type="text" 
              placeholder="Enter ID No. or Name..." 
              onChange={(e) => onSearch(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
            />
            <button className="bg-[#0F172A] p-3 rounded-xl text-white hover:bg-slate-800 transition-transform active:scale-95">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderActions;