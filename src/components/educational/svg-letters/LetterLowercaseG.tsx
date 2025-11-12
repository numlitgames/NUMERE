import React from 'react';

interface LetterLowercaseGProps {
  className?: string;
  size?: number;
}

const LetterLowercaseG: React.FC<LetterLowercaseGProps> = ({ className, size = 45 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 45 45" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="5" width="35" height="35" fill="white" stroke="#000" strokeWidth="1"/>
      <path d="M29 17v9c0 2.8-2.2 5-5 5h-6c-2.8 0-5-2.2-5-5v-9c0-2.8 2.2-5 5-5h6c2.8 0 5 2.2 5 5zm-3 0c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-4h-4v3h1v1c0 .5-.5 1-1 1h-6c-.5 0-1-.5-1-1v-9c0-.5.5-1 1-1h6c.5 0 1 .5 1 1h2zm0 5v6c0 3.3-2.7 6-6 6h-6c-3.3 0-6-2.7-6-6v-11h3v11c0 1.6 1.4 3 3 3h6c1.6 0 3-1.4 3-3v-6h3z" fill="#000"/>
    </svg>
  );
};

export default LetterLowercaseG;