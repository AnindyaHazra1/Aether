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

import LoadingScreen from './components/LoadingScreen';
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

    // Explicit Conversions for Safety
    const currentTime = Number(dt);
    const sunrise = Number(sys.sunrise);
    const sunset = Number(sys.sunset);

    const isDay = currentTime >= sunrise && currentTime < sunset;

    console.log("Background Logic Debug:", {
      condition,
      currentTime,
      sunrise,
      sunset,
      isDay,
      readableTime: new Date(currentTime * 1000).toLocaleTimeString(),
      readableSunrise: new Date(sunrise * 1000).toLocaleTimeString(),
      readableSunset: new Date(sunset * 1000).toLocaleTimeString()
    });

    // Night Time Backgrounds
    if (!isDay) {
      if (condition.includes('clear')) return 'https://images.unsplash.com/photo-1687506765495-88a298ab900b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Starry Night (Verified)
      if (condition.includes('cloud')) return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Night Clouds (Using Day Cloud for now as it's darkish, or better: fallback)
      if (condition.includes('rain') || condition.includes('drizzle')) return 'https://images.unsplash.com/photo-1700516698182-310fed2ff6de?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Night Rain (Urban)
      if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) return 'https://images.unsplash.com/photo-1639322223504-8a724a7c0b5c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Night Mist (Urban)
      if (condition.includes('snow')) return 'https://images.unsplash.com/photo-1511131341194-24e2eeeebb09?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Night Snow (Verified)

      return 'https://images.unsplash.com/photo-1687506765495-88a298ab900b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Fallback Night (Verified)
    }

    // Day Time Backgrounds
    if (condition.includes('clear')) return 'https://images.unsplash.com/photo-1605158080227-fd61e78bdc8b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Blue Sky (Verified)
    if (condition.includes('cloud')) return 'https://images.unsplash.com/photo-1605158080227-fd61e78bdc8b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Day Clouds (Using Clear Day)
    if (condition.includes('rain') || condition.includes('drizzle')) return 'https://images.unsplash.com/photo-1532690505755-416f854618da?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Day Rain (Verified)
    if (condition.includes('snow')) return 'https://images.unsplash.com/photo-1511131341194-24e2eeeebb09?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Day Snow (Verified)
    if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) return 'https://images.unsplash.com/photo-1532690505755-416f854618da?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Day Mist (Using Rain)

    return 'https://images.unsplash.com/photo-1605158080227-fd61e78bdc8b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Default Day Sky (Verified)
  };

  const bgImage = getBackgroundImage(weatherData); // Ensure this function exists!
  console.log("Applied Background Image:", bgImage); // DEBUG LOG

  // Gatekeeper Logic
  const isRestricted = !user && location.pathname === '/';

  if (authLoading) {
    console.log("App: Auth Loading...");
    return <LoadingScreen />;
  }

  return (
    <div
      className="h-[100dvh] text-white font-sans flex relative overflow-hidden bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url("${bgImage}")` }}
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
          <div className="absolute md:relative z-20 h-full pointer-events-none md:pointer-events-auto">
            {/* Pointer events none on wrapper to let clicks pass through on mobile if needed, but Sidebar component handles its own layout */}
            <div className="pointer-events-auto h-full">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Content */}
        {/* Content */}
        <main className={`flex-1 p-4 md:p-6 pt-4 md:pt-10 pb-24 md:pb-6 h-full overflow-y-auto relative z-10 custom-scrollbar ${location.pathname === '/login' || location.pathname === '/signup' ? 'flex items-center justify-center' : ''}`}>
          {error && (
            <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
              {error}
              <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
            </div>
          )}

          <Routes>
            <Route path="/" element={
              <div className="max-w-[1600px] mx-auto flex flex-col gap-6 md:gap-8">
                {/* Global Search Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-40">
                  {/* Quick User Location Actions (Desktop) - REMOVED */}

                  <div className="flex items-center gap-4 w-full md:w-auto md:ml-auto">
                    <div className="bg-[#202B3B]/90 backdrop-blur-xl rounded-2xl px-3 py-2 flex items-center gap-2 border border-white/10 shadow-lg w-full md:w-64">
                      <button onClick={() => handleSearch(searchQuery)}>
                        <svg className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </button>
                      <input
                        type="text"
                        placeholder="Search city..."
                        className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                      />
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  {/* Left Column (Weather Card & Quick Info) */}
                  <div className="xl:col-span-1 flex flex-col gap-6">
                    {weatherData && <WeatherCard data={weatherData} units={units} />}

                    {/* Map Preview */}
                    <div className="bg-[#202B3B]/80 backdrop-blur-md rounded-[2rem] p-6 relative overflow-hidden group h-[280px] flex flex-col shrink-0 border border-white/5 shadow-lg">
                      <div className="flex justify-between items-center mb-4 relative z-10 shrink-0">
                        <h2 className="text-lg font-bold text-white">Radar</h2>
                        <Link to="/map" className="bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-1 text-xs text-white decoration-0">Expand</Link>
                      </div>
                      <div className="flex-1 rounded-xl overflow-hidden relative z-0">
                        <Map weatherData={weatherData} />
                      </div>
                    </div>

                    {/* Favorites Section */}
                    {user && (user.location || (user.savedLocations && user.savedLocations.length > 0)) && (
                      <div className="bg-[#202B3B]/80 backdrop-blur-md rounded-[2rem] p-6 shrink-0 border border-white/5 shadow-lg">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          Saved Locations
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {user.location && (
                            <button onClick={() => handleSearch(user.location)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20">Home</button>
                          )}
                          {[...new Set(user.savedLocations || [])].map((city, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSearch(city)}
                              className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600 text-gray-200 border border-white/5 rounded-lg transition-all text-xs font-medium"
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column (Highlights) */}
                  <div className="xl:col-span-3">
                    <Highlights weatherData={weatherData} aqiData={aqiData} forecastData={forecastData} forecastError={forecastError} units={units} />
                  </div>
                </div>
              </div>
            } />

            <Route path="/map" element={<div className="h-full w-full pb-20 md:pb-0"><MapPage weatherData={weatherData} /></div>} />
            <Route path="/settings" element={<div className="h-full w-full p-4 pb-20 md:pb-0 overflow-y-auto"><SettingsPage units={units} setUnits={setUnits} /></div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<div className="h-full w-full overflow-y-auto pb-20 md:pb-0"><Profile /></div>} />
          </Routes>
        </main>
      </div>
    </div >
  );
}

export default App;
