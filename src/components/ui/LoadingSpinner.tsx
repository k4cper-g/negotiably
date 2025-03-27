type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-4'
  };
  
  return (
    <div 
      className={`animate-spin rounded-full border-solid border-blue-600 border-r-transparent ${sizeClasses[size]} ${className}`} 
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
} 