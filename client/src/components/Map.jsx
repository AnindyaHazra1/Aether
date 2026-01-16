import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map center updates
const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const Map = ({ weatherData }) => {
    // Default to London if no data
    const position = weatherData
        ? [weatherData.coord.lat, weatherData.coord.lon]
        : [51.505, -0.09];

    // API Key for OWM Tiles
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    console.log("Map API Key:", API_KEY ? "Present" : "Missing");

    return (
        <div className="h-full w-full overflow-hidden relative z-0">
            {/* Custom Styles to Override Leaflet Defaults */}
            <style>
                {`
                    .leaflet-control-zoom {
                        border: none !important;
                        box-shadow: none !important;
                        display: flex;
                        flex-direction: column;
                        gap: 8px; /* Reduced gap */
                        margin-right: 16px !important;
                        margin-top: 16px !important;
                    }
                    .leaflet-control-zoom a {
                        width: 36px !important; /* Reduced from 44px */
                        height: 36px !important; /* Reduced from 44px */
                        line-height: 36px !important;
                        font-size: 18px !important; /* Reduced from 24px */
                        background: rgba(15, 23, 42, 0.6) !important;
                        backdrop-filter: blur(12px);
                        color: #60a5fa !important;
                        border-radius: 50% !important;
                        border: 1px solid rgba(255, 255, 255, 0.08) !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Softer shadow */
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex !important;
                        align-items: center;
                        justify-content: center;
                        text-decoration: none !important;
                    }
                    .leaflet-control-zoom a:hover {
                        background: #3b82f6 !important;
                        color: white !important;
                        transform: translateY(-2px) scale(1.05);
                        box-shadow: 0 8px 16px rgba(59, 130, 246, 0.4);
                        border-color: rgba(59, 130, 246, 0.5) !important;
                    }
                    .leaflet-control-zoom a.leaflet-disabled {
                        opacity: 0.4;
                        cursor: not-allowed;
                        background: rgba(15, 23, 42, 0.6) !important;
                        box-shadow: none;
                        transform: none !important;
                        color: #475569 !important;
                    }
                    
                    /* Modern Layers Control - Ultra Compact Floating Panel */
                    .leaflet-control-layers {
                        background: rgba(15, 23, 42, 0.8) !important;
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.08) !important;
                        border-radius: 16px !important;
                        color: #f1f5f9 !important;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
                        padding: 4px !important;
                        margin-right: 16px !important;
                        margin-top: 16px !important;
                        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        overflow: hidden;
                    }
                     .leaflet-control-layers:hover {
                        background: rgba(15, 23, 42, 0.95) !important;
                        border-color: rgba(255, 255, 255, 0.15) !important;
                    }
                    .leaflet-control-layers-toggle {
                        width: 36px !important; /* Reduced further */
                        height: 36px !important;
                        background-size: 20px !important;
                        filter: invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.2)); 
                        transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    .leaflet-control-layers:hover .leaflet-control-layers-toggle {
                         transform: rotate(180deg);
                    }
                    .leaflet-control-layers-expanded {
                        padding: 12px 10px !important; /* Tight padding */
                        font-family: 'Inter', sans-serif;
                        min-width: 160px; /* Much narrower */
                        background: rgba(15, 23, 42, 0.9) !important;
                    }
                    .leaflet-control-layers-expanded h4 {
                        font-weight: 700;
                        margin-bottom: 8px;
                        font-size: 0.7rem; /* Tiny header */
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        color: #94a3b8;
                    }
                    
                    /* Stylish Radio/Checkbox Items */
                    .leaflet-control-layers-base label,
                    .leaflet-control-layers-overlays label {
                         margin-bottom: 4px; /* Tighter list */
                         display: flex;
                         align-items: center;
                         cursor: pointer;
                         padding: 6px 8px; /* Very compact item */
                         border-radius: 8px;
                         transition: all 0.2s ease;
                         border: 1px solid transparent;
                         font-size: 0.75rem; /* Small text */
                         line-height: 1.2;
                    }
                     .leaflet-control-layers-base label:hover,
                     .leaflet-control-layers-overlays label:hover {
                        background: rgba(255, 255, 255, 0.08);
                        border-color: rgba(255, 255, 255, 0.05);
                        transform: translateX(4px);
                    }
                     .leaflet-control-layers-separator {
                        border-top: 1px solid rgba(255,255,255,0.1) !important;
                        margin: 6px 0 !important;
                     }
                      /* Checkbox styling */
                     .leaflet-control-layers-selector {
                        margin-right: 8px;
                        accent-color: #3b82f6; 
                        cursor: pointer;
                        width: 14px;
                        height: 14px;
                        filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.4));
                     }
                `}
            </style>
            {/* z-0 ensures map doesn't overlap sidebar/modals if any */}
            <MapContainer
                center={position}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', background: '#111827' }}
                attributionControl={false}
                zoomAnimation={true}
                fadeAnimation={true}
                markerZoomAnimation={true}
            >
                <LayersControl position="topright">
                    {/* Base Maps */}
                    <LayersControl.BaseLayer checked name="Colorful (Standard)">
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Dark Matter (Contrast)">
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Light (Minimal)">
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                    </LayersControl.BaseLayer>

                    {/* Weather Data Overlays */}
                    <LayersControl.Overlay name="Precipitation (Rain/Snow)">
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                            opacity={0.8}
                            keepBuffer={10}
                            updateWhenIdle={false}
                            updateWhenZooming={false}
                        />
                    </LayersControl.Overlay>

                    <LayersControl.Overlay name="Clouds">
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                            opacity={0.8}
                            keepBuffer={10}
                            updateWhenIdle={false}
                            updateWhenZooming={false}
                        />
                    </LayersControl.Overlay>

                    <LayersControl.Overlay checked name="Temperature (Heatmap)">
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                            opacity={0.7}
                            keepBuffer={10}
                            updateWhenIdle={false}
                            updateWhenZooming={false}
                        />
                    </LayersControl.Overlay>

                    <LayersControl.Overlay name="Wind Speed">
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                            opacity={1.0}
                            keepBuffer={10}
                            updateWhenIdle={false}
                            updateWhenZooming={false}
                        />
                    </LayersControl.Overlay>

                    <LayersControl.Overlay name="Pressure Isobars">
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                            opacity={0.6}
                            keepBuffer={10}
                            updateWhenIdle={false}
                            updateWhenZooming={false}
                        />
                    </LayersControl.Overlay>

                </LayersControl>

                <Marker position={position}>
                    <Popup>
                        <div className="text-black font-bold text-center">
                            {weatherData ? weatherData.name : "London"} <br />
                            {weatherData ? Math.round(weatherData.main.temp) : "--"}°C
                        </div>
                    </Popup>
                </Marker>
                <ChangeView center={position} />
            </MapContainer >
        </div >
    );
};

export default Map;
