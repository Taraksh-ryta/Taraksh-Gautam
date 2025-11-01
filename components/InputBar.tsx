import React, { useState, useRef, useEffect } from 'react';
import { formatContent } from '../utils';
import { User } from '../types';
import { Icon } from './icons/Icon';
import { IconStyle } from './SettingsPanel';

interface InputBarProps {
  onSendMessage: (message: string, attachedImage: File | null) => void;
  isLoading: boolean;
  onOpenImagineModal: () => void;
  user: User | null;
  iconStyle: IconStyle;
  pendingInput: { text: string; imageFile: File | null } | null;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading, onOpenImagineModal, user, iconStyle, pendingInput }) => {
  const [input, setInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<{file: File, previewUrl: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (pendingInput) {
      setInput(pendingInput.text);
      if (pendingInput.imageFile) {
        setAttachedImage({
          file: pendingInput.imageFile,
          previewUrl: URL.createObjectURL(pendingInput.imageFile),
        });
      } else {
        setAttachedImage(null);
      }
      textareaRef.current?.focus();
    }
  }, [pendingInput]);


  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prevInput => (prevInput ? prevInput.trim() + ' ' : '') + transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const scrollHeight = textareaRef.current.scrollHeight;
        const maxHeight = 200;
        textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [input]);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Could not start recognition:", e);
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachedImage) && !isLoading) {
      onSendMessage(input.trim(), attachedImage?.file || null);
      setInput('');
      setAttachedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as any);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setAttachedImage({ file, previewUrl: URL.createObjectURL(file) });
    }
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const placeholderText = attachedImage
    ? "Ask a question about the image..."
    : "Ask anything... (Shift+Enter for new line)";
  
  const requiresLoginTooltip = "Sign in to use this feature.";

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[var(--color-bg)] to-transparent">
      <div className="max-w-3xl mx-auto">
        {input.trim() && !attachedImage && (
            <div className="mb-3 p-4 glass-pane rounded-lg">
              <div 
                className="prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={formatContent(input)} 
              />
            </div>
        )}
        {attachedImage && (
            <div className="mb-3 relative w-24 h-24 p-1 glass-pane rounded-lg">
                <img src={attachedImage.previewUrl} alt="Image preview" className="w-full h-full object-cover rounded"/>
                <button
                    onClick={removeAttachedImage}
                    className="absolute -top-2 -right-2 bg-black/50 rounded-full p-0.5 text-white hover:bg-red-500 transition-colors"
                    aria-label="Remove image"
                >
                    <Icon name="close" style={iconStyle} className="w-4 h-4" />
                </button>
            </div>
        )}
        <form onSubmit={handleSubmit} className="relative glass-pane rounded-2xl">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className="w-full bg-transparent rounded-2xl pl-16 pr-28 py-3.5 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow duration-200 resize-none"
            disabled={isLoading}
          />
          <div className="absolute left-3 bottom-3 flex items-center gap-1">
             <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <button
                type="button"
                onClick={() => user && fileInputRef.current?.click()}
                disabled={isLoading || !user}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] p-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Attach image"
                title={!user ? requiresLoginTooltip : undefined}
              >
                <Icon name="attach" style={iconStyle} className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onOpenImagineModal}
                disabled={isLoading || !user}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] p-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Generate image"
                title={!user ? requiresLoginTooltip : undefined}
              >
                <Icon name="image" style={iconStyle} className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleMicClick}
                disabled={isLoading}
                className="text-[var(--color-text-muted)] p-1.5 rounded-full disabled:opacity-50 transition-colors"
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              >
                {isRecording ? (
                  <Icon name="stop" style={iconStyle} className="w-5 h-5 text-red-500 animate-pulse" />
                ) : (
                  <Icon name="mic" style={iconStyle} className="w-5 h-5 hover:text-[var(--color-primary)]" />
                )}
              </button>
          </div>
          <div className="absolute right-3 bottom-2.5">
            <button
                type="submit"
                disabled={isLoading || (!input.trim() && !attachedImage)}
                className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-full p-2.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[var(--color-primary)]"
                aria-label="Send message"
              >
                <Icon name="send" style={iconStyle} className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputBar;