import React from 'react';

interface ShapeProps {
  className?: string;
  type: 'star' | 'diamond' | 'triangle' | 'plus';
  color?: string;
}

export const DecorativeShape: React.FC<ShapeProps> = ({ type, className = '', color = 'text-primary/10' }) => {
  if (type === 'star') {
    return (
      <svg
        className={`animate-pulse duration-[4000ms] ${color} ${className}`}
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
      </svg>
    );
  }

  if (type === 'diamond') {
    return (
      <svg
        className={`animate-bounce duration-[6000ms] ${color} ${className}`}
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L22 12L12 22L2 12L12 2Z" />
      </svg>
    );
  }

  if (type === 'triangle') {
    return (
      <svg
        className={`rotate-12 ${color} ${className}`}
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L22 20H2L12 2Z" />
      </svg>
    );
  }

  // default 'plus'
  return (
    <svg
      className={`animate-spin [animation-duration:10s] ${color} ${className}`}
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
};
