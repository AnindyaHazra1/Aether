import React from 'react';
import Map from './Map';

const MapPage = ({ weatherData }) => {
    return (
        <div className="flex flex-col h-full gap-4 md:gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 gap-2 md:gap-0">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Global Map View</h1>
                {weatherData && (
                    <div className="text-left md:text-right">
                        <p className="text-lg md:text-xl font-bold text-white">{weatherData.name}, {weatherData.sys.country}</p>
                        <div className="text-xs md:text-sm text-gray-300">
                            Lat: {weatherData.coord.lat.toFixed(2)} | Lon: {weatherData.coord.lon.toFixed(2)}
                        </div>
                    </div>
                )}
            </div>

            {/* Full Space Map Container */}
            <div className="flex-1 bg-[#202B3B]/80 backdrop-blur-md rounded-2xl md:rounded-[2rem] p-0 md:p-6 shadow-2xl overflow-hidden relative border border-white/10">
                <div className="w-full h-full rounded-2xl md:rounded-xl overflow-hidden">
                    <Map weatherData={weatherData} />
                </div>
            </div>
        </div>
    );
};

export default MapPage;
