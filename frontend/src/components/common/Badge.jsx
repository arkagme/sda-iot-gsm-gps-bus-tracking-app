import React from 'react';
import clsx from 'clsx';
import { getSeverityColor, getStatusColor } from '../../utils/formatters';

const Badge = ({ children, variant = 'default', color, size = 'md' }) => {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  // Custom color from severity/status
  const colorClass = color
    ? `bg-${color}-100 text-${color}-800`
    : variants[variant];

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        sizes[size],
        color ? `bg-${color}-100 text-${color}-800` : variants[variant]
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
