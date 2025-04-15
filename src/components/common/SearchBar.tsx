interface SearchBarProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    placeholder?: string;
    className?: string;
    icon?: React.ReactNode;
    button?: React.ReactNode;
    large?: boolean;
    color: string;
    textColor: string;
    stroke:string;
  }
  
  export const SearchBar = ({ 
    stroke,
    color,
    textColor,
    value, 
    onChange, 
    onSearch,
    placeholder, 
    className = '', 
    icon,
    button,
    large = false 
  }: SearchBarProps) => (
    <div className={`relative max-w-3xl w-full ${className}`}>
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder={placeholder}
        className={`${
          large ? 'py-4 px-6 text-lg' : 'py-3 px-4'
        } ${
          icon ? 'pl-12' : 'pl-4'
        } pr-16 w-full rounded-full border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
      />
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
        {button || (
          <button
            onClick={onSearch}
            className={`${
              large ? 'px-8 py-3' : 'px-6 py-2'
            } bg-${color} border-2 border-white hover:bg-blue-700 text-${textColor} rounded-full font-medium transition-colors duration-200 flex items-center gap-2`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke={stroke}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <span className="hidden sm:inline">Search</span>
          </button>
        )}
      </div>
    </div>
  );