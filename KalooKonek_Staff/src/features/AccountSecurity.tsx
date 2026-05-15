import React, { useState } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const AccountSecurity: React.FC = () => {
    const [passwords, setPasswords] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwords.new_password !== passwords.confirm_password) {
            alert("New passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const sessionData = JSON.parse(localStorage.getItem('kka_admin_session') || '{}');
            const token = sessionData.token;

            // 1. Update Django backend (also verifies current_password)
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/accounts/settings/change-password/`, 
                {
                    current_password: passwords.current_password,
                    new_password: passwords.new_password
                },
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}` 
                    } 
                }
            );

            // 2. Synchronize with Supabase Auth to prevent login mismatch
            const { error: sbError } = await supabase.auth.updateUser({
                password: passwords.new_password
            });

            if (sbError) {
                console.error("Supabase password sync failed:", sbError);
                throw new Error("Local password updated, but Supabase sync failed: " + sbError.message);
            }

            alert("Password updated successfully across all systems!");
            setPasswords({ current_password: '', new_password: '', confirm_password: '' });
        } catch (error: any) {
            alert(error.response?.data?.error || error.message || "Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Account Security</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                {/* Input fields for current_password, new_password, and confirm_password */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                    <input 
                        type="password" 
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm"
                        value={passwords.current_password}
                        onChange={(e) => setPasswords({...passwords, current_password: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                    <input 
                        type="password" 
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm"
                        value={passwords.new_password}
                        onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                    <input 
                        type="password" 
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm"
                        value={passwords.confirm_password}
                        onChange={(e) => setPasswords({...passwords, confirm_password: e.target.value})}
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-[#E32636] text-white px-8 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#C52230] disabled:opacity-50"
                >
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </section>
    );
};

export default AccountSecurity;