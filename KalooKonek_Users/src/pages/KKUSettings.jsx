import React, { useState } from 'react';
import { User, Lock, Bell, ChevronRight, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';

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

export default function KKUSettings({ navigate = () => {} }) {
  const [activeTab, setActiveTab] = useState('profile');
  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'security', label: 'Account Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300 p-6">
      <PageHeader title="Account Settings" subtitle="Manage your profile, security, and preferences." onBack={() => navigate('dashboard')} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <aside className="md:col-span-4 lg:col-span-3">
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-xl transition-all ${activeTab === tab.id ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' : 'text-gray-600 hover:bg-white hover:shadow-sm border border-transparent'}`}>
                <div className="flex items-center gap-3">
                  <tab.icon size={18} className={activeTab === tab.id ? 'text-red-500' : 'text-gray-400'} />
                  {tab.label}
                </div>
                {activeTab === tab.id && <ChevronRight size={16} />}
              </button>
            ))}
          </nav>
        </aside>

        <div className="md:col-span-8 lg:col-span-9">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="First Name" defaultValue={USER_DATA.firstName} />
                  <Input label="Last Name" defaultValue="Espiritu" />
                </div>
                <Input label="Date of Birth" defaultValue="1955-08-15" icon={CalendarIcon} />
                <Input label="Barangay" defaultValue={USER_DATA.address} />
                <div className="flex justify-end pt-4"><Button>Save Changes</Button></div>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-5 border-b border-gray-100 pb-3">Language Preferences</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex-1 flex items-start gap-3 p-4 border-2 border-red-500 bg-red-50 rounded-xl cursor-pointer transition-all">
                    <input type="radio" name="lang" defaultChecked className="mt-0.5 w-4 h-4 text-red-600 focus:ring-red-500 accent-red-600" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">English</p>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Default interface language.</p>
                    </div>
                  </label>
                  <label className="flex-1 flex items-start gap-3 p-4 border-2 border-transparent border-gray-100 hover:border-gray-200 hover:bg-gray-50 rounded-xl cursor-pointer transition-all">
                    <input type="radio" name="lang" className="mt-0.5 w-4 h-4 text-red-600 focus:ring-red-500 accent-red-600" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Filipino</p>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">I-translate ang interface sa Tagalog.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-sm font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Change Password</h3>
              <div className="max-w-md space-y-4">
                <Input type="password" label="Current Password" placeholder="••••••••" />
                <Input type="password" label="New Password" placeholder="••••••••" />
                <Input type="password" label="Confirm New Password" placeholder="••••••••" />
                <div className="pt-4">
                    <Button>Update Password</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-sm font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { title: 'Barangay Announcements', desc: 'Get notified about urgent news and medical missions.' },
                  { title: 'Appointment Reminders', desc: 'Receive alerts for upcoming OSCA schedules.' }, 
                  { title: 'Pension Updates', desc: 'Know when your DSWD Social Pension is ready.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                        <p className="text-[11px] text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}