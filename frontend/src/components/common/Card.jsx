import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  padding = true,
  hover = false,
  onClick,
  ...props 
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-lg shadow-sm border border-gray-200',
        padding && 'p-6',
        hover && 'hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
