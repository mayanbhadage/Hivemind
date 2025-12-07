import React from 'react';

export const CricketBat = ({ size = 24, color = "currentColor", strokeWidth = 2, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {/* Angled Bat Body */}
        <path d="M18.5 4.5L20 6L14 12L12.5 10.5L18.5 4.5Z" /> {/* Handle */}
        <path d="M14 12L8 18C7 19 6 19 5 18L4 17C3 16 3 15 4 14L10 8L14 12Z" /> {/* Blade */}

        {/* Splice V-shape */}
        <path d="M12.5 10.5L11 12L14 12" />

        {/* Spine */}
        <path d="M10 8L6 12" />

        {/* Ball */}
        <circle cx="16" cy="18" r="3" />
    </svg>
);

export const Football = ({ size = 24, color = "currentColor", strokeWidth = 2, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {/* Outer Circle */}
        <circle cx="12" cy="12" r="10" />

        {/* Central Pentagon */}
        <path d="M12 7L15.5 9.5L14.5 14H9.5L8.5 9.5L12 7Z" />

        {/* Lines to edges */}
        <path d="M12 7V3" />
        <path d="M15.5 9.5L19 8" />
        <path d="M14.5 14L17 18" />
        <path d="M9.5 14L7 18" />
        <path d="M8.5 9.5L5 8" />
    </svg>
);
