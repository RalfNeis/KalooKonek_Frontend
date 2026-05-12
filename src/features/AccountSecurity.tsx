import React, { useState } from 'react';
import axios from 'axios';

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

            const response = await axios.post(
                'http://127.0.0.1:8000/accounts/profile/change-password/', 
                {
                    current_password: passwords.current_password,
                    new_password: passwords.new_password
                },
                { headers: { 'Authorization': `Token ${token}` } }
            );

            alert(response.data.message);
            setPasswords({ current_password: '', new_password: '', confirm_password: '' });
        } catch (error: any) {
            alert(error.response?.data?.error || "Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
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