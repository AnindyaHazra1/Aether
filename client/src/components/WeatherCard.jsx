import React from 'react';

const WeatherCard = ({ data, units }) => {
    if (!data) return null;

    const { name, main, weather, dt, timezone } = data;

    // Temperature Conversion
    const temperature = units.temp === 'imperial'
        ? Math.round((main.temp * 9 / 5) + 32)
        : Math.round(main.temp);

    const condition = weather[0].description;
    const iconCode = weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Live Clock State
    const [timeString, setTimeString] = React.useState("");
    const [dayName, setDayName] = React.useState("");

    React.useEffect(() => {
        const updateTime = () => {
            const now = Date.now(); // Current UTC timestamp in ms
            // Shift time by timezone offset (seconds * 1000)
            // This gives us a timestamp that "looks like" the local time when viewed in UTC
            const localTimestamp = now + (timezone * 1000);
            const dateObj = new Date(localTimestamp);

            const is24Hour = units.time === '24h';

            // Format using UTC timezone to match the shifted timestamp
            const timeStr = dateObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: !is24Hour,
                timeZone: 'UTC'
            });

            const dayStr = dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                timeZone: 'UTC'
            });

            setTimeString(timeStr);
            setDayName(dayStr);
        };

        const timer = setInterval(updateTime, 1000);
        updateTime(); // Initial call

        return () => clearInterval(timer);
    }, [timezone, units.time]); // Re-run if timezone OR format changes

    return (
        <div className="bg-gradient-to-br from-indigo-950/80 via-purple-900/60 to-slate-900/80 backdrop-blur-2xl border border-indigo-200/20 rounded-[2rem] pl-6 md:pl-10 pr-2 pt-0 pb-24 shadow-2xl relative overflow-hidden min-h-[310px] flex flex-col justify-between group">

            {/* Background Glow Effect */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-[100px] group-hover:bg-purple-500/40 transition-all duration-500"></div>

            {/* Main Content Layout */}
            <div className="relative z-10 flex justify-between items-center gap-4">
                <div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter drop-shadow-lg">
                        {temperature}°{units.temp === 'imperial' ? 'F' : ''}
                    </h1>
                    <p className="text-xl text-gray-300 capitalize mt-2 font-medium tracking-wide pl-2">{condition}</p>
                </div>

                {/* Floating Large Icon */}
                <div className="transform hover:scale-105 transition-transform duration-500 filter drop-shadow-2xl">
                    {/* Render Custom Animated Icons based on condition */}
                    {(() => {
                        const mainCondition = weather[0].main.toLowerCase();
                        const isDay = dt >= data.sys.sunrise && dt < data.sys.sunset;

                        if (mainCondition.includes('clear')) {
                            if (isDay) {
                                return (
                                    <svg className="w-28 h-28 md:w-48 md:h-48 overflow-visible" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <radialGradient id="gradSunCore" cx="32" cy="32" r="16" fx="32" fy="32">
                                                <stop offset="0%" stopColor="#FFF" stopOpacity="1" />
                                                <stop offset="40%" stopColor="#FDE047" />
                                                <stop offset="100%" stopColor="#F59E0B" />
                                            </radialGradient>
                                            <radialGradient id="gradSunRays" cx="32" cy="32" r="32" fx="32" fy="32">
                                                <stop offset="0%" stopColor="#FDBA74" stopOpacity="0" />
                                                <stop offset="50%" stopColor="#FDBA74" stopOpacity="0.5" />
                                                <stop offset="100%" stopColor="#FFB52E" stopOpacity="0" />
                                            </radialGradient>
                                            <filter id="glowSun" x="-100%" y="-100%" width="300%" height="300%">
                                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        <circle cx="32" cy="32" r="16" fill="url(#gradSunCore)" filter="url(#glowSun)" className="animate-[pulse_3s_ease-in-out_infinite]" />
                                    </svg>
                                );
                            } else {
                                // Moon Icon (Clear Night)
                                return (
                                    <svg className="w-28 h-28 md:w-40 md:h-40 animate-[pulse_6s_ease-in-out_infinite] overflow-visible" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="gradMoon" x1="10" y1="10" x2="50" y2="50">
                                                <stop offset="0%" stopColor="#F8FAFC" />
                                                <stop offset="100%" stopColor="#94A3B8" />
                                            </linearGradient>
                                            <filter id="glowMoon" x="-100%" y="-100%" width="300%" height="300%">
                                                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>
                                        {/* Crescent/Full Moon Shape */}
                                        <circle cx="32" cy="32" r="18" fill="url(#gradMoon)" filter="url(#glowMoon)" />
                                        {/* Craters (Optional detail) */}
                                        <circle cx="24" cy="24" r="3" fill="rgba(0,0,0,0.1)" />
                                        <circle cx="38" cy="36" r="4" fill="rgba(0,0,0,0.1)" />
                                        <circle cx="28" cy="40" r="2" fill="rgba(0,0,0,0.1)" />
                                    </svg>
                                );
                            }
                        } else if (mainCondition.includes('clouds')) {
                            return (
                                <svg className="w-28 h-28 md:w-40 md:h-40 overflow-visible" viewBox="0 0 64 64" fill="none">
                                    <defs>
                                        <linearGradient id="gradCloud" x1="20" y1="20" x2="50" y2="50">
                                            <stop offset="0%" stopColor="#E2E8F0" />
                                            <stop offset="100%" stopColor="#94A3B8" />
                                        </linearGradient>
                                        <filter id="glowCloud" x="-50%" y="-50%" width="200%" height="200%">
                                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    {/* Sun peeking behind */}
                                    <circle cx="48" cy="20" r="10" fill="#FBBF24" className="animate-pulse" filter="url(#glowCloud)" opacity="0.8" />
                                    {/* Cloud */}
                                    <path d="M16 40C16 48.8366 23.1634 56 32 56H48C54.6274 56 60 50.6274 60 44C60 37.3726 54.6274 32 48 32H44C44 20.9543 35.0457 12 24 12C14.5 12 6.5 18.5 4.5 27.5C4.5 27.5 0 28 0 36C0 42.6 5.4 48 12 48" fill="url(#gradCloud)" filter="url(#glowCloud)" />
                                </svg>
                            );
                        } else if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
                            return (
                                <svg className="w-28 h-28 md:w-40 md:h-40 overflow-visible" viewBox="0 0 64 64" fill="none">
                                    <defs>
                                        <linearGradient id="gradRain" x1="10" y1="10" x2="50" y2="50">
                                            <stop offset="0%" stopColor="#94A3B8" />
                                            <stop offset="100%" stopColor="#475569" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M16 36C16 44 22 50 30 50H46C52 50 56 46 56 40C56 34 52 30 46 30H42C42 20 34 12 24 12C14 12 6 18 4 26C4 26 0 26 0 32C0 38 6 36 12 36" fill="url(#gradRain)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
                                    <path d="M24 52L20 60M36 52L32 60M48 52L44 60" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" className="animate-[bounce_1s_infinite]" />
                                </svg>
                            );
                        } else {
                            // Default Fallback
                            return <img src={iconUrl} alt={condition} className="w-28 h-28 md:w-40 md:h-40 object-contain drop-shadow-2xl" />;
                        }
                    })()}
                </div>
            </div>

            {/* Footer Info */}
            <div className="border-t border-gray-700/50 pt-6 flex flex-col gap-3 relative z-10">
                <div className="flex items-center gap-3 text-gray-400 flex-wrap">
                    <div className="p-2 bg-gray-800/50 rounded-full shrink-0">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <span className="font-medium text-lg text-gray-200 break-words">{name}, {data.sys?.country || "US"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 flex-wrap">
                    <div className="p-2 bg-gray-800/50 rounded-full shrink-0">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <span className="font-medium">{dayName}, <span className="text-gray-500">{timeString}</span></span>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
