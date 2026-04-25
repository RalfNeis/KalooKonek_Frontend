import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import AccountSecurity from '../features/AccountSecurity'; 
import Notifications from '../features/Notifications';

// We pass 'activeTab' as a prop now, or manage it here if the sidebar is integrated
const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        first_name: 'Raphael Nikko',
        last_name: 'Espiritu',
        birth_date: '1955-08-15'
    });

    // Sync with Django URL: http://127.0.0.1:8000/accounts/profile/
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/accounts/profile/`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        birth_date: data.birth_date
                    });
                }
            } catch (error) {
                console.error("Django server might be down:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        // Sync with Django URL: http://127.0.0.1:8000/accounts/settings/
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/accounts/settings/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) alert("Settings saved to Supabase!");
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    return (
        <div className="flex gap-12 max-w-6xl mx-auto px-6 py-8">
            {/* THIS IS YOUR "SETTINGS" SIDEBAR */}
            <aside className="w-64 space-y-2 shrink-0">
                <h2 className="text-xl font-bold text-slate-800 mb-6 px-2">Settings</h2>
                <button 
                    onClick={() => setActiveTab('profile')} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                    Profile Information
                </button>
                <button 
                    onClick={() => setActiveTab('security')} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'security' ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                    Account Security
                </button>
                <button 
                    onClick={() => setActiveTab('notifications')} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'notifications' ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                    Notifications
                </button>
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-1 min-w-0">
                {activeTab === 'profile' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-400">
                        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6">Profile Photo</h3>
                            <div className="flex items-center gap-6">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucino" alt="Profile" className="w-20 h-20 rounded-full border-2 border-white shadow-md" />
                                <div className="flex gap-3">
                                    <button className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">Upload New</button>
                                    <button className="px-5 py-2.5 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50">Remove</button>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6">Personal Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <input className="p-3 border rounded-xl text-sm" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
                                <input className="p-3 border rounded-xl text-sm" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
                                <input type="date" className="col-span-2 p-3 border rounded-xl text-sm" value={formData.birth_date} onChange={(e) => setFormData({...formData, birth_date: e.target.value})} />
                            </div>
                            <div className="mt-6 text-right">
                                <button onClick={handleSave} className="bg-[#E32636] text-white px-8 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#C52230]">Save Changes</button>
                            </div>
                        </section>
                    </div>
                )}
                {activeTab === 'security' && <AccountSecurity />}
                {activeTab === 'notifications' && <Notifications />}
            </main>
        </div>
    );
};

export default Settings;