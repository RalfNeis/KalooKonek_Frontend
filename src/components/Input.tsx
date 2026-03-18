import React from 'react';

interface InputProps {
    label: string;
    placeholder?: string;
    type?: string;
}

const Input: React.FC<InputProps> = ({ label, placeholder, type = "text"}) => {
    return(
        <div className = 'flex flex-col gap-1 w-full'>
            <label className = 'text-[10px] font-bold text-gray-400 uppercase tracking-tight'>
                {label}
            </label>
            <input
                type = {type}
                placeholder = {placeholder}
                className ='p-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-1 focus:ring-red-400 outline-none transition-all placeholder:text-gray-300'>      
                </input>
        </div>
    );
};

export default Input;

