export const Loader = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizes = {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };
  
    return (
      <div className="flex justify-center items-center">
        <div
          className={`animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${sizes[size]}`}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  };