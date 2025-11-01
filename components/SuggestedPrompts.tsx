import React from 'react';

interface SuggestedPromptsProps {
    onPromptClick: (prompt: string) => void;
}

const prompts = [
    { title: "Explain a concept", prompt: "Explain quantum computing in simple terms.", icon: "🧠" },
    { title: "Draft an email", prompt: "Draft a professional email to a client requesting feedback.", icon: "✉️" },
    { title: "Write some code", prompt: "Write a python function to check if a number is prime.", icon: "💻" },
    { title: "Get creative", prompt: "Write a short story about a cat who discovers a hidden world.", icon: "🎨" },
];

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onPromptClick }) => {
    return (
        <div className="max-w-3xl mx-auto px-4 md:px-0 mb-4">
            <div className="grid grid-cols-2 gap-3">
                {prompts.map((p, index) => (
                    <button
                        key={index}
                        onClick={() => onPromptClick(p.prompt)}
                        className="glass-pane p-4 rounded-lg text-left hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                        <p className="font-semibold text-[var(--color-text)]">{p.icon} {p.title}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">{p.prompt}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SuggestedPrompts;