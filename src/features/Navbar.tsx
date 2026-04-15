import React from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
      : "text-gray-400 hover:text-gray-600 transition-colors";

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white border-b border-gray-100 shadow-sm mb-8">
      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <div className="bg-[#1E40AF] p-2 rounded-lg">
          <div className="grid grid-cols-2 gap-0.5">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />)}
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#1E293B] leading-none">KalooKonek</h1>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medical Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-8 text-xs font-bold uppercase tracking-wide">
        <NavLink to="/dashboard" className={getLinkClass}>Dashboard</NavLink>
        <NavLink to="/directory" className={getLinkClass}>Patient Directory</NavLink>
        <NavLink to="/appointments" className={getLinkClass}>Appointments</NavLink>
        <NavLink to="/settings" className={getLinkClass}> Settings </NavLink>
      </div>

      {/* Profile & Controls */}
      <div className="flex items-center gap-6">
        <Moon size={18} className="text-gray-400 cursor-pointer" />
        
        <div className="flex items-center gap-2 border-l pl-6 border-gray-100">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border border-white shadow-sm overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucino" alt="Dr" />
          </div>
          <span className="text-xs font-bold text-slate-700">Dr. Lucino</span>
        </div>

        {/* Sign Out Button */}
        <button className="bg-[#E32636] text-white flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-md hover:bg-[#C52230] transition-all">
          Sign Out <LogOut size={14} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;