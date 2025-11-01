import React, { useState, useMemo, useEffect } from 'react';
import { Conversation, SearchResult, Message, TextContentPart } from '../types';
import { Icon } from './icons/Icon';
import { IconStyle } from './SettingsPanel';

const highlight = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <strong key={i} className="text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 rounded">{part}</strong>
                ) : (
                    part
                )
            )}
        </span>
    );
};

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  isSidebarVisible: boolean;
  setIsSidebarVisible: (visible: boolean) => void;
  iconStyle: IconStyle;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeId, onNewChat, onSelect, onDelete, onRename, isSidebarVisible, setIsSidebarVisible, iconStyle }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    
    // For mobile, visibility is controlled by App state. For desktop, it's always "visible" but may be collapsed.
    const isVisible = isSidebarVisible || window.innerWidth >= 768;

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const results: SearchResult[] = [];
        const query = searchQuery.toLowerCase();
        conversations.forEach(convo => {
            convo.messages.forEach(msg => {
                const textPart = msg.content.find(p => p.type === 'text') as TextContentPart | undefined;
                if (textPart && textPart.value.toLowerCase().includes(query)) {
                    results.push({
                        conversationId: convo.id,
                        conversationTitle: convo.title,
                        message: msg,
                    });
                }
            });
        });
        return results;
    }, [searchQuery, conversations]);

    const handleRename = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const currentConvo = conversations.find(c => c.id === id);
        const newTitle = prompt('Enter new chat title:', currentConvo?.title);
        if (newTitle) {
            onRename(id, newTitle);
        }
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this chat?')) {
            onDelete(id);
        }
    };

    const handleSelectResult = (result: SearchResult) => {
        onSelect(result.conversationId);
        setSearchQuery('');
    };
    
    const handleMouseEnter = () => {
      if(window.innerWidth >= 768) {
        setIsExpanded(true);
      }
    }
    const handleMouseLeave = () => {
      if(window.innerWidth >= 768) {
        setIsExpanded(false);
      }
    }

    if (!isVisible) return null;

    return (
        <>
            {isSidebarVisible && window.innerWidth < 768 && (
                <div 
                    className="fixed inset-0 bg-black/60 z-20 md:hidden"
                    onClick={() => setIsSidebarVisible(false)}
                ></div>
            )}

            <aside 
                className={`flex-shrink-0 glass-pane flex flex-col h-full text-[var(--color-text)] transition-all duration-300 ease-in-out z-30
                    ${isExpanded || isSidebarVisible ? 'w-64' : 'w-16'}
                    ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                `}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="p-3 border-b border-[var(--color-glass-border)] space-y-3">
                    <button
                      onClick={onNewChat}
                      className="w-full flex items-center justify-center gap-2 text-sm bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 text-[var(--color-primary)] rounded-lg px-3 py-2 hover:bg-[var(--color-primary)]/30 transition-colors"
                      aria-label="Start new chat"
                    >
                      <Icon name="newChat" style={iconStyle} className="w-5 h-5" />
                      {(isExpanded || isSidebarVisible) && <span>New Chat</span>}
                    </button>
                </div>
                <div className="p-3">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon name="search" style={iconStyle} className="w-5 h-5 text-[var(--color-text-muted)]" />
                        </span>
                        {(isExpanded || isSidebarVisible) && (
                            <>
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full bg-black/20 border border-[var(--color-glass-border)] rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                                        aria-label="Clear search"
                                    >
                                        <Icon name="close" style={iconStyle} className="w-5 h-5" />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                    {searchQuery.trim() && (isExpanded || isSidebarVisible) ? (
                        searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                                <div
                                    key={`${result.conversationId}-${index}`}
                                    onClick={() => handleSelectResult(result)}
                                    className="p-2.5 rounded-md cursor-pointer hover:bg-white/5 transition-colors"
                                >
                                    <h4 className="text-sm font-semibold truncate text-[var(--color-text)]">{result.conversationTitle}</h4>
                                    <p className="text-xs text-[var(--color-text-muted)] truncate">
                                        <span className="font-semibold text-[var(--color-text)]/70">
                                            {result.message.role === 'user' ? 'You: ' : 'Ryt: '}
                                        </span>
                                        {highlight((result.message.content.find(p => p.type === 'text') as TextContentPart).value, searchQuery)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-sm text-[var(--color-text-muted)] p-4 flex flex-col items-center justify-center space-y-2">
                                <Icon name="searchOff" style={iconStyle} className="w-10 h-10" />
                                <span>No results found.</span>
                            </div>
                        )
                    ) : (
                        conversations.map(convo => (
                            <div
                                key={convo.id}
                                onClick={() => onSelect(convo.id)}
                                title={convo.title}
                                className={`group flex items-center justify-between p-2.5 text-sm rounded-md cursor-pointer transition-colors ${
                                    activeId === convo.id ? 'bg-[var(--color-primary)]/20 text-white' : 'hover:bg-white/5'
                                }`}
                            >
                                <span className="truncate flex-1 pr-2">{(isExpanded || isSidebarVisible) ? convo.title : '•'}</span>
                                {(isExpanded || isSidebarVisible) && 
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => handleRename(e, convo.id)} className="p-1 hover:text-[var(--color-primary)]" aria-label="Rename chat">
                                        <Icon name="pencil" style={iconStyle} className="w-4 h-4" />
                                    </button>
                                    <button onClick={(e) => handleDelete(e, convo.id)} className="p-1 hover:text-red-400" aria-label="Delete chat">
                                        <Icon name="trash" style={iconStyle} className="w-4 h-4" />
                                    </button>
                                </div>
                                }
                            </div>
                        ))
                    )}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;