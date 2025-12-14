import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`w-full ${className}`}>
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
            <input
                className={`w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                    }`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
