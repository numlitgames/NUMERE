import React from 'react';

interface LetterGProps {
  className?: string;
  size?: number;
}

const LetterG: React.FC<LetterGProps> = ({ className, size = 45 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 45 45" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="5" width="35" height="35" fill="white" stroke="#000" strokeWidth="1"/>
      <path d="M32 22.5v9c0 3.3-2.7 6-6 6H19c-3.3 0-6-2.7-6-6v-15c0-3.3 2.7-6 6-6h7c3.3 0 6 2.7 6 6h-3c0-1.6-1.4-3-3-3h-7c-1.6 0-3 1.4-3 3v15c0 1.6 1.4 3 3 3h7c1.6 0 3-1.4 3-3v-6h-5v-3h8z" fill="#000"/>
    </svg>
  );
};

export default LetterG;