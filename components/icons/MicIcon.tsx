import React from 'react';

export const MicIconLine: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3-3z" />
    </svg>
);

export const MicIconSolid: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
        <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 11-13.5 0v-1.5A.75.75 0 016 10.5zM12 21a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75z" />
        <path d="M12.75 21a.75.75 0 00-1.5 0h1.5zM15 20.25a.75.75 0 01.75.75h.008a.75.75 0 010-1.5H15a.75.75 0 01.75.75zM15.75 21a.75.75 0 00-1.5 0h1.5zM9 20.25a.75.75 0 01.75.75H9.75a.75.75 0 010-1.5H9a.75.75 0 01.75.75zM9.75 21a.75.75 0 00-1.5 0h1.5z" />
    </svg>
);