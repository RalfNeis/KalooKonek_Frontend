import React from 'react';
import Input from '../components/Input';
import Badge from '../components/Badge';

const CurrentPatient: React.FC = () => {
    return (
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full'>
            
            {/* HEADER SECTION */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Current Patient</span>
                </div>
                
                {/* 1. CLEAR: Just a clickable word, Gray Chateau color */}
                <button className="text-[11px] font-bold text-[#A0AEC0] hover:text-[#E32636] transition-colors uppercase tracking-widest cursor-pointer border-none bg-transparent p-0">
                    CLEAR
                </button>
            </div>

            <div className='flex flex-col md:flex-row'>
                {/* PROFILE SECTION */}
                <div className='w-full md:w-1/3 p-10 flex flex-col items-center text-center'>
                    <div className='relative w-28 h-28 mb-6'>
                        <div className='w-full h-full bg-orange-100 rounded-full border-4 border-white shadow-md overflow-hidden'>
                            <img src='https://api.dicebear.com/7.x/avataaars/svg?seed=Nikko' alt='avatar' />
                        </div>
                        <span className="absolute bottom-2 right-2 block h-5 w-5 rounded-full ring-4 ring-white bg-green-500" />
                    </div>
                    
                    <h2 className='text-2xl font-extrabold text-slate-800 leading-tight'>Raphael Nikko Espiritu</h2>
                    <p className='text-sm font-medium text-gray-400 mt-1 mb-6'>ID: 2025-001 | Age: 21</p>
                    
                    <div className='flex gap-2.5'>
                        <Badge text='Hypertension' variant='danger' />
                        <Badge text='Diabetic' variant='warning' />
                    </div>
                </div>

                {/* FORM SECTION */}
                <div className='flex-1 p-10 bg-[#FAFAFA] border-l border-gray-50'>
                    <h3 className='text-[11px] font-bold text-gray-400 mb-8 uppercase tracking-widest'>New Medical Entry</h3>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
                        <Input label='BP (mmHg)' placeholder='120/80' />
                        <Input label='Temp (°C)' placeholder='36.5' />
                        <Input label='Weight (kg)' placeholder='65' />
                    </div>

                    <div className="space-y-8">
                        <Input label='Diagnosis / Notes' placeholder='Patient complains of...' />
                        <Input label='Prescription (Optional)' placeholder='Medicine Name & Dosage' />
                    </div>

                    {/* ACTION FOOTER */}
                    <div className='mt-10 flex justify-end gap-8 items-center'>
                        
                        {/* 2. VIEW HISTORY: Just a clickable word, Gray Chateau color */}
                        <button className="text-[14px] font-bold text-[#718096] hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent p-0">
                            View History
                        </button>
                        
                        {/* 3. SAVE RECORD: Alizarin Crimson button */}
                        <button className="bg-[#E32636] text-white px-8 py-3 rounded-xl text-[16px] font-bold shadow-md shadow-red-100 hover:bg-[#C52230] transition-all active:scale-95 cursor-pointer">
                            Save Record
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Essential export to fix the "no default export" error
export default CurrentPatient;