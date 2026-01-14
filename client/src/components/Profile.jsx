import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const DEFAULT_AVATAR = 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_25.png';

const Profile = () => {
    const { user, logout, updateProfile, addFavorite, removeFavorite, uploadAvatar, deleteAvatar } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newCity, setNewCity] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Defensive checks for user data
    const savedLocs = user?.savedLocations || [];
    const userAvatarId = user?.avatarId || 'default';
    const loginCount = user?.loginCount || 0;
    const joinDate = user?.createdAt ? new Date(user.createdAt).getFullYear() : '-';

    // Stats Calculation
    const stats = [
        { label: 'Logins', value: loginCount, icon: '🔑' },
        { label: 'Saved Cities', value: savedLocs.length, icon: '📍' },
        { label: 'Member Since', value: joinDate, icon: '📅' },
    ];

    const [formData, setFormData] = useState({
        location: '',
        dob: '',
        phone: ''
    });

    const startEditing = () => {
        setFormData({
            location: user.location || '',
            dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
            phone: user.phone || ''
        });
        setIsEditing(true);
        setError(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAddFavorite = async (e) => {
        e.preventDefault();
        if (!newCity.trim()) return;
        try {
            await addFavorite(newCity);
            setNewCity('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('avatar', file);

        setUploading(true);
        try {
            await uploadAvatar(data);
        } catch (err) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteAvatar();
            setShowDeleteModal(false);
        } catch (err) {
            console.error("Delete error", err);
            setError('Failed to delete avatar');
        }
    };

    const handleAvatarDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const getAvatarSrc = () => {
        console.log("getAvatarSrc called. userAvatarId:", userAvatarId);
        if (!userAvatarId || userAvatarId === 'default') {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=random&color=fff&size=200`;
        }
        if (userAvatarId.startsWith('/uploads')) {
            const url = `http://localhost:5001${userAvatarId}`;
            console.log("Generated URL:", url);
            return url;
        }
        return userAvatarId.startsWith('http') ? userAvatarId : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=random&color=fff&size=200`;
    };

    if (!user) {
        return <div className="flex items-center justify-center h-full text-white">Loading...</div>;
    }

    console.log("Profile Render. User:", user);

    return (
        <div className="flex justify-center items-start min-h-[calc(100vh-2rem)] py-6">
            <div className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white border border-white/10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">My Profile</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Avatar & Basic Info */}
                    <div className="lg:col-span-1 flex flex-col items-center text-center space-y-4">
                        <div className="relative group/avatar">
                            <img
                                src={getAvatarSrc()}
                                alt="Avatar"
                                className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-xl bg-slate-800"
                            />

                            {/* Upload Overlay */}
                            <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                <span className="text-xs text-white font-bold mb-1">
                                    {uploading ? 'Uploading...' : 'Change Photo'}
                                </span>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />

                                {userAvatarId && userAvatarId !== 'default' && (
                                    <button
                                        onClick={handleAvatarDeleteClick}
                                        className="absolute bottom-2 right-2 bg-red-600 p-1.5 rounded-full hover:bg-red-500 transition-colors z-20"
                                        title="Remove photo"
                                    >
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                )}
                            </label>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={startEditing}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/25"
                            >
                                Edit Profile
                            </button>
                        )}

                        {/* Stats Grid */}
                        <div className="w-full grid grid-cols-1 gap-3 mt-4">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <span>{stat.icon}</span>
                                        <span>{stat.label}</span>
                                    </div>
                                    <span className="text-white font-bold">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Edit Form or Details + Favorites */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Edit Mode */}
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="bg-black/20 rounded-2xl p-6 border border-white/5 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase mb-1">Location</label>
                                        <input type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase mb-1">Phone</label>
                                        <input type="tel" className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase mb-1">Date of Birth</label>
                                        <input type="date" className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold">Save Changes</button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {/* Personal Info */}
                                <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        Personal Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><p className="text-gray-500">Location</p><p className="text-white">{user.location || 'Not set'}</p></div>
                                        <div><p className="text-gray-500">Phone</p><p className="text-white">{user.phone || 'Not set'}</p></div>
                                        <div><p className="text-gray-500">Birthday</p><p className="text-white">{user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'}</p></div>
                                    </div>
                                </div>

                                {/* Saved Locations */}
                                <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                        Saved Locations
                                    </h3>

                                    <form onSubmit={handleAddFavorite} className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Add a city..."
                                            className="flex-1 bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                            value={newCity}
                                            onChange={(e) => setNewCity(e.target.value)}
                                        />
                                        <button type="submit" className="px-3 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors text-sm font-bold">+</button>
                                    </form>

                                    <div className="flex flex-wrap gap-2">
                                        {savedLocs.length > 0 ? (
                                            savedLocs.map((city, idx) => (
                                                <div key={idx} className="group flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5 hover:border-blue-500/50 transition-colors">
                                                    <Link to="/" className="text-gray-300 hover:text-white text-sm">{city}</Link>
                                                    <button onClick={() => removeFavorite(city)} className="text-gray-500 hover:text-red-400">×</button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">No saved locations yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                    <button onClick={handleLogout} className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-medium text-sm">
                        Log Out
                    </button>
                </div>

                {/* DELETE CONFIRMATION MODAL */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl scale-100 animate-scaleIn">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white">Remove Avatar?</h3>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Are you sure you want to delete your profile picture? This action cannot be undone.
                                    </p>
                                </div>

                                <div className="flex gap-3 w-full mt-2">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 font-bold transition-colors shadow-lg shadow-red-500/20"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
export default Profile;
