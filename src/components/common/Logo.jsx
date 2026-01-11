import { Store } from 'lucide-react';

const Logo = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerSizes = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div className={`bg-blue-600 ${containerSizes[size]} rounded-2xl shadow-lg`}>
      <Store className={`${sizes[size]} text-white`} />
    </div>
  );
};

export default Logo;