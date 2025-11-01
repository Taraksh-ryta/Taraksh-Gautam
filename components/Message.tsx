import React, { useState, useRef, useEffect } from 'react';
import { Message, Source, MessageContent } from '../types';
import { formatContent } from '../utils';
import { Icon } from './icons/Icon';
import { IconStyle } from './SettingsPanel';

interface MessageProps {
  message: Message;
  messageId: string;
  onToggleSpeech: (text: string, messageId: string) => void;
  nowPlayingId: string | null;
  ttsLoadingId: string | null;
  iconStyle: IconStyle;
  isEditable: boolean;
  onEdit: () => void;
}

const UserIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0" style={{background: 'var(--color-user-bubble-gradient)'}}>
        U
    </div>
);

const ModelIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0" style={{background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`}}>
        R
    </div>
);

const TtsSpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 17.75V21.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.0708 4.9292L16.5962 7.40385" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.40381 16.5962L4.92916 19.0708" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.25 12L2.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.0708 19.0708L16.5962 16.5962" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.40381 7.40385L4.92916 4.9292" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const TextContent: React.FC<{ text: string; sources?: Source[] }> = ({ text, sources }) => (
    <>
        <div
            className="prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={formatContent(text)}
        />
        {sources && sources.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-3">
                <h4 className="text-xs font-semibold text-[var(--color-text-muted)] mb-2">Sources:</h4>
                <div className="flex flex-wrap gap-2">
                    {sources.map((source, index) => (
                        <div key={index} className="relative group">
                            <a
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--color-secondary)] bg-black/20 hover:bg-black/40 rounded-full px-3 py-1 text-xs truncate transition-colors cursor-pointer"
                            >
                                {source.title || new URL(source.uri).hostname}
                            </a>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs glass-pane text-[var(--color-text)] text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
                                <p className="font-bold truncate max-w-[240px]">{source.title || 'N/A'}</p>
                                <p className="text-[var(--color-text-muted)] break-all">{source.uri}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>
);

const ImageContent: React.FC<{ src: string; prompt?: string, iconStyle: IconStyle }> = ({ src, prompt, iconStyle }) => {
    const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
    const downloadMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
            setIsDownloadMenuOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const downloadImage = (format: 'png' | 'jpg' | 'pdf') => {
        setIsDownloadMenuOpen(false);
        const img = new Image();
        img.crossOrigin = 'anonymous';
    
        img.onload = () => {
            if (format === 'pdf') {
                const { jsPDF } = (window as any).jspdf;
                const orientation = img.width > img.height ? 'l' : 'p';
                const doc = new jsPDF({
                    orientation,
                    unit: 'px',
                    format: [img.width, img.height]
                });
                doc.addImage(img, 'PNG', 0, 0, img.width, img.height);
                doc.save('ryt-image.pdf');
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if(!ctx) return;
            ctx.drawImage(img, 0, 0);
    
            const link = document.createElement('a');
            link.download = `ryt-image.${format}`;
            link.href = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    
        img.src = src;
    };


    return (
        <div className="space-y-2 group relative">
          {src === 'generating' ? (
            <div className="w-full aspect-square bg-black/20 border border-white/10 rounded-lg flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 text-[var(--color-primary)]/50 relative">
                    <Icon name="image" style={iconStyle} className="w-full h-full" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-[var(--color-primary)] border-r-[var(--color-primary)]/30 border-b-[var(--color-primary)]/30 border-l-[var(--color-primary)]/30 animate-spin"></div>
                </div>
                <span className="text-[var(--color-text-muted)] text-sm">Generating image...</span>
            </div>
          ) : src === 'error' ? (
            <div className="w-full aspect-square bg-red-900/50 border border-red-500/50 rounded-lg flex flex-col items-center justify-center text-center p-4">
                 <span className="text-red-300 text-sm font-semibold">Failed to generate image.</span>
                 <p className="text-xs text-red-300/80 mt-1">Please try a different prompt.</p>
            </div>
          ) : (
            <>
                <img src={src} alt={prompt || "Generated image"} className="rounded-lg max-w-full h-auto border border-white/10" />
                {prompt && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" ref={downloadMenuRef}>
                        <button 
                            onClick={() => setIsDownloadMenuOpen(prev => !prev)}
                            className="p-1.5 bg-black/30 backdrop-blur-md rounded-full text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white"
                        >
                            <Icon name="download" style={iconStyle} className="w-4 h-4" />
                        </button>
                        {isDownloadMenuOpen && (
                            <div className="absolute right-0 mt-2 w-32 glass-pane rounded-md shadow-lg py-1 z-10">
                                <button onClick={() => downloadImage('png')} className="w-full text-left px-3 py-1.5 text-xs text-[var(--color-text)] hover:bg-white/10">PNG</button>
                                <button onClick={() => downloadImage('jpg')} className="w-full text-left px-3 py-1.5 text-xs text-[var(--color-text)] hover:bg-white/10">JPG</button>
                                <button onClick={() => downloadImage('pdf')} className="w-full text-left px-3 py-1.5 text-xs text-[var(--color-text)] hover:bg-white/10">PDF</button>
                            </div>
                        )}
                    </div>
                )}
            </>
          )}
          {prompt && <p className="text-xs text-[var(--color-text-muted)] italic">
              <span className="font-semibold">Prompt:</span> {prompt}
          </p>}
        </div>
    );
};

const ToolCallContent: React.FC<{ call: { name: string; args: any }, iconStyle: IconStyle }> = ({ call, iconStyle }) => {
    const location = call.args.location;
    return (
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] italic">
            <Icon name="tool" style={iconStyle} className="w-4 h-4 text-[var(--color-primary)]" />
            <span>
                Using weather tool for {location}...
            </span>
        </div>
    );
};


const MessageComponent: React.FC<MessageProps> = ({ message, messageId, onToggleSpeech, nowPlayingId, ttsLoadingId, iconStyle, isEditable, onEdit }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const textToSpeak = message.content
      .filter(part => part.type === 'text')
      .map(part => (part as { value: string }).value)
      .join('\n');
      
  const isPlaying = nowPlayingId === messageId;
  const isTtsLoading = ttsLoadingId === messageId;
  
  const handleCopy = () => {
    if(!textToSpeak) return;
    navigator.clipboard.writeText(textToSpeak);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
      if(textToSpeak && !isTtsLoading) {
          onToggleSpeech(textToSpeak, messageId);
      }
  };

  return (
    <div className={`flex items-start gap-4 group animate-fade-in ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <ModelIcon />}
      <div
        className={`rounded-2xl p-4 max-w-xl break-words relative shadow-lg ${
          isUser
            ? 'text-white rounded-br-none'
            : 'glass-pane rounded-bl-none'
        }`}
        style={isUser ? { background: 'var(--color-user-bubble-gradient)'} : {}}
      >
        {!isUser && message.metadata?.toolUsed && (
            <div className="absolute top-2 right-2 group-hover:opacity-100 opacity-0 transition-opacity" title={`Tool Used: ${message.metadata.toolUsed}`}>
                <Icon name="tool" style={iconStyle} className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
        )}
        <div className="space-y-4">
          {message.content.map((part, index) => {
              if (part.type === 'text') {
                  return <TextContent key={index} text={part.value} sources={part.sources} />;
              }
              if (part.type === 'image') {
                  return <ImageContent key={index} src={part.value} prompt={part.prompt} iconStyle={iconStyle} />;
              }
              if (part.type === 'tool_call') {
                  return <ToolCallContent key={index} call={part.call} iconStyle={iconStyle} />;
              }
              return null;
          })}
        </div>
        {!isUser && textToSpeak && (
            <div className="absolute -bottom-4 -right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <button
                    onClick={handleSpeak}
                    className="p-1.5 glass-pane rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-primary)] hover:text-white disabled:opacity-50 disabled:cursor-wait"
                    aria-label={isPlaying ? 'Stop speaking' : 'Speak message'}
                    disabled={!!ttsLoadingId}
                >
                    {isTtsLoading ? <TtsSpinnerIcon className="w-4 h-4" /> : isPlaying ? <Icon name="speakerWave" style={iconStyle} className="w-4 h-4" /> : <Icon name="speaker" style={iconStyle} className="w-4 h-4" />}
                </button>
                <button
                    onClick={handleCopy}
                    className="p-1.5 glass-pane rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-primary)] hover:text-white"
                    aria-label="Copy message"
                >
                    {copied ? <Icon name="check" style={iconStyle} className="w-4 h-4" /> : <Icon name="clipboard" style={iconStyle} className="w-4 h-4" />}
                </button>
            </div>
        )}
        {isUser && isEditable && (
             <div className="absolute -bottom-4 -left-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={onEdit}
                    className="p-1.5 glass-pane rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-primary)] hover:text-white"
                    aria-label="Edit message"
                >
                    <Icon name="pencil" style={iconStyle} className="w-4 h-4" />
                </button>
            </div>
        )}
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};

export default MessageComponent;