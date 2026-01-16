import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Toast from './Toast';

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
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    const showToast = (message, type = 'info') => {
        setToast({ message, type, visible: true });
    };

    // Defensive checks for user data
    // Deduplicate saved locations for display
    const savedLocs = [...new Set(user?.savedLocations || [])];
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
            showToast(`${newCity} added to favorites`, 'success');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                showToast(err.response.data.error, 'error');
            } else {
                showToast("Failed to add location", 'error');
            }
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
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const url = `${baseUrl}${userAvatarId}`;
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
        <div className="flex justify-center items-start min-h-[calc(100vh-2rem)] py-4 md:py-6 px-4">
            <div className="w-full max-w-4xl bg-[#1e293b]/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none"></div>
                <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex items-center gap-4 mb-8 md:mb-12 relative z-10">
                    <Link to="/" className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">My Profile</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 relative z-10">

                    {/* Left Column: Avatar & Basic Info */}
                    <div className="lg:col-span-1 flex flex-col items-center text-center space-y-6">
                        <div className="relative group/avatar">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur opacity-20 group-hover/avatar:opacity-40 transition-opacity duration-500"></div>
                            <img
                                src={getAvatarSrc()}
                                alt="Avatar"
                                className="relative w-36 h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/10 shadow-2xl bg-[#0f172a]"
                            />

                            {/* Upload Overlay */}
                            <label className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 scale-95 group-hover/avatar:scale-100">
                                <span className="text-xs text-white font-bold mb-2 uppercase tracking-wider">
                                    {uploading ? 'Updating...' : 'Change Photo'}
                                </span>
                                <div className="p-2 bg-white/20 rounded-full">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />

                                {userAvatarId && userAvatarId !== 'default' && (
                                    <button
                                        onClick={handleAvatarDeleteClick}
                                        className="absolute bottom-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                        title="Remove photo"
                                    >
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                )}
                            </label>
                        </div>

                        {/* Mobile Only: Visible Remove Button */}
                        {userAvatarId && userAvatarId !== 'default' && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="md:hidden text-red-400 text-xs font-bold uppercase tracking-wider hover:text-red-300 transition-colors"
                            >
                                Remove Photo
                            </button>
                        )}

                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{user.username}</h2>
                            <p className="text-blue-200/60 font-medium">{user.email}</p>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={startEditing}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                Edit Profile
                            </button>
                        )}

                        {/* Stats Grid */}
                        <div className="w-full grid grid-cols-3 lg:grid-cols-1 gap-3 md:gap-4 mt-2">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-2 hover:bg-white/[0.06] transition-colors">
                                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                                        <span className="text-xl">{stat.icon}</span>
                                        <span className="hidden lg:inline">{stat.label}</span>
                                    </div>
                                    <div className="text-center lg:text-right">
                                        <span className="block lg:hidden text-xs text-gray-500 mb-1">{stat.label}</span>
                                        <span className="text-white font-bold text-lg">{stat.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Edit Form or Details + Favorites */}
                    <div className="lg:col-span-2 space-y-6 md:space-y-8">

                        {/* Edit Mode */}
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="bg-white/[0.02] backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/5 space-y-6 md:space-y-8 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-blue-300/80 text-xs font-bold uppercase tracking-wider ml-1">Location</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all placeholder-gray-600"
                                                placeholder="City, Country"
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-blue-300/80 text-xs font-bold uppercase tracking-wider ml-1">Phone</label>
                                        <input
                                            type="tel"
                                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all placeholder-gray-600"
                                            placeholder="+1 234 567 890"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-blue-300/80 text-xs font-bold uppercase tracking-wider ml-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all [color-scheme:dark]"
                                            value={formData.dob}
                                            onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Saving...
                                            </>
                                        ) : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6 md:space-y-8 animate-fadeIn">
                                {/* Personal Info */}
                                <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/5 shadow-inner">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        </div>
                                        Personal Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.02]">
                                            <p className="text-blue-300/60 text-xs font-bold uppercase tracking-wider mb-1">Location</p>
                                            <p className="text-white text-lg font-medium">{user.location || 'Not set'}</p>
                                        </div>
                                        <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.02]">
                                            <p className="text-blue-300/60 text-xs font-bold uppercase tracking-wider mb-1">Phone</p>
                                            <p className="text-white text-lg font-medium">{user.phone || 'Not set'}</p>
                                        </div>
                                        <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.02] md:col-span-2">
                                            <p className="text-blue-300/60 text-xs font-bold uppercase tracking-wider mb-1">Birthday</p>
                                            <p className="text-white text-lg font-medium">{user.dob ? new Date(user.dob).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Not set'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Saved Locations */}
                                <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/5 shadow-inner">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                        </div>
                                        Saved Locations
                                    </h3>

                                    <form onSubmit={handleAddFavorite} className="flex gap-3 mb-6">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                placeholder="Add a new city..."
                                                className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder-gray-500"
                                                value={newCity}
                                                onChange={(e) => setNewCity(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-2 top-1.5 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                            </button>
                                        </div>
                                    </form>

                                    <div className="flex flex-wrap gap-3">
                                        {savedLocs.length > 0 ? (
                                            savedLocs.map((city, idx) => (
                                                <div key={idx} className="group flex items-center gap-3 bg-white/[0.03] pl-4 pr-2 py-2 rounded-full border border-white/10 hover:border-blue-500/50 hover:bg-white/[0.06] transition-all">
                                                    <Link to="/" className="text-gray-200 hover:text-white font-medium text-sm">{city}</Link>
                                                    <button
                                                        onClick={() => removeFavorite(city)}
                                                        className="w-6 h-6 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="w-full text-center py-8 border-2 border-dashed border-white/5 rounded-2xl">
                                                <p className="text-gray-500 text-sm italic">No saved locations yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
                    <button onClick={handleLogout} className="px-6 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl transition-all font-medium text-sm flex items-center gap-2 group">
                        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Sign Out
                    </button>
                </div>

                {/* DELETE CONFIRMATION MODAL */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                        <div className="bg-[#1e293b] border border-white/10 rounded-[2rem] p-8 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-100 animate-scaleIn">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center ring-4 ring-red-500/5">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Remove Avatar?</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Are you sure you want to delete your profile picture? This action cannot be undone.
                                    </p>
                                </div>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-gray-300 hover:text-white hover:bg-slate-700 font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold transition-all shadow-lg shadow-red-500/20"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            {/* Toast Notification */}
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, visible: false })}
                />
            )}
        </div>
    );
};
export default Profile;
