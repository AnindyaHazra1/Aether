import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Configure axios defaults
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${API_URL}/api/auth/me`);
                setUser(res.data);
            } catch (error) {
                console.error("Auth Load Error:", error);
                if (error.response && error.response.status === 401) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const updateProfile = async (data) => {
        const res = await axios.put(`${API_URL}/api/auth/me`, data);
        setUser(res.data);
        return res.data;
    };

    const addFavorite = async (city) => {
        const res = await axios.post(`${API_URL}/api/auth/me/favorites`, { city });
        setUser({ ...user, savedLocations: res.data });
    };

    const removeFavorite = async (city) => {
        const res = await axios.delete(`${API_URL}/api/auth/me/favorites/${city}`);
        setUser({ ...user, savedLocations: res.data });
    };

    const uploadAvatar = async (formData) => {
        try {
            console.log("Uploading avatar...");
            const res = await axios.post(`${API_URL}/api/auth/upload-avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Upload response:", res.data);
            setUser(res.data);
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
        }
    };

    const deleteAvatar = async () => {
        try {
            console.log("Deleting avatar...");
            const res = await axios.delete(`${API_URL}/api/auth/me/avatar`);
            console.log("Delete response:", res.data);
            setUser(res.data);
        } catch (error) {
            console.error("Delete error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, addFavorite, removeFavorite, uploadAvatar, deleteAvatar, isAuthenticated: !!user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
