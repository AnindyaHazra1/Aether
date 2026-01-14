import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/'); // Redirect to Dashboard
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md mx-4 transform transition-all hover:scale-[1.01] duration-300">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h2>
            <p className="text-gray-400 text-center mb-8">Join Aether and track your atmosphere</p>

            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-500"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-500"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-500"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all transform hover:scale-[1.02]"
                >
                    Create Account
                </button>
            </form>

            <p className="text-gray-400 text-center mt-6 text-sm">
                Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">Log In</Link>
            </p>
            <div className="mt-4 text-center">
                <Link to="/" className="text-gray-500 hover:text-white text-xs transition-colors">← Back to Weather</Link>
            </div>
        </div>
    );
};

export default Signup;
