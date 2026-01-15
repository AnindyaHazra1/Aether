import React from 'react';

const SettingsPage = ({ units, setUnits }) => {

    const toggleTemp = (value) => {
        setUnits(prev => ({ ...prev, temp: value }));
    };

    const toggleWind = (value) => {
        setUnits(prev => ({ ...prev, wind: value }));
    };

    const togglePressure = (value) => {
        setUnits(prev => ({ ...prev, pressure: value }));
    };

    const toggleTime = (value) => {
        setUnits(prev => ({ ...prev, time: value }));
    };

    return (
        <div className="flex flex-col h-full gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="shrink-0">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Customize your weather experience</p>
            </div>

            {/* Settings Container */}
            <div className="flex-1 bg-[#202B3B]/60 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 border border-white/10 shadow-2xl overflow-y-auto custom-scrollbar">

                {/* Units Section */}
                <section className="mb-8 md:mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4 md:mb-6 flex items-center gap-3">
                        <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </span>
                        Units
                    </h2>

                    <div className="space-y-4 md:space-y-6">
                        {/* Temperature Unit */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/50 p-4 md:p-5 rounded-2xl border border-white/5">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-1">Temperature</h3>
                                <p className="text-sm text-gray-400">Choose your preferred temperature unit</p>
                            </div>
                            <div className="flex bg-[#1f2937] p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                                <button
                                    onClick={() => toggleTemp('metric')}
                                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${units.temp === 'metric' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Celsius (°C)
                                </button>
                                <button
                                    onClick={() => toggleTemp('imperial')}
                                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${units.temp === 'imperial' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Fahrenheit (°F)
                                </button>
                            </div>
                        </div>

                        {/* Wind Speed Unit */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/50 p-4 md:p-5 rounded-2xl border border-white/5">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-1">Wind Speed</h3>
                                <p className="text-sm text-gray-400">Select wind speed measurement</p>
                            </div>
                            <div className="flex bg-[#1f2937] p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                                <button
                                    onClick={() => toggleWind('km/h')}
                                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${units.wind === 'km/h' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    km/h
                                </button>
                                <button
                                    onClick={() => toggleWind('m/s')}
                                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${units.wind === 'm/s' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    m/s
                                </button>
                                <button
                                    onClick={() => toggleWind('mph')}
                                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${units.wind === 'mph' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    mph
                                </button>
                            </div>
                        </div>

                        {/* Atmospheric Pressure */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/50 p-4 md:p-5 rounded-2xl border border-white/5">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-1">Pressure</h3>
                                <p className="text-sm text-gray-400">Select atmospheric pressure unit</p>
                            </div>
                            <div className="flex bg-[#1f2937] p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                                <button
                                    onClick={() => togglePressure('hPa')}
                                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${units.pressure === 'hPa' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    hPa
                                </button>
                                <button
                                    onClick={() => togglePressure('inHg')}
                                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${units.pressure === 'inHg' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    inHg
                                </button>
                            </div>
                        </div>

                        {/* Time Format */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/50 p-4 md:p-5 rounded-2xl border border-white/5">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-1">Time Format</h3>
                                <p className="text-sm text-gray-400">Choose between 12-hour and 24-hour time</p>
                            </div>
                            <div className="flex bg-[#1f2937] p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                                <button
                                    onClick={() => toggleTime('12h')}
                                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${units.time === '12h' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    12 Hour
                                </button>
                                <button
                                    onClick={() => toggleTime('24h')}
                                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${units.time === '24h' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    24 Hour
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-4 md:mb-6 flex items-center gap-3">
                        <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                        About Application
                    </h2>
                    <div className="bg-[#111827]/50 p-6 md:p-8 rounded-2xl border border-white/5 text-gray-300 relative overflow-hidden group">
                        {/* Subtle Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full blur-2xl transition-all duration-700 group-hover:bg-purple-500/20"></div>

                        <div className="relative z-10 flex flex-col gap-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Weather Forecasting</h3>
                                <p className="text-gray-400 leading-relaxed max-w-2xl">
                                    A next-generation weather dashboard designed for clarity and precision.
                                    Providing real-time atmospheric data, advanced forecasting, and immersive visualizations
                                    to help you stay ahead of the elements.
                                </p>
                            </div>

                            <div className="h-px bg-white/10 w-full"></div>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Version</span>
                                    <span className="text-white font-mono mt-1">v2.0.0-beta</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">Status</span>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                        System Operational
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default SettingsPage;
