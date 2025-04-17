import { ReactNode } from 'react';

export const Button = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button'
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition duration-300 ease-in-out ${
      variant === 'primary'
        ? 'bg-blue-500 text-white hover:bg-blue-600'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    disabled={disabled || loading}
  >
    {loading ? <span>Loading...</span> : children}
  </button>
);