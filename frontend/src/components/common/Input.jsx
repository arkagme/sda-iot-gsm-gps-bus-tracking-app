import React from 'react';
import clsx from 'clsx';

const Input = ({
  label,
  error,
  className = '',
  type = 'text',
  required = false,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={clsx(
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all',
          error ? 'border-red-500' : 'border-gray-300',
          'disabled:bg-gray-100 disabled:cursor-not-allowed'
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
