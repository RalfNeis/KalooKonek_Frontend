import React from 'react';
import { User, Shield, Bell, Camera } from 'lucide-react';

const Settings: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex gap-12">
                {/* Sidebar Navigation */}
                <aside className="w-64 space-y-2">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 px-2">Settings</h2>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm">
                        <User size={18} /> Profile Information
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 rounded-xl font-bold text-sm transition-colors">
                        <Shield size={18} /> Account Security
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 rounded-xl font-bold text-sm transition-colors">
                        <Bell size={18} /> Notifications
                    </button>
                </aside>

                {/* Settings Form */}
                <main className="flex-1 space-y-8">
                    {/* Profile Photo Section */}
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

                    {/* Personal Details */}
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
                </main>
            </div>
        </div>
    );
};

export default Settings;