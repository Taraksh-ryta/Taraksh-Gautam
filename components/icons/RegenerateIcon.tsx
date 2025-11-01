import React from 'react';

export const RegenerateIconLine: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l4.992-4.993m-4.993 0l-3.181 3.183a8.25 8.25 0 000 11.664l3.181 3.183" />
    </svg>
);

export const RegenerateIconSolid: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-4.597a.75.75 0 01-.75-.75V4.44l-1.962 1.962a.75.75 0 01-1.06 0l-2.122-2.122a.75.75 0 010-1.06l4.242-4.243a.75.75 0 011.06 0l4.243 4.242a.75.75 0 010 1.06l-2.122 2.122a.75.75 0 01-1.06 0l-1.962-1.962a5.25 5.25 0 00-8.89 2.456.75.75 0 01-1.44.288zM19.245 13.941a7.5 7.5 0 01-12.548 3.364l-1.903-1.903h4.597a.75.75 0 01.75.75v3.18l1.962-1.962a.75.75 0 011.06 0l2.122 2.122a.75.75 0 010 1.06l-4.242 4.243a.75.75 0 01-1.06 0l-4.243-4.242a.75.75 0 010-1.06l2.122-2.122a.75.75 0 011.06 0l1.962 1.962a5.25 5.25 0 008.89-2.456.75.75 0 011.44-.288z" clipRule="evenodd" />
    </svg>
);
