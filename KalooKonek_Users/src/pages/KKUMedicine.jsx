import React from 'react';
import { Pill, ArrowRight, Calendar as CalendarIcon, AlertCircle, ArrowLeft } from 'lucide-react';

const PageHeader = ({ title, subtitle, onBack }) => (
  <div className="flex items-start gap-4 mb-8">
    <button onClick={onBack} className="text-gray-400 hover:text-gray-900 mt-1 transition-colors"><ArrowLeft size={24} /></button>
    <div>
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', fullWidth = false, type = "button" }) => {
  const base = "font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 py-3 px-5 focus:outline-none focus:ring-4 focus:ring-red-100";
  const variants = {
    primary: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    outline: "border border-gray-200 hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-600 py-2 px-3"
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {children}
    </button>
  );
};

export default function KKUMedicine({ navigate = () => {} }) {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300 p-6">
      <PageHeader title="Medicine Cabinet" subtitle="Manage your maintenance medicine and requests." onBack={() => navigate('dashboard')} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 text-blue-500 p-3 rounded-xl"><Pill size={24} /></div>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">Available</span>
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Biogesic</h3>
          <p className="text-sm text-red-600 font-bold mb-4">10 mg</p>
          <div className="space-y-2 mb-6">
            <p className="text-xs text-gray-500 flex items-center gap-2"><ArrowRight size={12}/> Once a day (Morning)</p>
            <p className="text-xs text-gray-500 flex items-center gap-2"><CalendarIcon size={12}/> Next Refill: Dec 20, 2025</p>
          </div>
          <Button variant="outline" fullWidth>Request Refill</Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 text-blue-500 p-3 rounded-xl"><Pill size={24} /></div>
            <span className="bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">Low Stock</span>
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Paracetamol</h3>
          <p className="text-sm text-red-600 font-bold mb-4">500 mg</p>
          <div className="space-y-2 mb-6">
            <p className="text-xs text-gray-500 flex items-center gap-2"><ArrowRight size={12}/> Twice a day (After meals)</p>
            <p className="text-xs text-amber-600 font-medium flex items-center gap-2"><AlertCircle size={12}/> Refill Needed Soon</p>
          </div>
          <Button variant="primary" fullWidth>Request Refill Now</Button>
        </div>
      </div>
    </div>
  );
}