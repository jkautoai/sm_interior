import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helper,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const inputStyles = `
    block 
    rounded-md 
    shadow-sm 
    border-gray-300 
    focus:border-teal-500 
    focus:ring 
    focus:ring-teal-200 
    focus:ring-opacity-50
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
    ${fullWidth ? 'w-full' : ''}
  `;
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`${inputStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;