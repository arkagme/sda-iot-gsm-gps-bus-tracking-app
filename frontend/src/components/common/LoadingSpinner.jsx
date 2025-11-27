import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      <Loader2 className={clsx(sizes[size], 'animate-spin text-primary-600')} />
      {text && <p className="mt-3 text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
