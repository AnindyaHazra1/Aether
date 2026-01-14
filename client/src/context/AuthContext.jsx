import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

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
                const res = await axios.get('http://localhost:5001/api/auth/me');
                setUser(res.data);
            } catch (error) {
                console.error("Auth Load Error:", error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await axios.post('http://localhost:5001/api/auth/register', { username, email, password });
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
        const res = await axios.put('http://localhost:5001/api/auth/me', data);
        setUser(res.data);
        return res.data;
    };

    const addFavorite = async (city) => {
        const res = await axios.post('http://localhost:5001/api/auth/me/favorites', { city });
        setUser({ ...user, savedLocations: res.data });
    };

    const removeFavorite = async (city) => {
        const res = await axios.delete(`http://localhost:5001/api/auth/me/favorites/${city}`);
        setUser({ ...user, savedLocations: res.data });
    };

    const uploadAvatar = async (formData) => {
        try {
            console.log("Uploading avatar...");
            const res = await axios.post('http://localhost:5001/api/auth/upload-avatar', formData, {
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
            const res = await axios.delete('http://localhost:5001/api/auth/me/avatar');
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
