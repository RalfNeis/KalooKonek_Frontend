import React from 'react';
import { Calendar as CalendarIcon, LogOut, ArrowLeft } from 'lucide-react';

const PageHeader = ({ title, subtitle, onBack }) => (
  <div className="flex items-start gap-4 mb-8">
    <button onClick={onBack} className="text-gray-400 hover:text-gray-900 mt-1 transition-colors"><ArrowLeft size={24} /></button>
    <div>
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const Input = ({ label, type = "text", placeholder, icon: Icon, rightElement, defaultValue }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>}
    <div className="relative">
      {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon size={16} /></div>}
      <input 
        type={type} 
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`w-full border border-gray-200 rounded-xl py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${Icon ? 'pl-10' : 'pl-4'} ${rightElement ? 'pr-20' : 'pr-4'}`}
      />
      {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
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

export default function KKUAppointments({ navigate = () => {} }) {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300 p-6">
      <PageHeader title="Appointments" subtitle="Schedule your next visit to the Health Center." onBack={() => navigate('dashboard')} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-4">Upcoming Schedule</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5 hover:border-red-200 transition-colors">
            <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-center min-w-[70px] border border-red-100">
              <p className="text-[10px] font-bold uppercase tracking-widest">Nov</p>
              <p className="text-2xl font-black leading-none mt-1">20</p>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-base mb-1">Dental Checkup</h4>
              <p className="text-xs text-gray-500">Barangay Health Center, Room 4</p>
              <p className="text-xs font-semibold text-red-600 mt-2">9:00 AM - 10:00 AM</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-lg hover:bg-red-50" title="Cancel Appointment">
              <LogOut size={16} className="rotate-90" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-5 border-b border-gray-100 pb-4">Book New Appointment</h3>
            <form onSubmit={e => { e.preventDefault(); alert("Appointment requested successfully."); }} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Department</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm bg-gray-50 focus:ring-2 focus:ring-red-500 outline-none text-gray-800">
                  <option>General Medicine</option>
                  <option>Dental</option>
                  <option>OSCA ID Renewal</option>
                </select>
              </div>
              <Input label="Preferred Date" placeholder="mm/dd/yyyy" icon={CalendarIcon} />
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Notes (Optional)</label>
                <textarea rows="3" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-red-500 outline-none resize-none text-gray-800"></textarea>
              </div>
              <Button type="submit" fullWidth className="mt-2">Submit Request</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}