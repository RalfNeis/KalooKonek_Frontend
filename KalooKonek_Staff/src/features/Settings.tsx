import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Camera } from 'lucide-react';
import axios from 'axios';
import AccountSecurity from '../features/AccountSecurity'; 
import Notifications from '../features/Notifications';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    
    // State for Profile Info - Added phone_number to match your backend model
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        birth_date: '',
        phone_number: ''
    });

    // Fetch actual profile details using the new endpoint we identified
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const sessionData = JSON.parse(localStorage.getItem('kka_admin_session') || '{}');
                const response = await axios.get('http://127.0.0.1:8000/accounts/profile/details/', {
                    headers: { 'Authorization': `Token ${sessionData.token}` }
                });
                
                setProfileData({
                    first_name: response.data.first_name || '',
                    last_name: response.data.last_name || '',
                    birth_date: response.data.birth_date || '',
                    phone_number: response.data.phone_number || ''
                });
            } catch (error) {
                console.error("Failed to load profile data:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const sessionData = JSON.parse(localStorage.getItem('kka_admin_session') || '{}');
            const token = sessionData.token;

            // Hits the update_profile_info view in your backend
            await axios.put('http://127.0.0.1:8000/accounts/profile/update/', profileData, {
                headers: { 'Authorization': `Token ${token}` }
            });

            alert("Profile updated successfully!");
        } catch (error: any) {
            console.error("Update error:", error.response?.data || error.message);
            alert("Failed to update profile details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex gap-12">
                {/* Sidebar Navigation */}
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
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
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
                                        <button className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                            Upload New
                                        </button>
                                        <button className="px-5 py-2.5 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-all">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Personal Details Section */}
                            <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-6">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">First Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-200 transition-all" 
                                            value={profileData.first_name}
                                            onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Last Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-200 transition-all" 
                                            value={profileData.last_name}
                                            onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Phone Number</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-200 transition-all" 
                                            value={profileData.phone_number}
                                            onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Birth Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-red-200 transition-all" 
                                            value={profileData.birth_date}
                                            onChange={(e) => setProfileData({...profileData, birth_date: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 text-right">
                                    <button 
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="bg-[#E32636] text-white px-8 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#C52230] transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
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