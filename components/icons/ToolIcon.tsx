import React from 'react';

export const ToolIconLine: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L6.75 11.42m5.877 5.877l-5.877-5.877m0 0a3.375 3.375 0 00-4.773 4.773l2.472 2.472" />
    </svg>
);

export const ToolIconSolid: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0L2.17 11.484a.75.75 0 000 1.032l9.313 9.313a.75.75 0 001.032 0l9.313-9.313a.75.75 0 000-1.032L12.516 2.17zM11.109 7.575a2.5 2.5 0 113.536 3.536 2.5 2.5 0 01-3.536-3.536z" clipRule="evenodd" />
    </svg>
);