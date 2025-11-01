import React from 'react';
import SuggestedPrompts from './SuggestedPrompts';
import { Icon } from './icons/Icon';
import { IconStyle } from './SettingsPanel';

interface WelcomeProps {
    onPromptClick: (prompt: string) => void;
    iconStyle: IconStyle;
}

const CodeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
);

const LightbulbIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c-1.28-.28-2.427-.86-3.234-1.634a7.5 7.5 0 1114.268 0c-.807.772-1.954 1.352-3.234 1.632zM12 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
    </svg>
);


const Welcome: React.FC<WelcomeProps> = ({ onPromptClick, iconStyle }) => {
    const capabilities = [
        {
            icon: <Icon name="image" style={iconStyle} className="w-6 h-6" />,
            title: 'Analyze Images',
            description: 'Understand and discuss the contents of any picture.',
        },
        {
            icon: <CodeIcon className="w-6 h-6" />,
            title: 'Generate Code',
            description: 'Write scripts, functions, and entire applications.',
        },
        {
            icon: <LightbulbIcon className="w-6 h-6" />,
            title: 'Brainstorm Ideas',
            description: 'Explore creative concepts for any project or topic.',
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 -mt-16">
            <div className="relative w-24 h-24 mb-6 animate-welcome-fade-in welcome-logo">
                <div 
                    className="absolute inset-0 rounded-full opacity-50 blur-xl"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                ></div>
                <div 
                    className="absolute w-20 h-20 top-1/2 left-1/2 rounded-full"
                    style={{ animation: 'float 6s ease-in-out infinite', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                ></div>
                <div 
                    className="absolute w-12 h-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-bg)]"
                ></div>
                <div 
                    className="absolute w-8 h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full font-bold text-2xl flex items-center justify-center text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                >
                    R
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white/90 to-white/60 animate-welcome-fade-in welcome-title">
                How can I help you today?
            </h1>
            
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                {capabilities.map((cap, index) => (
                    <div key={index} className={`glass-pane p-4 rounded-xl text-left animate-welcome-fade-in welcome-card-${index + 1}`}>
                        <div className="flex items-center gap-3 text-[var(--color-primary)]">
                            {cap.icon}
                            <h3 className="font-semibold text-[var(--color-text)]">{cap.title}</h3>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mt-2">{cap.description}</p>
                    </div>
                ))}
            </div>

            <div className="w-full max-w-3xl animate-welcome-fade-in welcome-prompts">
                <SuggestedPrompts onPromptClick={onPromptClick} />
            </div>
        </div>
    );
};

export default Welcome;