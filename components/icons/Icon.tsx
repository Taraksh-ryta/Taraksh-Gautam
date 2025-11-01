import React from 'react';
import { IconStyle } from '../SettingsPanel';
import { AttachIconLine, AttachIconSolid } from './AttachIcon';
import { CheckIconLine, CheckIconSolid } from './CheckIcon';
import { ClipboardIconLine, ClipboardIconSolid } from './ClipboardIcon';
import { CloseIconLine, CloseIconSolid } from './CloseIcon';
import { DownloadIconLine, DownloadIconSolid } from './DownloadIcon';
import { ImageIconLine, ImageIconSolid } from './ImageIcon';
import { LogoutIconLine, LogoutIconSolid } from './LogoutIcon';
import { MenuIconLine, MenuIconSolid } from './MenuIcon';
import { MicIconLine, MicIconSolid } from './MicIcon';
import { NewChatIconLine, NewChatIconSolid } from './NewChatIcon';
import { PencilIconLine, PencilIconSolid } from './PencilIcon';
import { SearchIconLine, SearchIconSolid } from './SearchIcon';
import { SendIconLine, SendIconSolid } from './SendIcon';
import { SettingsIconLine, SettingsIconSolid } from './SettingsIcon';
import { SpeakerIconLine, SpeakerIconSolid } from './SpeakerIcon';
import { SpeakerWaveIconLine, SpeakerWaveIconSolid } from './SpeakerWaveIcon';
import { StopIconLine, StopIconSolid } from './StopIcon';
import { SummarizeIconLine, SummarizeIconSolid } from './SummarizeIcon';
import { ToolIconLine, ToolIconSolid } from './ToolIcon';
import { TrashIconLine, TrashIconSolid } from './TrashIcon';
import { QuickActionsIconLine, QuickActionsIconSolid } from './QuickActionsIcon';
import { RegenerateIconLine, RegenerateIconSolid } from './RegenerateIcon';
import { SearchOffIconLine, SearchOffIconSolid } from './SearchOffIcon';

export type IconName = 
  | 'attach' | 'check' | 'clipboard' | 'close' | 'download' | 'image' | 'logout' 
  | 'menu' | 'mic' | 'newChat' | 'pencil' | 'search' | 'searchOff' | 'send' | 'settings'
  | 'speaker' | 'speakerWave' | 'stop' | 'summarize' | 'tool' | 'trash'
  | 'quickActions' | 'regenerate';

interface IconProps {
    name: IconName;
    style: IconStyle;
    className?: string;
}

const lineIcons: Record<IconName, React.FC<{className?: string}>> = {
    attach: AttachIconLine,
    check: CheckIconLine,
    clipboard: ClipboardIconLine,
    close: CloseIconLine,
    download: DownloadIconLine,
    image: ImageIconLine,
    logout: LogoutIconLine,
    menu: MenuIconLine,
    mic: MicIconLine,
    newChat: NewChatIconLine,
    pencil: PencilIconLine,
    search: SearchIconLine,
    searchOff: SearchOffIconLine,
    send: SendIconLine,
    settings: SettingsIconLine,
    speaker: SpeakerIconLine,
    speakerWave: SpeakerWaveIconLine,
    stop: StopIconLine,
    summarize: SummarizeIconLine,
    tool: ToolIconLine,
    trash: TrashIconLine,
    quickActions: QuickActionsIconLine,
    regenerate: RegenerateIconLine,
};

const solidIcons: Record<IconName, React.FC<{className?: string}>> = {
    attach: AttachIconSolid,
    check: CheckIconSolid,
    clipboard: ClipboardIconSolid,
    close: CloseIconSolid,
    download: DownloadIconSolid,
    image: ImageIconSolid,
    logout: LogoutIconSolid,
    menu: MenuIconSolid,
    mic: MicIconSolid,
    newChat: NewChatIconSolid,
    pencil: PencilIconSolid,
    search: SearchIconSolid,
    searchOff: SearchOffIconSolid,
    send: SendIconSolid,
    settings: SettingsIconSolid,
    speaker: SpeakerIconSolid,
    speakerWave: SpeakerWaveIconSolid,
    stop: StopIconSolid,
    summarize: SummarizeIconSolid,
    tool: ToolIconSolid,
    trash: TrashIconSolid,
    quickActions: QuickActionsIconSolid,
    regenerate: RegenerateIconSolid,
};

export const Icon: React.FC<IconProps> = ({ name, style, className }) => {
    const IconComponent = style === 'line' ? lineIcons[name] : solidIcons[name];
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
};