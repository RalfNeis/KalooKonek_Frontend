import React from 'react';
import { QrCode, ArrowLeft } from 'lucide-react';

export const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="bg-red-600 text-white p-2 rounded-xl flex items-center justify-center shadow-sm">
      <QrCode size={20} />
    </div>
    <div>
      <h1 className="font-bold text-gray-900 text-lg leading-none tracking-tight">KalooKonek</h1>
      <p className="text-[8px] uppercase tracking-widest font-semibold mt-0.5 text-gray-500">Caloocan Senior Citizen Portal</p>
    </div>
  </div>
);

export const Input = ({ label, type = "text", placeholder, icon: Icon, rightElement, defaultValue }) => (
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

export const Button = ({ children, onClick, variant = 'primary', className = '', fullWidth = false, type = "button" }) => {
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

export const PageHeader = ({ title, subtitle, onBack }) => (
  <div className="flex items-start gap-4 mb-8">
    <button onClick={onBack} className="text-gray-400 hover:text-gray-900 mt-1 transition-colors"><ArrowLeft size={24} /></button>
    <div>
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);