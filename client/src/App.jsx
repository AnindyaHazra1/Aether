import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WeatherCard from './components/WeatherCard';
import Highlights from './components/Highlights';

import Map from './components/Map';
import MapPage from './components/MapPage';
import SettingsPage from './components/SettingsPage';
import { fetchWeather, fetchForecast, fetchAQI } from './api/weather';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [forecastData, setForecastData] = useState(null);
  const [forecastError, setForecastError] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global Units State
  const [units, setUnits] = useState({
    temp: 'metric', // 'metric' (C) or 'imperial' (F)
    wind: 'km/h',   // 'km/h', 'm/s', 'mph'
    pressure: 'hPa' // 'hPa', 'inHg'
  });

  useEffect(() => {
    handleSearch('Asansol');
  }, []);

  const handleSearch = async (city) => {
    if (!city || !city.trim()) return;
    setLoading(true);
    setError(null);
    setForecastError(null); // Reset forecast error

    try {
      // 1. Fetch Current Weather (Critical)
      const current = await fetchWeather(city);
      setWeatherData(current);

      // 2. Fetch Forecast (Non-Critical)
      try {
        const forecast = await fetchForecast(city);
        console.log("Forecast Data Fetched:", forecast);
        setForecastData(forecast);
      } catch (forecastErr) {
        console.warn("Forecast fetch failed:", forecastErr);
        setForecastError(forecastErr.message || "Failed to load forecast"); // Set Error
      }

      // 3. Fetch AQI (Non-Critical)
      if (current.coord) {
        const aqi = await fetchAQI(current.coord.lat, current.coord.lon);
        console.log("AQI Data Fetched:", aqi);
        setAqiData(aqi);
      }

    } catch (err) {
      console.error("Critical Search failed:", err);
      setError(err.message || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Dynamic Background Logic
  const getBackgroundImage = (weather) => {
    if (!weather) return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'; // Default Dark Tech/Space

    const { dt, sys, weather: weatherDetails } = weather;
    const condition = weatherDetails[0].main.toLowerCase();

    // Day/Night Logic
    const isDay = dt >= sys.sunrise && dt < sys.sunset;

    // --- NIGHT Backgrounds (Moody, Aesthetic, Dark) ---
    if (!isDay) {
      if (condition.includes('clear')) return 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2070&auto=format&fit=crop'; // Deep Starry Night
      if (condition.includes('cloud')) return 'https://images.unsplash.com/photo-1536746803623-cef8708094dd?q=80&w=1974&auto=format&fit=crop'; // Night Clouds/Moon
      if (condition.includes('rain') || condition.includes('drizzle')) return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1974&auto=format&fit=crop'; // Aesthetic Rain on Glass (Night/Dark)
      if (condition.includes('snow')) return 'https://images.unsplash.com/photo-1483664852095-d6cc6870705f?q=80&w=2070&auto=format&fit=crop'; // Night Snow/Cozy
      if (condition.includes('thunder')) return 'https://images.unsplash.com/photo-1472552944129-b035e9ea3744?q=80&w=1974&auto=format&fit=crop'; // Stormy Night
      if (condition.includes('mist') || condition.includes('fog')) return 'https://images.unsplash.com/photo-1514632595-494d1d683198?q=80&w=1974&auto=format&fit=crop'; // Misty Night Forest
      return 'https://images.unsplash.com/photo-1472552944129-b035e9ea3744?q=80&w=1974&auto=format&fit=crop'; // General Night
    }

    // --- DAY Backgrounds (Bright, Fresh, Aesthetic) ---
    if (condition.includes('clear')) return 'https://images.unsplash.com/photo-1622278676270-05683ce2163a?q=80&w=2000&auto=format&fit=crop'; // Aesthetic Blue Sky/Soft Light
    if (condition.includes('cloud')) return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1951&auto=format&fit=crop'; // Fluffy Aesthetic Clouds
    if (condition.includes('rain') || condition.includes('drizzle')) return 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=2070&auto=format&fit=crop'; // Soft Rain/Wet Glass Day
    if (condition.includes('snow')) return 'https://images.unsplash.com/photo-1477601372917-8a0a84aa5963?q=80&w=2070&auto=format&fit=crop'; // Aesthetic Snow Forest
    if (condition.includes('thunder')) return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2071&auto=format&fit=crop'; // Epic Lightning/Storm
    if (condition.includes('mist') || condition.includes('fog')) return 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?q=80&w=1974&auto=format&fit=crop'; // Moody Foggy Mountains

    return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1974&auto=format&fit=crop'; // Default Sunny/Clear
  };

  const [currentPage, setCurrentPage] = useState('dashboard');

  const bgImage = getBackgroundImage(weatherData);

  return (
    <div
      className="h-screen text-white font-sans flex relative overflow-hidden bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Premium Dark Overlay with Gradient for Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-black/50 to-gray-900/60 backdrop-blur-[1px] z-0"></div>

      {/* Sidebar (z-10 to sit above overlay) */}
      <div className="relative z-10 h-full">
        <Sidebar activePage={currentPage} onNavigate={setCurrentPage} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-10 h-screen overflow-hidden relative z-10">

        {/* Error Toast */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
            {error}
            <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
          </div>
        )}

        {/* View Switcher */}
        {currentPage === 'map' ? (
          // --- MAP PAGE VIEW ---
          <div className="h-full w-full">
            <MapPage weatherData={weatherData} />
          </div>
        ) : currentPage === 'settings' ? (
          // --- SETTINGS PAGE VIEW ---
          <div className="h-full w-full p-4">
            <SettingsPage units={units} setUnits={setUnits} />
          </div>
        ) : (
          // --- DASHBOARD VIEW (Default) ---
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 h-full">
            {/* Left Column (Weather Card + Map Preview) */}
            <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
              {weatherData && <WeatherCard data={weatherData} units={units} />}

              {/* Global Map Section - Preview */}
              <div className="bg-[#202B3B] rounded-[2rem] p-6 relative overflow-hidden group h-[300px] flex flex-col shrink-0">
                <div className="flex justify-between items-center mb-4 relative z-10 shrink-0">
                  <h2 className="text-xl font-bold">Weather condition map</h2>
                  <button
                    onClick={() => setCurrentPage('map')}
                    className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-3 py-1 text-xs text-gray-400 cursor-pointer"
                  >
                    Expand
                  </button>
                </div>

                {/* Interactive Map */}
                <div className="flex-1 rounded-xl overflow-hidden relative z-0">
                  <Map weatherData={weatherData} />
                </div>
              </div>
            </div>

            {/* Right Column (Highlights Only) */}
            <div className="flex flex-col gap-0 h-full overflow-hidden">
              {/* Top Bar (Header/Search) */}
              <div className="flex justify-end items-center shrink-0">

                <div className="flex items-center gap-4">
                  <div className="bg-[#202B3B] rounded-full px-4 py-2 flex items-center gap-2 border border-gray-700">
                    <button onClick={() => handleSearch(searchQuery)}>
                      <svg className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                    <input
                      type="text"
                      placeholder="Search city..."
                      className="bg-transparent border-none outline-none text-white text-sm w-32 md:w-48 placeholder-gray-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch(searchQuery);
                      }}
                    />
                  </div>

                </div>
              </div>

              {/* Highlights Section */}
              <div className="shrink-0 flex-1 overflow-y-auto custom-scrollbar">
                <Highlights
                  weatherData={weatherData}
                  aqiData={aqiData}
                  forecastData={forecastData}
                  forecastError={forecastError}
                  units={units}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
