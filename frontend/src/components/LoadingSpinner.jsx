/**
 * Loading Spinner Component
 * -------------------------
 * A reusable animated spinner with size variants.
 *
 * Props:
 *   size: 'sm' | 'md' | 'lg' (default: 'md')
 *   className: additional CSS classes
 */

const sizeClasses = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-dark-600 border-t-primary-500 rounded-full animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;
