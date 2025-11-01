import React from 'react';

export const ClipboardIconLine: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
);

export const ClipboardIconSolid: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M10.5 1.875a1.875 1.875 0 00-1.875 1.875v3.375h3.75V3.75A1.875 1.875 0 0010.5 1.875z" />
        <path fillRule="evenodd" d="M8.625 3.75A3.375 3.375 0 0112 1.875h.375a3.375 3.375 0 013.375 3.375V9.375h3.375A3.375 3.375 0 0122.5 12.75v5.25A3.375 3.375 0 0119.125 21.375H4.875A3.375 3.375 0 011.5 18v-5.25A3.375 3.375 0 014.875 9.375H8.25V7.125A3.375 3.375 0 018.625 3.75zM12.375 6h-3V7.125c0 .621.504 1.125 1.125 1.125h.75c.621 0 1.125-.504 1.125-1.125V6z" clipRule="evenodd" />
    </svg>
);