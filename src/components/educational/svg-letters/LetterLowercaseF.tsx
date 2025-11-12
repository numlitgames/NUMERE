import React from 'react';

interface LetterLowercaseFProps {
  className?: string;
  size?: number;
}

const LetterLowercaseF: React.FC<LetterLowercaseFProps> = ({ className, size = 45 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 45 45" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="5" width="35" height="35" fill="white" stroke="#000" strokeWidth="1"/>
      <path d="M18 37V20h-3v-3h3V8h10v3h-7v6h6v3h-6v17z" fill="#000"/>
    </svg>
  );
};

export default LetterLowercaseF;