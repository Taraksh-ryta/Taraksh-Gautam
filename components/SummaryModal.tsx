import React from 'react';
import { formatContent } from '../utils';
import { Icon } from './icons/Icon';
import { IconStyle } from './SettingsPanel';

interface SummaryModalProps {
    summary: string;
    isLoading: boolean;
    onClose: () => void;
    iconStyle: IconStyle;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="w-10 h-10 border-4 border-t-[var(--color-primary)] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
    </div>
);

const SummaryModal: React.FC<SummaryModalProps> = ({ summary, isLoading, onClose, iconStyle }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
        onClick={onClose}
    >
      <div
        className="glass-pane rounded-xl shadow-2xl w-full max-w-2xl m-4 h-3/4 max-h-[700px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--color-glass-border)] flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-bold text-[var(--color-text)]">Conversation Summary</h2>
          <button onClick={onClose} className="p-1 rounded-full text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text)]">
            <Icon name="close" style={iconStyle} className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div
                className="prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={formatContent(summary)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;