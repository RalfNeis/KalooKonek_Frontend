import React, { useState } from 'react';
import { Lock, ShieldCheck, ChevronRight } from 'lucide-react';

const AccountSecurity: React.FC = () => {
  const [passwords, setPasswords] = useState({ current: '', next: '' });

  const handleUpdate = () => {
    // This is where you'll call your Django API
    console.log("Updating password to:", passwords.next);
  };

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Lock size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Change Password</h3>
            <p className="text-xs text-slate-400">Update your password to keep your account secure.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-md">
          <input 
            type="password" 
            placeholder="Current Password" 
            className="p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="New Password" 
            className="p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            onChange={(e) => setPasswords({...passwords, next: e.target.value})}
          />
          <button 
            onClick={handleUpdate}
            className="w-full md:w-fit bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-900 transition-all active:scale-95"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* 2FA Card */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-colors cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <ShieldCheck size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Two-Factor Authentication</h3>
              <p className="text-xs text-slate-400">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase">
              Disabled
            </span>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;