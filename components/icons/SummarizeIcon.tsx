import React from 'react';

export const SummarizeIconLine: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75l3-3-3-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.75H15" />
    </svg>
);

export const SummarizeIconSolid: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 4.5A.75.75 0 013 3.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM2.25 9A.75.75 0 013 8.25h9.75a.75.75 0 010 1.5H3A.75.75 0 012.25 9zm15-.75A.75.75 0 0118 9v6a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zM2.25 13.5A.75.75 0 013 12.75H12a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        <path d="M18.995 18.02a.75.75 0 010-1.06l1.23-1.23a.75.75 0 011.06 1.06l-1.98 1.98a.75.75 0 01-1.06 0l-1.98-1.98a.75.75 0 111.06-1.06l1.23 1.23z" />
    </svg>
);