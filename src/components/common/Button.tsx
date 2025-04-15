import { ReactNode } from 'react';

export const Button = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  type = 'button'
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
}) => (
  <button
    disabled={disabled}
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    } ${className}`}
  >
    {children}
  </button>
);