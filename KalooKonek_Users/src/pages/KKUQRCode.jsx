import React from 'react';
import { ArrowLeft, ShieldAlert, QrCode, Download } from 'lucide-react';

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

export default function KKUQRCode({ navigate = () => {} }) {
  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center py-10 min-h-[80vh] justify-center relative animate-in zoom-in-95 duration-300">
      <button onClick={() => navigate('dashboard')} className="absolute top-0 md:top-4 left-0 md:left-4 text-gray-400 hover:text-gray-900 bg-white p-2 rounded-full shadow-sm z-10"><ArrowLeft size={24} /></button>
      
      <div className="flex flex-col lg:flex-row gap-12 w-full items-center justify-center">
        {/* Card Column - Maintains mobile design */}
        <div className="w-full flex justify-center lg:justify-end lg:w-1/2">
          <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden transform transition-all relative">
            <div className="bg-gradient-to-br from-red-700 to-red-500 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><ShieldAlert size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold opacity-90">Digital Senior ID</p>
                  <p className="font-medium text-sm">Caloocan City</p>
                </div>
              </div>
            </div>
            <div className="p-10 flex flex-col items-center">
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 w-full aspect-square flex items-center justify-center mb-8 shadow-inner relative group">
                <QrCode size={180} className="text-gray-900" />
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  <div className="w-full h-1 bg-red-500/50 shadow-[0_0_20px_4px_rgba(239,68,68,0.5)] absolute top-0 animate-[scan_2.5s_infinite_linear]"></div>
                </div>
              </div>
              <div className="text-center w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{USER_DATA.name}</h3>
                <p className="text-red-600 font-bold text-sm tracking-widest bg-red-50 py-2 rounded-lg mb-2 border border-red-100">ID: {USER_DATA.id}</p>
                <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1.5"><ShieldAlert size={14}/> Official Digital Record</p>
              </div>
            </div>
          </div>
        </div>

        {/* PC Context/Info Column - Hidden on mobile, visible on lg screens */}
        <div className="hidden lg:flex flex-col text-left pl-4 lg:w-1/2">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Your Digital ID</h2>
          <p className="text-gray-600 text-base mb-10 leading-relaxed max-w-md">
            Present this secure QR code at affiliated establishments, health centers, and pharmacies for instant verification of your senior citizen status and benefits.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl"><QrCode size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Instant Verification</h4>
                <p className="text-sm text-gray-500 mt-1 max-w-sm">No need to bring physical cards. Authorised personnel can scan this code to retrieve your health records.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl"><ShieldAlert size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Highly Secure</h4>
                <p className="text-sm text-gray-500 mt-1 max-w-sm">Equipped with a cryptographic signature that prevents fraud and protects your personal identity.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl"><Download size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Offline Support</h4>
                <p className="text-sm text-gray-500 mt-1 max-w-sm">Download a copy directly to your phone's gallery to use even when you don't have internet access.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <Button onClick={() => alert('Downloading offline copy...')} className="py-3.5 px-8 text-sm">Download Offline Copy</Button>
            <Button onClick={() => alert('Opening print dialog...')} variant="outline" className="py-3.5 px-8 text-sm bg-white">Print ID</Button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
          @keyframes scan {
              0% { top: 0; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
          }
      `}} />
    </div>
  );
}