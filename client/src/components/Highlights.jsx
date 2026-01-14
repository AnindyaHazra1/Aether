import React from 'react';

const HighlightCard = ({ title, value, unit, children, footer, className }) => (
    <div className={`bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl ${className}`}>
        <h3 className="text-gray-400 text-sm font-medium mb-4">{title}</h3>
        <div className="flex-1 flex flex-col justify-between">
            {children}
        </div>
    </div>
);

const Highlights = ({ weatherData, aqiData, forecastData, forecastError, units }) => {
    if (!weatherData) return null;

    const { main, wind, visibility, sys, clouds, dt, timezone } = weatherData;

    // Helper: Convert Temperature
    const getTemp = (temp) => {
        return units.temp === 'imperial' ? Math.round((temp * 9 / 5) + 32) : Math.round(temp);
    };

    // Helper: Convert Wind Speed (from m/s)
    const getWindSpeed = () => {
        const speedMs = wind.speed;
        if (units.wind === 'km/h') return (speedMs * 3.6).toFixed(1);
        if (units.wind === 'mph') return (speedMs * 2.237).toFixed(1);
        return speedMs.toFixed(1); // m/s
    };

    // Helper: Convert Pressure (from hPa)
    const getPressure = () => {
        const hPa = main.pressure;
        if (units.pressure === 'inHg') return (hPa * 0.02953).toFixed(2);
        return hPa;
    };

    // Calculate Simulated UV Index
    // Based on: Time variance + Cloud Cover reduction
    const calculateUV = () => {
        const now = dt; // current unix time
        const sunrise = sys.sunrise;
        const sunset = sys.sunset;

        if (now < sunrise || now > sunset) return 0; // Night time

        // Find solar noon (approx midway)
        const solarNoon = sunrise + (sunset - sunrise) / 2;
        const hoursFromNoon = Math.abs(now - solarNoon) / 3600;

        // Base UV at noon (max ~11)
        let baseUV = 11 - (hoursFromNoon * 1.5); // Drops as we move away from noon
        if (baseUV < 0) baseUV = 0;

        // Cloud factor: 100% clouds = 0.2 factor
        const cloudFactor = 1 - (clouds.all / 125);

        return (baseUV * cloudFactor).toFixed(2);
    };

    const uvIndex = calculateUV();

    // Unix timestamp + timezone offset to Local Time String
    const formatTime = (timestamp) => {
        return new Date((timestamp + timezone) * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });
    };

    const visibilityKm = (visibility / 1000).toFixed(1);

    // Standard EPA AQI Calculation based on PM2.5 (µg/m³)
    const calculateStandardAQI = (pm25) => {
        const c = pm25;
        // Breakpoints: [C_low, C_high, I_low, I_high]
        const breakpoints = [
            [0.0, 12.0, 0, 50],
            [12.1, 35.4, 51, 100],
            [35.5, 55.4, 101, 150],
            [55.5, 150.4, 151, 200],
            [150.5, 250.4, 201, 300],
            [250.5, 500.4, 301, 500]
        ];

        for (let i = 0; i < breakpoints.length; i++) {
            const [cLo, cHi, iLo, iHi] = breakpoints[i];
            if (c <= cHi) {
                return Math.round(((iHi - iLo) / (cHi - cLo)) * (c - cLo) + iLo);
            }
        }
        // Fallback for extreme values > 500
        return 500;
    };

    const pm25Val = aqiData?.list?.[0]?.components?.pm2_5 || 0;
    const standardAQI = calculateStandardAQI(pm25Val);

    // Get color/text based on standard scale
    const getAQIStatus = (val) => {
        if (val <= 50) return { text: "Good", color: "text-green-400" };
        if (val <= 100) return { text: "Moderate", color: "text-yellow-400" };
        if (val <= 150) return { text: "Unhealthy for SG", color: "text-orange-400" }; // SG = Sensitive Groups
        if (val <= 200) return { text: "Unhealthy", color: "text-red-400" };
        if (val <= 300) return { text: "Very Unhealthy", color: "text-purple-400" };
        return { text: "Hazardous", color: "text-maroon-400" };
    };

    const status = getAQIStatus(standardAQI);

    return (
        <div className="flex flex-col gap-0">
            <h2 className="text-xl font-bold text-white mb-4">Today's Highlight</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Air Quality Index Card */}
                <HighlightCard title="Air Quality Index">
                    <div className="flex flex-col gap-4 mt-2 h-full justify-between">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className={`text-5xl font-bold text-white tracking-tighter`}>{standardAQI}</span>
                                <span className="text-xs text-gray-400 ml-1 font-medium bg-white/10 px-2 py-1 rounded-full uppercase tracking-wider">AQI</span>
                            </div>
                            <div className="text-right">
                                <span className={`text-lg font-bold block ${status.color}`}>
                                    {status.text}
                                </span>
                            </div>
                        </div>

                        {/* Detailed Components (PM2.5, SO2, etc.) - Compact Grid */}
                        <div className="grid grid-cols-4 gap-1 text-center">
                            <div className="flex flex-col bg-white/5 rounded-lg p-1">
                                <span className="text-[10px] text-gray-400">PM2.5</span>
                                <span className="text-xs font-bold text-white">{aqiData?.list?.[0]?.components?.pm2_5 || '-'}</span>
                            </div>
                            <div className="flex flex-col bg-white/5 rounded-lg p-1">
                                <span className="text-[10px] text-gray-400">SO2</span>
                                <span className="text-xs font-bold text-white">{aqiData?.list?.[0]?.components?.so2 || '-'}</span>
                            </div>
                            <div className="flex flex-col bg-white/5 rounded-lg p-1">
                                <span className="text-[10px] text-gray-400">NO2</span>
                                <span className="text-xs font-bold text-white">{aqiData?.list?.[0]?.components?.no2 || '-'}</span>
                            </div>
                            <div className="flex flex-col bg-white/5 rounded-lg p-1">
                                <span className="text-[10px] text-gray-400">O3</span>
                                <span className="text-xs font-bold text-white">{aqiData?.list?.[0]?.components?.o3 || '-'}</span>
                            </div>
                        </div>

                        {/* Standard AQI Bar (0-500) */}
                        <div className="relative w-full h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 via-red-500 to-purple-900 shadow-inner mt-1">
                            {/* Indicator Dot */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-slate-700 shadow-sm transition-all duration-1000 ease-out"
                                style={{
                                    // Scale 0-500 to 0-100%
                                    left: `calc(${Math.max(2, Math.min(98, (standardAQI / 500) * 100))}% - 8px)`
                                }}
                            />
                        </div>
                    </div>
                </HighlightCard>

                {/* Wind Status */}
                <HighlightCard title="Wind Status">
                    <div className="relative h-24 mt-2 flex items-center justify-center">
                        {/* Dynamic Compass Visual */}
                        <div className="w-20 h-20 rounded-full border-2 border-gray-600 flex items-center justify-center relative">
                            <div className="absolute top-0 text-[10px] text-gray-500">N</div>
                            <div className="absolute bottom-0 text-[10px] text-gray-500">S</div>
                            <div className="absolute left-0 text-[10px] text-gray-500 ml-1">W</div>
                            <div className="absolute right-0 text-[10px] text-gray-500 mr-1">E</div>

                            {/* Rotating Arrow */}
                            <svg
                                style={{ transform: `rotate(${wind.deg}deg)`, transition: 'transform 0.5s ease-out' }}
                                className="w-12 h-12 text-blue-400"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 2L4.5 20.29C4.24 20.92 4.93 21.57 5.56 21.36L12 19L18.44 21.36C19.07 21.57 19.76 20.92 19.5 20.29L12 2Z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">{getWindSpeed()}</span>
                            <span className="text-sm text-gray-400">{units.wind}</span>
                        </div>
                        <span className="text-sm text-gray-400">Dir: {wind.deg}°</span>
                    </div>
                </HighlightCard>

                {/* UV Index */}
                <HighlightCard title="UV Index">
                    <div className="relative h-24 flex justify-center items-center">
                        {/* Gauge Chart */}
                        <svg viewBox="0 0 100 50" className="w-full h-full">
                            <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#374151" strokeWidth="8" strokeLinecap="round" />
                            {/* Dynamic Gauge Fill */}
                            <path
                                d="M10 50 A 40 40 0 0 1 90 50"
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray="126"
                                strokeDashoffset={126 - (126 * (Math.min(uvIndex, 12) / 12))}
                                className="transition-all duration-1000 ease-out"
                            />
                            <text x="50" y="34" textAnchor="middle" className="text-lg font-bold fill-white">{uvIndex}</text>
                            <text x="50" y="46" textAnchor="middle" className="text-[6px] fill-gray-400 uppercase tracking-widest">UV Index</text>
                        </svg>
                    </div>
                </HighlightCard>

                {/* Sunrise & Sunset */}
                <HighlightCard title="Sunrise & Sunset">
                    <div className="relative h-24">
                        <svg viewBox="0 0 100 50" className="w-full h-full">
                            <path d="M10 40 A 40 35 0 0 1 90 40" fill="none" stroke="#374151" strokeWidth="2" strokeDasharray="4 4" />
                            {(() => {
                                const now = dt;
                                const sunrise = sys.sunrise;
                                const sunset = sys.sunset;

                                let percent = 0;
                                if (now > sunset) percent = 1;
                                else if (now < sunrise) percent = 0;
                                else percent = (now - sunrise) / (sunset - sunrise);

                                // SVG Path is a semi-ellipse/arc from (10,40) to (90,40)
                                // Center (50, 40), Rx=40, Ry=35

                                const theta = Math.PI * (1 - percent); // PI to 0
                                const x = 50 + (40 * Math.cos(theta));
                                const y = 40 - (35 * Math.sin(theta));

                                // Day/Night Check for Tracker Icon
                                const isDay = now >= sunrise && now < sunset;

                                return (
                                    <>
                                        <defs>
                                            <radialGradient id="sunGradient">
                                                <stop offset="0%" stopColor="#FFF7ED" />
                                                <stop offset="40%" stopColor="#FDB813" />
                                                <stop offset="100%" stopColor="#F59E0B" />
                                            </radialGradient>
                                            <filter id="sunGlow" x="-100%" y="-100%" width="300%" height="300%">
                                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                            {/* Moon Gradients */}
                                            <radialGradient id="moonGradientTracker">
                                                <stop offset="0%" stopColor="#F8FAFC" />
                                                <stop offset="100%" stopColor="#94A3B8" />
                                            </radialGradient>
                                            <filter id="moonGlowTracker" x="-100%" y="-100%" width="300%" height="300%">
                                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        {isDay ? (
                                            <>
                                                {/* Sun Tracker */}
                                                <circle cx={x} cy={y} r="8" fill="rgba(253, 186, 116, 0.4)" className="transition-all duration-1000 animate-pulse" />
                                                <circle cx={x} cy={y} r="5" fill="url(#sunGradient)" filter="url(#sunGlow)" className="transition-all duration-1000" />
                                            </>
                                        ) : (
                                            <>
                                                {/* Moon Tracker (Basic positioning at night) */}
                                                {/* Note: Ideally we track moonset/moonrise, but for now we clamp or reset for visual effect since we lack moon phase data */}
                                                {/* We'll just show the Moon at the 'end' or 'start' or tracking if we want, OR just statically place it if out of bounds */}
                                                {/* For aesthetics, let's keep it tracking along the arc if it's "close" to transition, or just show it as a moon icon */}
                                                <circle cx={x} cy={y} r="8" fill="rgba(148, 163, 184, 0.4)" className="transition-all duration-1000 animate-pulse" />
                                                <circle cx={x} cy={y} r="5" fill="url(#moonGradientTracker)" filter="url(#moonGlowTracker)" className="transition-all duration-1000" />
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                            <path d="M10 40 L 90 40" stroke="none" />
                        </svg>
                    </div>
                    <div className="flex justify-between items-end -mt-2">
                        <div>
                            <p className="text-xs text-gray-400">Sunrise</p>
                            <p className="text-white font-semibold">{formatTime(sys.sunrise)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Sunset</p>
                            <p className="text-white font-semibold">{formatTime(sys.sunset)}</p>
                        </div>
                    </div>
                </HighlightCard>

                {/* Humidity - Advanced Liquid Drop Visual */}
                <HighlightCard title="Humidity" className="relative overflow-hidden">
                    <div className="flex justify-between items-center h-full relative z-10">
                        <div className="flex flex-col">
                            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-200 to-blue-600 drop-shadow-lg">
                                {main.humidity}%
                            </span>
                            <p className="text-[10px] text-gray-300 mt-2 max-w-[100px] leading-tight font-medium">
                                {main.humidity < 30 ? "Dry air." :
                                    main.humidity < 60 ? "Comfortable." :
                                        main.humidity < 80 ? "Humid." : "Oppressive."}
                            </p>
                        </div>

                        {/* Dynamic Water Drop SVG */}
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            {/* Glow Background */}
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>

                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                                {/* Base Drop Shape */}
                                <path d="M50 0 C50 0 90 40 90 65 C90 85 75 98 50 98 C25 98 10 85 10 65 C10 40 50 0 50 0 Z" fill="#1e3a8a" opacity="0.5" />

                                {/* Fill Level Mask */}
                                <defs>
                                    <mask id="waterMask">
                                        <path d="M50 0 C50 0 90 40 90 65 C90 85 75 98 50 98 C25 98 10 85 10 65 C10 40 50 0 50 0 Z" fill="white" />
                                    </mask>
                                </defs>

                                {/* Animated Water Level */}
                                <rect x="0" y={100 - main.humidity} width="100" height="100" fill="url(#blueGradient)" mask="url(#waterMask)" className="transition-all duration-1000 ease-out">
                                    <animate attributeName="y" values={`${100 - main.humidity};${100 - main.humidity + 2};${100 - main.humidity}`} dur="3s" repeatCount="indefinite" />
                                </rect>

                                {/* Gloss Reflection */}
                                <path d="M35 25 Q 25 45 25 65" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.3" fill="none" mask="url(#waterMask)" />

                                <defs>
                                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#60a5fa" />
                                        <stop offset="100%" stopColor="#2563eb" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </HighlightCard>

                {/* Pressure - Radial Gauge Visual */}
                <HighlightCard title="Pressure">
                    <div className="flex justify-between items-center h-full">
                        <div className="flex flex-col z-10">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 to-indigo-500">
                                    {getPressure()}
                                </span>
                                <span className="text-xs text-gray-400 ml-1">{units.pressure}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 max-w-[80px]">
                                {main.pressure < 1000 ? "Low Pressure" : main.pressure > 1020 ? "High Pressure" : "Normal"}
                            </p>
                        </div>

                        {/* Radial Indicator */}
                        <div className="relative w-16 h-16">
                            <svg className="w-full h-full rotate-[-135deg]" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e1b4b" strokeWidth="8" strokeLinecap="round" strokeDasharray="188" strokeDashoffset="47" /> {/* Background Arc 270deg */}
                                <circle
                                    cx="50" cy="50" r="40" fill="none" stroke="#818cf8" strokeWidth="8" strokeLinecap="round"
                                    strokeDasharray="188"
                                    strokeDashoffset={188 - ((Math.min(Math.max(main.pressure, 950), 1050) - 950) / 100) * 188 * 0.75} // Scale 950-1050 hPa
                                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 bg-indigo-900/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-indigo-500/30">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </HighlightCard>

                {/* Visibility - Premium Viewfinder Visual */}
                <HighlightCard title="Visibility">
                    <div className="flex justify-between items-center h-full">
                        <div className="flex flex-col z-10 w-[55%]">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-200 to-teal-500">
                                    {visibilityKm}
                                </span>
                                <span className="text-sm text-gray-400 ml-1">km</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                                {visibilityKm >= 10 ? "Clear view." : visibilityKm >= 5 ? "Moderate haze." : "Poor visibility."}
                            </p>
                        </div>

                        {/* Premium Viewfinder Visual */}
                        <div className="relative w-20 h-16 flex items-center justify-center">
                            {/* Outer Lens Ring */}
                            <div className="absolute inset-0 border-2 border-slate-600/50 rounded-lg"></div>

                            {/* Inner Dynamic Blur Container */}
                            <div className="w-16 h-12 bg-slate-800 rounded overflow-hidden relative shadow-inner">
                                {/* Abstract Horizon Lines */}
                                <div className="absolute inset-0 flex flex-col justify-end">
                                    <div className="w-full h-[1px] bg-slate-500 mb-2"></div>
                                    <div className="w-full h-[1px] bg-slate-500 mb-2"></div>
                                    <div className="w-full h-[1px] bg-slate-500 mb-2"></div>
                                    <div className="w-full h-full bg-gradient-to-t from-slate-700/50 to-transparent"></div>
                                </div>

                                {/* Distant Object (Triangle Mountain) */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-teal-400"></div>
                                </div>

                                {/* Dynamic Fog/Blur Overlay */}
                                <div
                                    className="absolute inset-0 bg-slate-400/10 transition-all duration-1000 z-10"
                                    style={{
                                        backdropFilter: `blur(${Math.max(0, (10 - visibilityKm) * 1.5)}px)`,
                                        opacity: Math.max(0, (10 - visibilityKm) / 10)
                                    }}
                                ></div>

                                {/* Crosshair Overlay (HUD look) */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                    <div className="w-[1px] h-full bg-white/50"></div>
                                    <div className="h-[1px] w-full bg-white/50 absolute"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </HighlightCard>

                {/* Feels Like - Premium Visual */}
                <HighlightCard title="Feels Like" className="relative overflow-hidden">
                    <div className="flex justify-between items-center h-full relative z-10">
                        {/* Ambient Background Glow - Now positioned on the Card Level via absolute, but standard React structure limits this.
                            Instead, we will place the glow inside the card content but allow it to bleed by removing overflow-hidden on the flex container
                            and ensuring the Card itself handles clipping if needed.
                        */}
                        <div className={`absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[60px] opacity-30 pointer-events-none transition-colors duration-1000 ${Math.round(main.feels_like) > 25 ? 'bg-orange-600' : 'bg-blue-600'}`}></div>

                        <div className="flex flex-col justify-center z-10">
                            <span className="text-5xl font-bold bg-gradient-to-br from-white via-blue-100 to-gray-400 bg-clip-text text-transparent drop-shadow-2xl">
                                {getTemp(main.feels_like)}°
                            </span>
                            <p className="text-xs text-gray-300 mt-2 max-w-[100px] leading-tight font-medium shadow-black drop-shadow-md">
                                {Math.round(main.feels_like) > Math.round(main.temp) + 2 ? "Humidity makes it feel hotter." :
                                    Math.round(main.feels_like) < Math.round(main.temp) - 2 ? "Wind chill makes it feel colder." :
                                        "Similar to actual temp."}
                            </p>
                        </div>

                        {/* Dynamic Thermometer Icon with Glass Effect */}
                        <div className="relative h-28 w-14 flex justify-center py-2 z-10">
                            {/* Glass Tube Container - Softer Background */}
                            <div className="w-6 h-full bg-slate-800/40 rounded-full relative overflow-hidden backdrop-blur-[2px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border border-white/10">
                                {/* Mercury Fill */}
                                <div
                                    className={`absolute bottom-0 w-full transition-all duration-1000 ease-in-out ${Math.round(main.feels_like) > 25 ? 'bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400' : 'bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400'}`}
                                    style={{
                                        height: `${Math.min(100, Math.max(15, (main.feels_like + 10) * 2))}%`, // Scale: Min 15% to 100%
                                        boxShadow: `0 0 15px 1px ${Math.round(main.feels_like) > 25 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`
                                    }}
                                />
                                {/* Glass Reflection Highlight - Softer */}
                                <div className="absolute top-2 left-1.5 w-1 h-[90%] bg-gradient-to-b from-white/40 to-transparent rounded-full opacity-50"></div>
                            </div>

                            {/* Bulb with 3D effect */}
                            <div className={`absolute bottom-0 w-10 h-10 rounded-full shadow-xl border-4 border-slate-700/60 z-20 flex items-center justify-center ${Math.round(main.feels_like) > 25 ? 'bg-gradient-to-br from-red-500 to-orange-700' : 'bg-gradient-to-br from-blue-500 to-blue-800'}`}>
                                {/* Bulb Gloss */}
                                <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full blur-[1px]"></div>
                            </div>

                            {/* Measurement Lines (External) */}
                            <div className="absolute right-0 top-6 flex flex-col gap-2 opacity-30">
                                <div className="w-2 h-[1.5px] bg-white shadow-sm"></div>
                                <div className="w-2 h-[1.5px] bg-white shadow-sm"></div>
                                <div className="w-2 h-[1.5px] bg-white shadow-sm"></div>
                                <div className="w-2 h-[1.5px] bg-white shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </HighlightCard>



                {/* 7 Days Forecast (Simulated from 5-day API) */}
                <HighlightCard title="7 Days Forecast">
                    <div className="flex flex-col gap-2 h-full overflow-y-auto custom-scrollbar pr-1 max-h-[140px]">
                        {forecastData?.list ? (
                            (() => {
                                // Filter for one forecast per day (approx noon) to simulate daily forecast
                                const dailyForecasts = [];
                                const seenDates = new Set();

                                forecastData.list.forEach(item => {
                                    const date = new Date(item.dt * 1000).toLocaleDateString();
                                    if (!seenDates.has(date)) {
                                        seenDates.add(date);
                                        dailyForecasts.push(item);
                                    }
                                });

                                // Limit to 7 days (API gives 5, but we show what we have)
                                return dailyForecasts.slice(0, 7).map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-xs p-2 hover:bg-white/5 rounded-xl transition-colors">
                                        <span className="text-gray-300 w-12 truncate">
                                            {index === 0 ? "Today" : new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <img
                                                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                                alt="weather icon"
                                                className="w-5 h-5"
                                            />
                                            <span className="text-gray-400 capitalize text-[10px] hidden sm:block truncate w-14">{item.weather[0].main}</span>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <span className="text-white font-bold">{getTemp(item.main.temp_max)}°</span>
                                            <span className="text-gray-500">{getTemp(item.main.temp_min)}°</span>
                                        </div>
                                    </div>
                                ));
                            })()
                        ) : (
                            forecastError ? (
                                <div className="text-center p-4">
                                    <p className="text-red-400 text-xs font-bold mb-1">Forecast Unavailable</p>
                                    <p className="text-gray-500 text-[10px] break-words">{forecastError}</p>
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm text-center">Loading...</p>
                            )
                        )}
                    </div>
                </HighlightCard >

            </div >
        </div >
    );
};

export default Highlights;
