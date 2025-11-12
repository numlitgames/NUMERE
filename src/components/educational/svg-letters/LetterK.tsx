import React from 'react';

interface LetterKProps {
  className?: string;
  size?: number;
}

const LetterK: React.FC<LetterKProps> = ({ className, size = 45 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 45 45" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="5" width="35" height="35" fill="white" stroke="#000" strokeWidth="1"/>
      <path d="M12 37V8h3v11l9-11h4l-10 11 10 18h-4l-8-15-1 1v14z" fill="#000"/>
    </svg>
  );
};

export default LetterK;