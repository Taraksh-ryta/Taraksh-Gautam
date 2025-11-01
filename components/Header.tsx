import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { Icon } from './icons/Icon';
import { IconStyle } from './SettingsPanel';

const Header: React.FC<{ 
  user: User | null;
  onLogout: () => void;
  onSignIn: () => void;
  onToggleSidebar: () => void;
  onToggleSettings: () => void;
  onToggleQuickActions: () => void;
  onSummarize: () => void;
  isConversationActive: boolean;
  iconStyle: IconStyle;
}> = ({ user, onLogout, onSignIn, onToggleSidebar, onToggleSettings, onToggleQuickActions, onSummarize, isConversationActive, iconStyle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-transparent p-4 absolute top-0 left-0 right-0 z-20 flex items-center justify-between">
      <div className="flex-1 flex justify-start items-center gap-2">
        {user && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            <Icon name="menu" style={iconStyle} className="w-6 h-6" />
          </button>
        )}
      </div>
      <div className="flex-1 text-center">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text" style={{backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`}}>
          Ryt
        </h1>
      </div>
      <div className="flex-1 flex justify-end items-center gap-2">
        {user && isConversationActive && (
          <>
            <button
              onClick={onSummarize}
              className="p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/10 transition-colors"
              aria-label="Summarize conversation"
            >
              <Icon name="summarize" style={iconStyle} className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleQuickActions}
              className="p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/10 transition-colors"
              aria-label="Quick Actions"
            >
              <Icon name="quickActions" style={iconStyle} className="w-5 h-5" />
            </button>
          </>
        )}
        
        {user ? (
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white uppercase"
                    style={{background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`}}
                >
                    {user.email.charAt(0)}
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-pane rounded-lg shadow-xl py-1 z-20 animate-fade-in">
                        <p className="px-4 py-2 text-sm text-[var(--color-text-muted)] border-b border-[var(--color-glass-border)] truncate">{user.email}</p>
                        <button
                            onClick={onToggleSettings}
                            className="w-full text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-white/10 flex items-center gap-3"
                        >
                            <Icon name="settings" style={iconStyle} className="w-4 h-4" />
                            Settings
                        </button>
                        <button
                            onClick={onLogout}
                            className="w-full text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-white/10 flex items-center gap-3"
                        >
                            <Icon name="logout" style={iconStyle} className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        ) : (
            <button
                onClick={onSignIn}
                className="bg-[var(--color-primary)] text-white rounded-lg px-4 py-1.5 text-sm font-semibold hover:opacity-80 transition-opacity"
            >
                Sign In
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;