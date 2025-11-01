import React from 'react';

export type ModelType = 'gemini-2.5-flash' | 'gemini-2.5-pro';
export type Theme = 'abyss' | 'forest' | 'rose-gold' | 'latte';
export type IconStyle = 'line' | 'solid';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  isWebSearchEnabled: boolean;
  onWebSearchToggle: (enabled: boolean) => void;
  isToolsEnabled: boolean;
  onToolsToggle: (enabled: boolean) => void;
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  selectedIconStyle: IconStyle;
  onIconStyleChange: (style: IconStyle) => void;
}

const THEMES: { name: string; id: Theme }[] = [
    { name: 'Abyss', id: 'abyss' },
    { name: 'Forest', id: 'forest' },
    { name: 'Rose Gold', id: 'rose-gold' },
    { name: 'Latte', id: 'latte' },
];

const ICON_STYLES: { name: string; id: IconStyle }[] = [
    { name: 'Line', id: 'line' },
    { name: 'Solid', id: 'solid' },
];

const Toggle: React.FC<{ label: string; enabled: boolean; onToggle: () => void }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between">
        <label onClick={onToggle} className="text-sm font-medium cursor-pointer select-none text-[var(--color-text)]">
            {label}
        </label>
        <button
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            className={`${enabled ? 'bg-[var(--color-primary)]' : 'bg-black/20'} relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-transparent`}
        >
            <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
);

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen,
    onClose,
    selectedModel,
    onModelChange,
    isWebSearchEnabled,
    onWebSearchToggle,
    isToolsEnabled,
    onToolsToggle,
    selectedTheme,
    onThemeChange,
    selectedIconStyle,
    onIconStyleChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
        <div 
            className="absolute top-16 right-4 w-72 glass-pane rounded-lg shadow-2xl p-4 space-y-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="space-y-2">
                <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Model</h3>
                <div className="flex items-center bg-black/20 border border-[var(--color-glass-border)] rounded-full p-0.5">
                    <button
                        onClick={() => onModelChange('gemini-2.5-flash')}
                        className={`flex-1 px-3 py-0.5 rounded-full text-xs transition-colors ${selectedModel === 'gemini-2.5-flash' ? 'bg-[var(--color-primary)] text-white font-semibold' : 'hover:bg-white/10'}`}
                    >
                        Flash
                    </button>
                    <button
                        onClick={() => onModelChange('gemini-2.5-pro')}
                        className={`flex-1 px-3 py-0.5 rounded-full text-xs transition-colors ${selectedModel === 'gemini-2.5-pro' ? 'bg-[var(--color-primary)] text-white font-semibold' : 'hover:bg-white/10'}`}
                    >
                        Pro
                    </button>
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Tools</h3>
                <Toggle label="Web Search" enabled={isWebSearchEnabled} onToggle={() => onWebSearchToggle(!isWebSearchEnabled)} />
                <Toggle label="External Tools" enabled={isToolsEnabled} onToggle={() => onToolsToggle(!isToolsEnabled)} />
            </div>

            <div className="space-y-2 pt-2">
                <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Theme</h3>
                <select
                    value={selectedTheme}
                    onChange={(e) => onThemeChange(e.target.value as Theme)}
                    className="w-full bg-black/20 border border-[var(--color-glass-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                    {THEMES.map(theme => <option key={theme.id} value={theme.id}>{theme.name}</option>)}
                </select>
            </div>
            
            <div className="space-y-2 pt-2">
                <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Icon Style</h3>
                 <div className="flex items-center bg-black/20 border border-[var(--color-glass-border)] rounded-full p-0.5">
                    {ICON_STYLES.map(style => (
                         <button
                            key={style.id}
                            onClick={() => onIconStyleChange(style.id)}
                            className={`flex-1 px-3 py-0.5 rounded-full text-xs transition-colors ${selectedIconStyle === style.id ? 'bg-[var(--color-primary)] text-white font-semibold' : 'hover:bg-white/10'}`}
                        >
                            {style.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default SettingsPanel;