import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30",
        secondary: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
        danger: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-red-500/30",
        success: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/30",
        ghost: "bg-transparent shadow-none hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
