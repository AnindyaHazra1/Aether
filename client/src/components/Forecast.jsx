import React from 'react';

const Forecast = ({ data }) => {
    console.log("Forecast Data Received:", data);
    if (!data) return null;

    // Robust filtering: Get one entry per day (unique dates)
    const uniqueDays = [];
    const dailyForecast = data.list.filter(item => {
        const date = new Date(item.dt * 1000).getDate();
        if (!uniqueDays.includes(date)) {
            uniqueDays.push(date);
            return true;
        }
        return false;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.toLocaleDateString(undefined, { day: 'numeric' });
        const month = date.toLocaleDateString(undefined, { month: 'short' });
        return { day, month, weekday: date.toLocaleDateString(undefined, { weekday: 'short' }) };
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 flex-1 min-h-[400px] shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">7 days Forecast</h2>
                <div className="bg-gray-700/50 rounded-full px-3 py-1 flex items-center gap-1 text-xs text-gray-300">
                    <span>7 day</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                {dailyForecast.slice(0, 7).map((day, index) => {
                    const { weekday, day: dayNum, month } = formatDate(day.dt_txt);
                    return (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-none">
                            <div className="flex items-center gap-3 w-1/3">
                                <img
                                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                                    alt={day.weather[0].description}
                                    className="w-8 h-8"
                                />
                                <span className="text-gray-300 font-medium text-sm">
                                    {Math.round(day.main.temp)}°
                                    <span className="text-gray-500 ml-1 text-xs">/{Math.round(day.main.temp_min)}°</span>
                                </span>
                            </div>

                            <div className="flex-1 text-center px-1">
                                <span className="text-gray-400 text-xs whitespace-nowrap">{dayNum} {month}</span>
                            </div>

                            <div className="w-1/3 text-right">
                                <span className="text-gray-400 text-xs font-medium uppercase">{weekday}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;
