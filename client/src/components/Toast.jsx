import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-green-500/20 border-green-500/50 text-green-100',
        error: 'bg-red-500/20 border-red-500/50 text-red-100',
        info: 'bg-blue-500/20 border-blue-500/50 text-blue-100',
    };

    const icons = {
        success: (
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center px-4 py-3 rounded-lg border backdrop-blur-xl shadow-2xl animate-fade-in-down ${bgColors[type] || bgColors.info} transition-all duration-300 transform hover:scale-105`}>
            {icons[type]}
            <span className="font-medium tracking-wide">{message}</span>
            <button onClick={onClose} className="ml-4 text-white/50 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default Toast;
