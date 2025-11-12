import React from 'react';

interface LetterLowercaseHProps {
  className?: string;
  size?: number;
}

const LetterLowercaseH: React.FC<LetterLowercaseHProps> = ({ className, size = 45 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 45 45" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="5" width="35" height="35" fill="white" stroke="#000" strokeWidth="1"/>
      <path d="M15 37V8h3v11h9c2.8 0 5 2.2 5 5v13h-3V24c0-1.1-.9-2-2-2h-9v15z" fill="#000"/>
    </svg>
  );
};

export default LetterLowercaseH;