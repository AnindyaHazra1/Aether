import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

export const fetchWeather = async (city) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/weather`, {
            params: { city }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const fetchForecast = async (city) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/forecast`, {
            params: { city }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const fetchAQI = async (lat, lon) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/aqi`, {
            params: { lat, lon }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch AQI", error);
        return null;
    }
};

export const fetchHistory = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/history`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch history", error);
        return [];
    }
};
