import React from 'react';

const LoadingIndicator: React.FC<{ text?: string }> = ({ text = 'Thinking...' }) => {
  return (
    <div className="flex items-start gap-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0" style={{background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`}}>
        R
      </div>
      <div className="rounded-2xl p-4 glass-pane rounded-bl-none flex items-center shadow-lg">
        <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <span className="italic text-sm">{text}</span>
            <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></span>
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;