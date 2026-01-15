import React from 'react';

const LoadingScreen = ({ message = "Initializing Atmosphere..." }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F172A] text-white overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[80px] animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>

            {/* Central Loader */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Orbital Spinner */}
                <div className="relative w-24 h-24">
                    {/* Inner Core */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-md opacity-80 animate-pulse"></div>
                    <div className="absolute inset-2 bg-[#0F172A] rounded-full z-10 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                    </div>

                    {/* Orbiting Ring 1 */}
                    <div className="absolute inset-0 border-2 border-transparent border-t-blue-400/50 border-r-blue-400/50 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>

                    {/* Orbiting Ring 2 */}
                    <div className="absolute -inset-4 border border-transparent border-b-purple-400/30 border-l-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
                </div>

                {/* Text Scramble / Fade */}
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 animate-pulse">
                        A E T H E R
                    </h2>
                    <p className="text-sm text-blue-300/60 font-mono tracking-widest">{message}</p>
                </div>

                {/* Loading Bar */}
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-1/2 animate-[shimmer_1.5s_infinite_linear] relative">
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[slide_1s_infinite]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
