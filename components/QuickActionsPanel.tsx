import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './icons/Icon';
import { IconStyle } from './SettingsPanel';

interface QuickActionsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onRegenerate: () => void;
    onExport: (format: 'pdf' | 'md') => void;
    canRegenerate: boolean;
    iconStyle: IconStyle;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ isOpen, onClose, onRegenerate, onExport, canRegenerate, iconStyle }) => {
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleExport = (format: 'pdf' | 'md') => {
        onExport(format);
        onClose();
    };
    
    const handleRegenerate = () => {
        onRegenerate();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-30" onClick={onClose}>
            <div 
                ref={panelRef}
                className="absolute top-16 right-4 w-60 glass-pane rounded-lg shadow-2xl p-2 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-1">
                    <button
                        onClick={handleRegenerate}
                        disabled={!canRegenerate}
                        className="w-full text-left px-3 py-2 text-sm text-[var(--color-text)] hover:bg-white/10 rounded-md flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Icon name="regenerate" style={iconStyle} className="w-4 h-4" />
                        Regenerate Response
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsExportMenuOpen(prev => !prev)}
                            className="w-full text-left px-3 py-2 text-sm text-[var(--color-text)] hover:bg-white/10 rounded-md flex items-center gap-3"
                        >
                            <Icon name="download" style={iconStyle} className="w-4 h-4" />
                            Export Chat
                        </button>
                        {isExportMenuOpen && (
                            <div className="mt-1 space-y-1 pl-6 animate-fade-in">
                                <button onClick={() => handleExport('md')} className="w-full text-left px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 rounded-md">as Markdown (.md)</button>
                                <button onClick={() => handleExport('pdf')} className="w-full text-left px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 rounded-md">as PDF (.pdf)</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickActionsPanel;