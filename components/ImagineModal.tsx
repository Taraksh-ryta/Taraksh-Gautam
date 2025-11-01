import React, { useState } from 'react';
import { Icon } from './icons/Icon';
import { IconStyle } from './SettingsPanel';

// Enhanced STYLES array with base64 preview images
const STYLES = [
    { name: 'Default', value: '', preview: 'default' },
    { name: 'Photorealistic', value: 'photorealistic, 8k, detailed, professional photography', preview: 'data:image/jpeg;base64,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'},
    { name: 'Anime', value: 'anime style, vibrant, key visual, digital illustration', preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHbSUNDX1BST0ZJTEUAAQEAAAHLAAAAAAJAAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLVF0BQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWFlaIAAAAAAAAGrhAAAumwAAJqcWFlaIAAAAAAAACgdAAABPAPAAAFhZGVzYwAAAAAAAAAaPG1haW4+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsdW1pAAAAAAAAAAEAAAABJQI//8IAEQgAZABkAwEiAAIRAQMRAf/EABwAAQADAQEBAQEAAAAAAAAAAAAGBQQDCAIBB//EADsQAAIBAgMFAwgJBAMAAAAAAAECAwQRAAUSIQYxExRBUWEHInGBkaEVMrHB0fAUIyRCUnLh8VNiCP/EABoBAQADAQEBAAAAAAAAAAAAAAABAgMEBQb/xAAlEQEAAgEEAgEDBQAAAAAAAAABAAIRIQMSMUFRBBMiMmFxgaH/2gAMAwEAAhEDEQA/AP00eY9B9POfkAAgAANaWVYY2kkYLGilmY8AOpO+o9R5+E6jTUkUq0kUMtUf4aSSlVkPuufiO24JpTTV8k00VLU1aQp8Q0dPCqLGrAE+LliWOF9wN9w+o5R1Uf8AK8e392l+k9b4M4q+mG0zV9RTw11L+qMkbKssfrFmC7gjeNsjQzU1J+K630T/kO01L/ABWt9E/5HU90g9bU0kM0dPNURRzS/kRuwDP9B3+HVx9JSUk1GZ3jigp4mRDKwCKCxABJO3UnoN/Q/mNPTQ1VNLDUxJLDIpV0cXVgeBB6H3n5hR6ZpNMpo1JpooKaH8CJFCIn0A2A7HkADaAIAA21E8dPBLNM6xwxKXd2OAqgZJJ6YnX5r+JNBW17aXSVdPLVp+aKOVSw+XUexwep26H5l460tPX0U9JVRrLTzIY5EYZDKRggjvnE/O9B+G2l6LUxqaU1EtTHlYxNKXWNfRRxjHUknoAO4AEAGaACAAIAA11VVFTU8lRVSxw08Sl5JJGCqigZJJPAA7nYH5npPxF0DW1q0dJqlK9SxwqvIEZ/QMQAfYnflv1/Qta0pWabqKU1s9AJYmQ1MJAkjBGQ6k8EDcHr06H4l4e/DSjpKxajU6p61VJIgij8JW/wAxySfngeo7gAgAzQACAAIAA/PNa/ELQdDrY0zU6xKlUCB4oQZFTPAPkCB9M5+WOk07VNN1fTpKrTarhqadclZInDKR2IO4PbqPzDSPwr0TSdU/aFRHPNVO/iCKZw6IxOSQMYJ5JxzwMZ7fYAEAGaACAAIAA/LtY/ETw9oOpmgqtUinq0OJFpwZRGexYAgH2znscHcdroWt6Jr1A1Zo+pw1lMOC0bZKexUjBHse/LcdLovhToGi6t+0tP0tI6oHMaO5do1J5KoSVH0wB2x2+gAIAM0AAgACAAPl3xX/DXRta1KXVNLqpNL1KRi8ipGHiZzzgZBVj1JBAJyd+o+mAIAM0AAgACAAIAPlfjH8NNF8UVo1Ol1Z0vU3GXKxBopD/MQCASepBHcgnJPyIA/QOQAPlfjP8O9E8U1f7S0+qbS9Sfh5FiDRzEd2AIIPqCD2JPJ+lAIAM0AAgACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k='},
    { name: 'Fantasy Art', value: 'fantasy art, epic, detailed, matte painting', preview: 'data:image/jpeg;base64,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'},
    { name: 'Cyberpunk', value: 'cyberpunk style, neon lights, futuristic city, dystopian', preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHbSUNDX1BST0ZJTEUAAQEAAAHLAAAAAAJAAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLVF0BQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWFlaIAAAAAAAAGrhAAAumwAAJqcWFlaIAAAAAAAACgdAAABPAPAAAFhZGVzYwAAAAAAAAAaPG1haW4+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsdW1pAAAAAAAAAAEAAAABJQI//8IAEQgAZABkAwEiAAIRAQMRAf/EABsAAQEBAQEBAQEAAAAAAAAAAAAGBQQDAgEH/8QANxAAAgIBAgMDBwoHAAAAAAAAAAECAwQFERIhBjFBURMUYSJCcYGRobHB0RUiM1JTYnLh8PGy/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QAIxEBAAICAgICAgMAAAAAAAAAAAECERIDEyExQRQiUWFxgf/aAAwDAQACEQMRAD8A/UMAAAAAAAAAAAAAAAAAAAAAAAHC689Z0/s2D+o4p+H/rHT+z4L6jlN8Xl09vGf5nQADkUAAAAAAAAAAAAAAAAPldlVdEJV2SirYpcpP0UUSv0s6x0zH2TsuvLXZr4l8/iO5+H/rHT+z4L6jo8B4m/J3eD8Uf+H/AHzbXfWlqP8A8eX/AHM7gB1YAAAAAAAAAAAAAAAADDcQ6hLTeHtb1GEVO6mizIo+UnFfV2/Uvj4y31eMvO/pG1S6O3S6RCSjfY5XZp84ryS/1f9j1fh39J/q8P8U/9f6d3R6bT6LpsNNpkFCisJSjH5mJABUAAAAAAAAAAAAAAAAMdxj+6ev/s7P7Wc/wDSV+y6f+8f3SOh4x/dPX/2dn9rPnz6WNQjd1DTaXFr+hpytk/ByfyS/wCj0fhX6T/V4f4f/p/k7jgv919H/Yf3y5Y4L/dfR/2H98uT1xUAAAAAAAAAAAAAAAABnOPNPt1fhvU4UIuV0Y+1hHylNfV+b9S/AmeA1vS3aLqt+mXw9tptkoS+f8Gj9gPC/SzR6fVaZrdcZRx3ZKNkfLnz+aPV+Hf/wAn+rxfxL7f1+na8E6vTq/DemzhZGV0IpWwXnCa+t9PVP0a9S5o8N6P4gvw/4j6x2pWW43ZJ1yXhXF8pL8Gvl5M9vA2gAAAAAAAAAAAAAAAAAA8l+nXU51cQ4NMpPlpsIzn85yflF/wCS/Jj7/Fj8XnJ49X+15+Nn/wCNWpf/ACx+0j3uS/SrqE7vEuohKXEccYQj5KMV6L82/wA2PZ+Hf0l+rxfw3+n8nf8ABf7r6P8AsP75cseC/wB19H/Yf3y5PXFQAAAAAAAAAAAAAAAAAA/Of0laNbovijUp0wca7ZK6uS9E5Lz+cfJmXwX6RNQ0jS4abqsPbadRwrJpLtQS8k/NL58vQ/WfEXDWl8S6UqNRg1V05Kq5fWhLzT/k/U8X4i+jbW9GuWTQJLUacvSvh3x+S8n+Poe74X4zDPHt5s/n/ANf+npaN+lPgvUq1ZfG6hSfK66CUF+KXkvzTNCv6R/Bdlv8Av3r4/d2L+8+H6n0ZcR6Z1lq+E8N3r4VzWf8nJmD0XwN4z1d0bLqNNs3F+1nck3/AONv5np9/H/P8uWvH8Q0n6SvCGmX1t12lR9JSpnL+80j1cT8Z6Fwlp7tT4i1CqmHnH/FLyeMfVtnmND+g7Wbq/wDPOINKq/OqHtn/APtHquHvo44M4cnG++qep6knzK65eYv/AMx8l/u/BGe+r5d7x4AAAAAAAAAAAAAAAAAAAAAAAD/2Q=='},
    { name: 'Minimalist', value: 'minimalist, clean lines, simple, modern', preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHbSUNDX1BST0ZJTEUAAQEAAAHLAAAAAAJAAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLVF0BQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWFlaIAAAAAAAAGrhAAAumwAAJqcWFlaIAAAAAAAACgdAAABPAPAAAFhZGVzYwAAAAAAAAAaPG1haW4+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsdW1pAAAAAAAAAAEAAAABJQI//8IAEQgAZABkAwEiAAIRAQMRAf/EABsAAQACAwEBAAAAAAAAAAAAAAAGBwECBAUD/8QANxAAAgEDAwMCBAEKBwAAAAAAAAECAwQFBhESIQcxQRMiUWFxFBUycYEWM0KBkSRScqGissH/xAAYAQEAAwEAAAAAAAAAAAAAAAAAAQIDBP/EACERAQEAAgICAQUAAAAAAAAAAAABAhEDEhMhMVEyQWGB/9oADAMBAAIRAxEAPwD9QwAAAAAAAAAAAAAB4qVqdhp9lVv7+tb0q0VloVakYyS97JgZ1/FfhiLes74j6SreN0p3NPB+j3z+h4v4v+Hq/8x6P9ei/8gOlgVH/ABg8Of8AmTR/12n/AOQ/xg8Of+ZNH/Xaf/kB0gCov4weHP8AzJo/67T/APIP4weHP/Mmj/rtP/yA6QBUX8YPDn/mTR/12n/5D/GDw5/5k0f9dp/+QHSACo/4weHP/Mmj/rtP/wAg/jB4c/8AMmj/AK7T/wDIDpABUf8AGDw5/wCZNH/Xaf8A5D/ABg8Of8AmTR/12n/AOQHSACof4weHP8AzJo/67T/APIP4weHP/Mmj/rtP/yA6QBUf8YPDn/mTR/12n/5A/GDw5/5k0f9dp/+QHSACo/4weHP/Mmj/rtP/wAg/jB4c/8AMmj/AK7T/wDIDpAHi0vUtP1e1Vzpt3QurZ8SowqKcfzWfUeYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z'},
    { name: 'Watercolor', value: 'watercolor painting, soft, blended colors', preview: 'data:image/jpeg;base64,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'},
];

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;
type AspectRatio = typeof ASPECT_RATIOS[number];

const AspectRatioIcon: React.FC<{ ratio: AspectRatio }> = ({ ratio }) => {
    const dimensions: { [key in AspectRatio]: { w: number, h: number } } = {
        '1:1': { w: 20, h: 20 },
        '16:9': { w: 24, h: 13.5 },
        '9:16': { w: 13.5, h: 24 },
        '4:3': { w: 22, h: 16.5 },
        '3:4': { w: 16.5, h: 22 },
    };
    const d = dimensions[ratio];
    return (
        <svg viewBox="0 0 28 28" className="w-5 h-5" fill="currentColor">
            <rect 
                x={(28 - d.w) / 2} 
                y={(28 - d.h) / 2}
                width={d.w} 
                height={d.h} 
                rx="2"
            />
        </svg>
    );
};

export interface ImagineOptions {
    prompt: string;
    negativePrompt: string;
    style: typeof STYLES[0];
    aspectRatio: AspectRatio;
}

interface ImagineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: ImagineOptions) => void;
  iconStyle: IconStyle;
}

const ImagineModal: React.FC<ImagineModalProps> = ({ isOpen, onClose, onGenerate, iconStyle }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState(STYLES[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onGenerate({ prompt, negativePrompt, style, aspectRatio });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-pane rounded-xl shadow-2xl w-full max-w-3xl m-4 p-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Generate Image</h2>
          <button onClick={onClose} className="p-1 rounded-full text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text)]">
            <Icon name="close" style={iconStyle} className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 -mr-2 mt-4 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic cityscape at sunset..."
                  className="w-full bg-black/20 border border-[var(--color-glass-border)] rounded-lg px-4 py-2 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow duration-200 resize-y"
                />
              </div>
              <div>
                <label htmlFor="negative-prompt" className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                  Negative Prompt (Optional)
                </label>
                <input
                  id="negative-prompt"
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="e.g., text, watermarks, blurry"
                  className="w-full bg-black/20 border border-[var(--color-glass-border)] rounded-lg px-4 py-2 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow duration-200"
                />
              </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-3">Style</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                    {STYLES.map(s => (
                        <button 
                            key={s.name}
                            onClick={() => setStyle(s)}
                            className={`relative group aspect-square rounded-lg border-2 transition-all duration-200 focus:outline-none ${style.name === s.name ? 'border-[var(--color-primary)] scale-105' : 'border-transparent hover:border-white/50'}`}
                            title={s.name}
                        >
                            {s.preview === 'default' ? (
                                <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-md">
                                    <Icon name="image" style={iconStyle} className="w-8 h-8 text-[var(--color-text-muted)]" />
                                </div>
                            ) : (
                                <img src={s.preview} alt={s.name} className="w-full h-full object-cover rounded-md" />
                            )}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-md transition-opacity ${style.name === s.name ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}></div>
                            <span className="absolute bottom-1.5 left-0 right-0 text-center text-xs font-semibold text-white truncate px-1">{s.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-3">Aspect Ratio</label>
                <div className="flex flex-wrap gap-3">
                    {ASPECT_RATIOS.map(ar => (
                        <button
                            key={ar}
                            onClick={() => setAspectRatio(ar)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${aspectRatio === ar ? 'bg-[var(--color-primary)] text-white border-transparent' : 'bg-black/20 border-transparent text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text)]'}`}
                        >
                            <AspectRatioIcon ratio={ar} />
                            {ar}
                        </button>
                    ))}
                </div>
            </div>
        </div>


        <div className="flex justify-end gap-4 pt-4 flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-muted)] bg-black/20 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-[var(--color-primary)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagineModal;
