import React from 'react';

interface LetterJProps {
  className?: string;
  size?: number;
}

const LetterJ: React.FC<LetterJProps> = ({ className, size = 45 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 45 45" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="5" width="35" height="35" fill="white" stroke="#000" strokeWidth="1"/>
      <path d="M18 11V8h15v3h-6v15c0 3.3-2.7 6-6 6h-3c-3.3 0-6-2.7-6-6h3c0 1.6 1.4 3 3 3h3c1.6 0 3-1.4 3-3V11z" fill="#000"/>
    </svg>
  );
};

export default LetterJ;