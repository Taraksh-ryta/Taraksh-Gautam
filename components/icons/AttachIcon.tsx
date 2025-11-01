import React from 'react';

export const AttachIconLine: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
    </svg>
);

export const AttachIconSolid: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M14.021 2.222a2.25 2.25 0 00-3.182 0l-6.5 6.5a3.75 3.75 0 105.304 5.303l4.25-4.25a.75.75 0 011.06 1.06l-4.25 4.25a2.25 2.25 0 01-3.182-3.182l5.432-5.432a.75.75 0 011.06 1.06l-5.432 5.432a.75.75 0 000 1.061l.001.001a.75.75 0 101.06-1.06l4.25-4.25a3.75 3.75 0 10-5.303-5.304l-6.5 6.5a5.25 5.25 0 107.424 7.424l6.5-6.5a.75.75 0 00-1.06-1.06l-6.5 6.5a3.75 3.75 0 01-5.303-5.303l6.5-6.5a2.25 2.25 0 013.182 0z" clipRule="evenodd" />
    </svg>
);