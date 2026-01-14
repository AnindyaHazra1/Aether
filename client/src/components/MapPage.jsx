import React from 'react';
import Map from './Map';

const MapPage = ({ weatherData }) => {
    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex justify-between items-center shrink-0">
                <h1 className="text-3xl font-bold text-white">Global Map View</h1>
                {weatherData && (
                    <div className="text-right">
                        <p className="text-xl font-bold text-white">{weatherData.name}, {weatherData.sys.country}</p>
                        <div className="text-sm text-gray-300">
                            Lat: {weatherData.coord.lat.toFixed(2)} | Lon: {weatherData.coord.lon.toFixed(2)}
                        </div>
                    </div>
                )}
            </div>

            {/* Full Space Map Container */}
            <div className="flex-1 bg-[#202B3B]/80 backdrop-blur-md rounded-[2rem] p-6 shadow-2xl overflow-hidden relative border border-white/10">
                <div className="w-full h-full rounded-xl overflow-hidden">
                    <Map weatherData={weatherData} />
                </div>
            </div>
        </div>
    );
};

export default MapPage;
