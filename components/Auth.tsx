import React, { useState } from 'react';
import { Icon } from './icons/Icon';
import { IconStyle } from './SettingsPanel';

interface AuthProps {
    onLogin: (email: string) => void;
    onClose: () => void;
    iconStyle: IconStyle;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onClose, iconStyle }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
        
        onLogin(email);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="glass-pane shadow-2xl rounded-2xl p-8 w-full max-w-md m-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-1 rounded-full text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text)]"
                    aria-label="Close"
                >
                    <Icon name="close" style={iconStyle} className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-[var(--color-text)] text-center mb-6">
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                
                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg p-3 text-center text-sm mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/20 border border-[var(--color-glass-border)] rounded-lg px-4 py-2 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow duration-200"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-[var(--color-glass-border)] rounded-lg px-4 py-2 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow duration-200"
                            placeholder="••••••••"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/20 border border-[var(--color-glass-border)] rounded-lg px-4 py-2 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow duration-200"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[var(--color-primary)] transition-opacity"
                        >
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="font-medium text-[var(--color-primary)] hover:text-[var(--color-secondary)] ml-1"
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;