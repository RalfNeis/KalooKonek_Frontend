import React, { useState } from 'react';
import { User, Shield, Bell, Camera } from 'lucide-react';
import AccountSecurity from './AccountSecurity'; // Ensure the path is correct

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

    // Helper for button styling
    const getBtnClass = (tab: string) => 
        `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === tab 
            ? "bg-red-50 text-[#E32636]" 
            : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        }`;

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex gap-12">
                {/* Sidebar Navigation */}
                <aside className="w-64 space-y-2">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 px-2">Settings</h2>
                    
                    <button onClick={() => setActiveTab('profile')} className={getBtnClass('profile')}>
                        <User size={18} /> Profile Information
                    </button>
                    
                    <button onClick={() => setActiveTab('security')} className={getBtnClass('security')}>
                        <Shield size={18} /> Account Security
                    </button>
                    
                    <button onClick={() => setActiveTab('notifications')} className={getBtnClass('notifications')}>
                        <Bell size={18} /> Notifications
                    </button>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1">
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            {/* Profile Photo Section */}
                            <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-6">Profile Photo</h3>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center border-2 border-white shadow-inner relative">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucino" alt="Profile" className="w-full h-full rounded-full" />
                                        <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md border border-slate-100">
                                            <Camera size={14} className="text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Upload New</button>
                                        <button className="px-5 py-2.5 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">Remove</button>
                                    </div>
                                </div>
                            </section>

                            {/* Personal Details */}
                            <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-6">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">First Name</label>
                                        <input type="text" placeholder="First Name" className="p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500" defaultValue="Raphael Nikko" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Last Name</label>
                                        <input type="text" placeholder="Last Name" className="p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500" defaultValue="Espiritu" />
                                    </div>
                                    <div className="col-span-2 flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Birth Date</label>
                                        <input type="date" className="p-3 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500" defaultValue="1955-08-15" />
                                    </div>
                                </div>
                                <div className="mt-6 text-right">
                                    <button className="bg-[#E32636] text-white px-8 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#C52230] transition-all">Save Changes</button>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'security' && <AccountSecurity />}

                    {activeTab === 'notifications' && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center py-20">
                            <Bell size={40} className="mx-auto text-slate-200 mb-4" />
                            <h3 className="font-bold text-slate-800">Notification Settings</h3>
                            <p className="text-sm text-slate-400">Manage how you receive alerts and updates.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Settings;