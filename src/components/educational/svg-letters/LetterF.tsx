import React from 'react';

interface LetterFProps {
  className?: string;
  size?: number;
}

const LetterF: React.FC<LetterFProps> = ({ className, size = 45 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 45 45" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="5" width="35" height="35" fill="white" stroke="#000" strokeWidth="1"/>
      <path d="M12 37V8h18v3h-15v11h12v3h-12v12z" fill="#000"/>
    </svg>
  );
};

export default LetterF;