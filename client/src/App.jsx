import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';
import WeatherCard from './components/WeatherCard';
import Highlights from './components/Highlights';

import Map from './components/Map';
import MapPage from './components/MapPage';
import SettingsPage from './components/SettingsPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';

import { fetchWeather, fetchForecast, fetchAQI } from './api/weather';

function App() {
  console.log("App Component Rendering..."); // DEBUG LOG

  const { user, loading: authLoading } = useAuth();
  console.log("Auth State:", { user, authLoading }); // DEBUG LOG

  const location = useLocation();
  const [weatherData, setWeatherData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [forecastData, setForecastData] = useState(null);
  const [forecastError, setForecastError] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [units, setUnits] = useState({
    temp: 'metric',
    wind: 'km/h',
    pressure: 'hPa',
    time: '12h'
  });

  useEffect(() => {
    if (user && user.location) {
      handleSearch(user.location);
    } else {
      handleSearch('Asansol');
    }
  }, [user]); // We don't want to re-run search on units change, but we want to log units.

  const handleSearch = async (city) => {
    if (!city || !city.trim()) return;
    setLoading(true);
    setError(null);
    setForecastError(null);

    try {
      const current = await fetchWeather(city);
      setWeatherData(current);

      try {
        const forecast = await fetchForecast(city);
        setForecastData(forecast);
      } catch (forecastErr) {
        console.warn("Forecast fail:", forecastErr);
        setForecastError(forecastErr.message || "Failed to load forecast");
      }

      if (current.coord) {
        const aqi = await fetchAQI(current.coord.lat, current.coord.lon);
        setAqiData(aqi);
      }

    } catch (err) {
      console.error("Search fail:", err);
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundImage = (weather) => {
    if (!weather) return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';

    const { dt, sys, weather: weatherDetails } = weather;
    const condition = weatherDetails[0].main.toLowerCase();
    const isDay = dt >= sys.sunrise && dt < sys.sunset;

    // Night Time Backgrounds
    if (!isDay) {
      if (condition.includes('clear')) return 'https://images.unsplash.com/photo-1519681393798-38e43269d877?q=80&w=2070&auto=format&fit=crop'; // Deep Blue Starry Night
      if (condition.includes('cloud')) return 'https://images.unsplash.com/photo-1528629250003-1383c44cb948?q=80&w=2070&auto=format&fit=crop'; // Night Clouds
      if (condition.includes('rain') || condition.includes('drizzle')) return 'https://images.unsplash.com/photo-1536431311719-398b18a4b901?q=80&w=2070&auto=format&fit=crop'; // Night Rain
      if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) return 'https://images.unsplash.com/photo-1509653087866-91f6c2ab59f2?q=80&w=1970&auto=format&fit=crop'; // Night Mist/Fog
      if (condition.includes('snow')) return 'https://images.unsplash.com/photo-1478265867563-78890a609fe2?q=80&w=2070&auto=format&fit=crop'; // Night Snow

      return 'https://images.unsplash.com/photo-1519681393798-38e43269d877?q=80&w=2070&auto=format&fit=crop'; // Fallback Deep Starry Night
    }

    // Day Time Backgrounds - Literal Interpretations
    if (condition.includes('clear')) return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1974&auto=format&fit=crop'; // Literal Blue Sky & Sun
    if (condition.includes('cloud')) return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1951&auto=format&fit=crop'; // Distinct Clouds
    if (condition.includes('rain') || condition.includes('drizzle')) return 'https://images.unsplash.com/photo-1428592953211-0750befadd26?q=80&w=2070&auto=format&fit=crop'; // Rainy Window
    if (condition.includes('snow')) return 'https://images.unsplash.com/photo-1478265867563-78890a609fe2?q=80&w=2070&auto=format&fit=crop'; // Snow
    if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) return 'https://images.unsplash.com/photo-1543968996-ee822b8176ba?q=80&w=2028&auto=format&fit=crop'; // Day Mist

    return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1974&auto=format&fit=crop'; // Default Blue Sky
  };

  const bgImage = getBackgroundImage(weatherData); // Ensure this function exists!

  // Gatekeeper Logic
  const isRestricted = !user && location.pathname === '/';

  if (authLoading) {
    console.log("App: Auth Loading...");
    return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
  }

  return (
    <div
      className="h-screen text-white font-sans flex relative overflow-hidden bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-black/50 to-gray-900/60 backdrop-blur-[1px] z-0"></div>

      {/* Global Modal */}
      {isRestricted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-10 rounded-3xl text-center shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Welcome to Aether</h2>
            <p className="text-gray-300 mb-8 text-lg">Sign in to access advanced weather insights.</p>
            <div className="flex flex-col gap-4">
              <Link to="/login" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold pointer-events-auto">Log In</Link>
              <Link to="/signup" className="w-full py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold pointer-events-auto">Sign Up</Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      <div className={`flex h-full w-full relative z-10 transition-all duration-500 ${isRestricted ? 'blur-sm pointer-events-none select-none opacity-50' : ''}`}>

        {/* Sidebar - Hide on Login/Signup */}
        {location.pathname !== '/login' && location.pathname !== '/signup' && (
          <div className="absolute md:relative z-20 h-full">
            <Sidebar />
          </div>
        )}

        {/* Content */}
        <main className={`flex-1 p-6 pt-10 h-screen overflow-hidden relative z-10 ${location.pathname === '/login' || location.pathname === '/signup' ? 'flex items-center justify-center' : ''}`}>
          {error && (
            <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
              {error}
              <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
            </div>
          )}

          <Routes>
            <Route path="/" element={
              <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 h-full">
                <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
                  {weatherData && <WeatherCard data={weatherData} units={units} />}
                  {/* Map Preview */}
                  <div className="bg-[#202B3B] rounded-[2rem] p-6 relative overflow-hidden group h-[300px] flex flex-col shrink-0">
                    <div className="flex justify-between items-center mb-4 relative z-10 shrink-0">
                      <h2 className="text-xl font-bold">Weather condition map</h2>
                      <Link to="/map" className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-3 py-1 text-xs text-gray-400 decoration-0">Expand</Link>
                    </div>
                    <div className="flex-1 rounded-xl overflow-hidden relative z-0">
                      <Map weatherData={weatherData} />
                    </div>
                  </div>

                  {/* Favorites Quick Access */}
                  {user && (user.location || (user.savedLocations && user.savedLocations.length > 0)) && (
                    <div className="bg-[#202B3B]/80 backdrop-blur-md rounded-[2rem] p-6 shrink-0">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          Favorite Locations
                        </h2>

                        {/* Default Location Button */}
                        {user.location && (
                          <button
                            onClick={() => handleSearch(user.location)}
                            className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 hover:text-white text-blue-400 border border-blue-500/30 rounded-lg transition-all text-xs font-bold flex items-center gap-2"
                            title={`Reset to Home: ${user.location}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                            Home
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Saved Locations */}
                        {[...new Set(user.savedLocations || [])].map((city, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSearch(city)}
                            className="px-4 py-2 bg-slate-800/50 hover:bg-blue-600/20 hover:text-blue-400 border border-white/5 rounded-xl transition-all text-sm font-medium"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-0 h-full overflow-hidden">
                  {/* Search Bar */}
                  <div className="flex justify-end items-center shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#202B3B] rounded-full px-4 py-2 flex items-center gap-2 border border-gray-700">
                        <button onClick={() => handleSearch(searchQuery)}>
                          <svg className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                        <input
                          type="text"
                          placeholder="Search..."
                          className="bg-transparent border-none outline-none text-white text-sm w-32 md:w-48"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Highlights */}
                  <div className="shrink-0 flex-1 overflow-y-auto custom-scrollbar">
                    <Highlights weatherData={weatherData} aqiData={aqiData} forecastData={forecastData} forecastError={forecastError} units={units} />
                  </div>
                </div>
              </div>
            } />

            <Route path="/map" element={<div className="h-full w-full"><MapPage weatherData={weatherData} /></div>} />
            <Route path="/settings" element={<div className="h-full w-full p-4"><SettingsPage units={units} setUnits={setUnits} /></div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
