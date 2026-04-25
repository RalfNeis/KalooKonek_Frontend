import React, { useState } from 'react';
import { User, Shield, Bell, Camera } from 'lucide-react';
import AccountSecurity from '../features/AccountSecurity'; 
import Notifications from '../features/Notifications'; // 1. Added this import

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex gap-12">
                {/* Fixed Sidebar */}
                <aside className="w-64 space-y-2">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 px-2">Settings</h2>
                    
                    <button 
                        onClick={() => setActiveTab('profile')} 
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                            activeTab === 'profile' ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                    >
                        <User size={18} /> Profile Information
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('security')} 
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                            activeTab === 'security' ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                    >
                        <Shield size={18} /> Account Security
                    </button>
                    
                    {/* 2. Added onClick here so it actually changes the state */}
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                            activeTab === 'notifications' ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                </aside>

                {/* Dynamic Content Area */}
                <main className="flex-1">
                    {/* 3. Changed ternary to separate conditional blocks */}
                    
                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-6">Profile Photo</h3>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center border-2 border-white shadow-inner relative">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucino" alt="Profile" className="w-full h-full rounded-full" />
                                        <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md border border-slate-100"><Camera size={14} className="text-slate-400" /></div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">Upload New</button>
                                        <button className="px-5 py-2.5 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50">Remove</button>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-6">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <input type="text" placeholder="First Name" className="p-3 border border-slate-200 rounded-xl text-sm" defaultValue="Raphael Nikko" />
                                    <input type="text" placeholder="Last Name" className="p-3 border border-slate-200 rounded-xl text-sm" defaultValue="Espiritu" />
                                    <input type="date" className="col-span-2 p-3 border border-slate-200 rounded-xl text-sm text-slate-600" defaultValue="1955-08-15" />
                                </div>
                                <div className="mt-6 text-right">
                                    <button className="bg-[#E32636] text-white px-8 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#C52230]">Save Changes</button>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && <AccountSecurity />}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && <Notifications />}
                </main>
            </div>
        </div>
    );
};

export default Settings;