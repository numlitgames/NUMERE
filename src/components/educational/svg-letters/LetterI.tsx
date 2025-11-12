import React from 'react';

interface LetterIProps {
  className?: string;
  size?: number;
}

const LetterI: React.FC<LetterIProps> = ({ className, size = 45 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 45 45" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="5" width="35" height="35" fill="white" stroke="#000" strokeWidth="1"/>
      <path d="M12 11V8h18v3h-7.5v23H30v3H12v-3h7.5V11z" fill="#000"/>
    </svg>
  );
};

export default LetterI;