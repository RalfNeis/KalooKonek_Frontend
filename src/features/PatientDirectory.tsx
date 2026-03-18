import React from 'react';

const PatientDirectory: React.FC = () => {
    const patients = [
        { name: 'Ricardo Dalisay', id: '2025-001', age: '68', gender: 'Male', brgy: 'Brgy. 172', visit: 'Oct 15, 2025', desc: 'General Checkup' },
        { name: 'Maria Clara Santos', id: '2024-088', age: '72', gender: 'Female', brgy: 'Brgy. 171', visit: 'Sep 02, 2025', desc: 'Prescription Refill', tag: 'HYPERTENSION' }
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header Area */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Patient Directory</h1>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider">Registered Senior Citizens</p>
                </div>
                <button className="bg-[#E32636] text-white px-4 py-2 rounded-lg font-bold text-[11px] flex items-center gap-2 hover:bg-[#C52230] transition-all uppercase">
                    ⊞ Scan Patient QR
                </button>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                <input type="text" placeholder="Search by name or ID..." className="md:col-span-2 p-2.5 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-red-50 outline-none" />
                <select className="p-2.5 border border-gray-100 rounded-lg bg-white text-gray-500 text-sm"><option>All Barangays</option></select>
                <select className="p-2.5 border border-gray-100 rounded-lg bg-white text-gray-500 text-sm"><option>Filter Status</option></select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Patient Name & ID</th>
                            <th className="px-6 py-3">Age / Gender</th>
                            <th className="px-6 py-3">Barangay</th>
                            <th className="px-6 py-3">Last Visit</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {patients.map((p, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 border border-white shadow-inner" />
                                    <div>
                                        <p className="font-bold text-slate-800 text-xs">{p.name}</p>
                                        <p className="text-[10px] text-gray-400">ID: {p.id}</p>
                                    </div>
                                    {p.tag && <span className="text-[9px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold">{p.tag}</span>}
                                </td>
                                <td className="px-6 py-3">
                                    <p className="font-medium text-slate-800 text-xs">{p.age} yrs</p>
                                    <p className="text-[10px] text-gray-400">{p.gender}</p>
                                </td>
                                <td className="px-6 py-3 text-gray-600 text-xs">{p.brgy}</td>
                                <td className="px-6 py-3">
                                    <p className="text-xs text-slate-800">{p.visit}</p>
                                    <p className="text-[10px] text-gray-400">{p.desc}</p>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors uppercase">
                                        Open Record
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Showing 2 of 12,450 patients
                    </span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-white transition-colors uppercase">
                            Previous
                        </button>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-[10px] font-bold text-slate-800 bg-white hover:bg-gray-50 transition-colors uppercase">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDirectory;