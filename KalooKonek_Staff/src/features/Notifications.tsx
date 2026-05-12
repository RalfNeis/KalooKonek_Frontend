import React, { useState } from 'react';
import { Bell, Mail, Smartphone, MessageSquare } from 'lucide-react';

const Notifications: React.FC = () => {
  // Simple state to handle toggles locally
  const [settings, setSettings] = useState({
    patientUpdates: true,
    appointmentReminders: true,
    systemAlerts: false,
    emailDigest: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleRow = ({ 
    title, 
    desc, 
    icon: Icon, 
    isActive, 
    onClick 
  }: { 
    title: string, 
    desc: string, 
    icon: any, 
    isActive: boolean, 
    onClick: () => void 
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
      <div className="flex gap-4">
        <div className={`p-2 rounded-lg h-fit ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700">{title}</p>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onClick}
        className={`w-11 h-6 rounded-full transition-colors relative ${isActive ? 'bg-blue-600' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isActive ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Bell size={18} className="text-blue-500" /> 
          Platform Notifications
        </h3>
        
        <div className="space-y-1">
          <ToggleRow 
            title="Patient Updates" 
            desc="Get notified when a patient uploads new documents or lab results."
            icon={MessageSquare}
            isActive={settings.patientUpdates}
            onClick={() => toggle('patientUpdates')}
          />
          <ToggleRow 
            title="Appointment Reminders" 
            desc="Receive alerts 15 minutes before a scheduled consultation."
            icon={Smartphone}
            isActive={settings.appointmentReminders}
            onClick={() => toggle('appointmentReminders')}
          />
          <ToggleRow 
            title="System Alerts" 
            desc="Stay informed about platform maintenance and security updates."
            icon={Bell}
            isActive={settings.systemAlerts}
            onClick={() => toggle('systemAlerts')}
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Mail size={18} className="text-amber-500" /> 
          Email Communications
        </h3>
        <ToggleRow 
          title="Daily Summary" 
          desc="A morning digest of your total appointments and pending tasks."
          icon={Mail}
          isActive={settings.emailDigest}
          onClick={() => toggle('emailDigest')}
        />
      </div>
    </div>
  );
};

export default Notifications;