import React, { useState } from 'react';
import { 
  Moon, QrCode, LogOut, HeartPulse, Pill, Calendar as CalendarIcon, 
  PhoneCall, ArrowRight, ArrowLeft, Download, ShieldAlert, Heart,
  Activity, Scale, AlertCircle, ChevronRight, User, Lock, Bell
} from 'lucide-react';

// SAMPLE DATA 
const USER_DATA = {
  name: "Maverick Sandoval",
  firstName: "Maverick",
  id: "2025-001",
  address: "Brgy. 172, Caloocan City",
  avatar: "🧑🏼‍🦳",
  bp: "120/80",
  sugar: "95 mg/dL",
  weight: "65 kg"
};

const ANNOUNCEMENTS = [
  { id: 1, type: 'URGENT', date: 'Today, 8:00 AM', title: 'Free Medical Mission', desc: 'The Barangay Health Center will be conducting free checkups and medicine distribution this weekend.' },
  { id: 2, type: 'PENSION', date: 'Yesterday', title: 'Social Pension Update', desc: 'The DSWD Social Pension payout schedule has been released for the 3rd quarter.' }
];

// SHARED UI COMPONENTS 
const Logo = () => (
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

const PageHeader = ({ title, subtitle, onBack }) => (
  <div className="flex items-start gap-4 mb-8">
    <button onClick={onBack} className="text-gray-400 hover:text-gray-900 mt-1 transition-colors"><ArrowLeft size={24} /></button>
    <div>
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);


// --- PAGES ---

// --- Dashboard ---
const KKUDashboard = ({ navigate }) => {
  const actions = [
    { icon: HeartPulse, label: 'Health Records', desc: 'View checkups', color: 'text-blue-500', bg: 'bg-blue-50', path: 'health' },
    { icon: Pill, label: 'Medicine', desc: 'Request refill', color: 'text-emerald-500', bg: 'bg-emerald-50', path: 'medicine' },
    { icon: CalendarIcon, label: 'Appointments', desc: 'OSCA Schedule', color: 'text-amber-500', bg: 'bg-amber-50', path: 'appointments' },
    { icon: PhoneCall, label: 'Emergency', desc: 'Contact Barangay', color: 'text-purple-500', bg: 'bg-purple-50', path: 'emergency' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mabuhay, <span className="text-red-600">{USER_DATA.firstName}!</span></h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-lg">Welcome to your official Barangay portal. Access your benefits, view announcements, and manage your health records here.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((act, i) => (
            <button key={i} onClick={() => navigate(act.path)} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group text-left">
              <div className={`${act.bg} ${act.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}><act.icon size={24} /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{act.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{act.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><ShieldAlert size={18} className="text-red-500" /> Barangay Announcements</h3>
            <button className="text-xs font-bold text-red-600 hover:text-red-700">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ANNOUNCEMENTS.map(ann => (
              <div key={ann.id} className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-sm border-t-4 ${ann.type === 'URGENT' ? 'border-t-red-500' : 'border-t-blue-500'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${ann.type === 'URGENT' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{ann.type}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{ann.date}</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">{ann.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{ann.desc}</p>
                <button className="text-xs font-bold text-red-600 flex items-center gap-1 hover:gap-2 transition-all">Read More <ArrowRight size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex justify-center lg:justify-end">
        <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden self-start">
          <div className="bg-red-600 p-6 text-white flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><ShieldAlert size={20} /></div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold opacity-90">Senior Citizen ID</p>
              <p className="font-medium text-sm">Caloocan City</p>
            </div>
          </div>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-orange-100 text-5xl flex items-center justify-center mb-4 relative shadow-inner border-4 border-white">
              {USER_DATA.avatar}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{USER_DATA.name}</h3>
            <p className="text-red-600 font-bold text-sm mt-1">ID: {USER_DATA.id}</p>
            <p className="text-xs text-gray-500 mt-2">{USER_DATA.address}</p>
            
            <button onClick={() => navigate('qrcode')} className="mt-6 w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-2xl p-6 flex flex-col items-center gap-3 transition-colors group cursor-pointer">
              <QrCode size={48} className="text-gray-800 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tap to Scan Verification</span>
            </button>
            <button className="mt-6 text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-2"><Download size={14} /> Download Digital Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Health Records  ---
const KKUHealthRecords = ({ navigate }) => (
  <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
    <PageHeader title="Health Records" subtitle="View your medical history and vital signs." onBack={() => navigate('dashboard')} />
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
        <Heart className="text-blue-500 mb-3" size={24} />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Blood Pressure</p>
        <p className="text-3xl font-bold text-gray-900">{USER_DATA.bp}</p>
        <span className="mt-2 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">Normal</span>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
        <Activity className="text-red-500 mb-3" size={24} />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Blood Sugar</p>
        <p className="text-3xl font-bold text-gray-900">{USER_DATA.sugar}</p>
        <span className="mt-2 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">Healthy</span>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
        <Scale className="text-amber-500 mb-3" size={24} />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Weight</p>
        <p className="text-3xl font-bold text-gray-900">{USER_DATA.weight}</p>
        <span className="mt-2 text-gray-400 text-[10px]">Last checked: Oct 15</span>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-900">Recent Checkups</h3>
        <button className="text-xs font-bold text-red-600 hover:text-red-700">Download Report</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Diagnosis/Purpose</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm bg-white">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">Oct 15, 2025</td>
              <td className="px-6 py-4 text-gray-600">Dr. Sean Lucino</td>
              <td className="px-6 py-4 text-gray-600">Annual Physical Exam</td>
              <td className="px-6 py-4 text-right"><button className="text-blue-600 hover:text-blue-800 font-bold text-xs">View Details</button></td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">Aug 02, 2025</td>
              <td className="px-6 py-4 text-gray-600">Dr. Espiritu</td>
              <td className="px-6 py-4 text-gray-600">Dental Cleaning</td>
              <td className="px-6 py-4 text-right"><button className="text-blue-600 hover:text-blue-800 font-bold text-xs">View Details</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- Medicine ---
const KKUMedicine = ({ navigate }) => (
  <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
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

// --- Appointments ---
const KKUAppointments = ({ navigate }) => (
  <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
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

// --- Emergency ---
const KKUEmergency = ({ navigate }) => (
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

// --- Settings ---
const KKUSettings = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'security', label: 'Account Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
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
};

// --- NEW RESPONSIVE QR CODE ---
const KKUQRCode = ({ navigate }) => (
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

// ROOT COMPONENT

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="font-sans text-gray-900 selection:bg-red-100 selection:text-red-900 bg-[#F8F9FA] min-h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <button onClick={() => setCurrentView('dashboard')} className="hover:opacity-80 transition-opacity"><Logo /></button>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-700 transition-colors hidden sm:block bg-gray-50 p-2 rounded-full"><Moon size={18} /></button>
          <button onClick={() => setCurrentView('settings')} className="text-gray-400 hover:text-gray-700 transition-colors mx-2 bg-gray-50 p-2 rounded-full"><User size={18} /></button>
          <Button variant="primary" onClick={() => alert("Sign Out triggered.")} className="!py-2 !px-4 !text-xs !rounded-full">
            Sign Out <LogOut size={14} />
          </Button>
        </div>
      </nav>
      
      {/* Main Container routes*/}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10 relative">
        {currentView === 'dashboard' && <KKUDashboard navigate={setCurrentView} />}
        {currentView === 'health' && <KKUHealthRecords navigate={setCurrentView} />}
        {currentView === 'medicine' && <KKUMedicine navigate={setCurrentView} />}
        {currentView === 'appointments' && <KKUAppointments navigate={setCurrentView} />}
        {currentView === 'emergency' && <KKUEmergency navigate={setCurrentView} />}
        {currentView === 'settings' && <KKUSettings navigate={setCurrentView} />}
        {currentView === 'qrcode' && <KKUQRCode navigate={setCurrentView} />}
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-gray-200 mt-auto bg-white text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[11px] text-gray-400 font-medium">© 2026 KalooKonek | Technological University of the Philippines</p>
        <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <span className="hover:text-gray-700 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-gray-700 cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-gray-700 cursor-pointer transition-colors">Help</span>
        </div>
      </footer>
    </div>
  );
}