import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons components remain same...
const DashboardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
        <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" />
        <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" />
        <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
    </svg>
);

const MapIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Check active path helper
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const menuItems = [
        { Icon: DashboardIcon, label: 'Dashboard', path: '/' },
        { Icon: MapIcon, label: 'Map', path: '/map' },
        { Icon: SettingsIcon, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="hidden md:flex flex-col w-16 bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-[2rem] py-6 items-center gap-6 h-[75vh] mt-12 ml-4">
            <div className="w-10 h-10 flex items-center justify-center mb-2 text-blue-400 cursor-pointer" onClick={() => navigate('/')}>
                {/* Simple Logo Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M4.93 19.07L6.34 17.66M19.07 19.07L17.66 17.66M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>

            <div className="flex flex-col gap-6 w-full items-center flex-1">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center gap-1 transition-colors duration-200 group relative ${isActive(item.path) ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {isActive(item.path) && (
                            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-lg"></div>
                        )}
                        <item.Icon />
                    </button>
                ))}
            </div>

            <div className="mt-auto">
                <button
                    onClick={() => navigate(user ? '/profile' : '/login')}
                    className={`w-12 h-12 rounded-full border-2 overflow-hidden shadow-lg transition-all ${user ? 'border-teal-400' : 'border-white/20 hover:border-blue-400'}`}
                >
                    {user ? (
                        <img
                            src={
                                (!user.avatarId || user.avatarId === 'default')
                                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=random&color=fff&size=200`
                                    : (user.avatarId.startsWith('/uploads') ? `http://localhost:5001${user.avatarId}` : user.avatarId)
                            }
                            alt={user.username}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <svg className="w-full h-full p-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
