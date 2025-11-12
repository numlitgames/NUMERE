import React from 'react';

interface LetterÎProps {
  className?: string;
  size?: number;
}

const LetterÎ: React.FC<LetterÎProps> = ({ className, size = 45 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 45 45" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="5" width="35" height="35" fill="white" stroke="#000" strokeWidth="1"/>
      <path d="M22.5 6L25 4l2.5 2-2.5 2-2.5-2zM12 13V10h18v3h-7.5v21H30v3H12v-3h7.5V13z" fill="#000"/>
    </svg>
  );
};

export default LetterÎ;