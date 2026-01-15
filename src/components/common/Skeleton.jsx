const Skeleton = ({ className, variant = 'text' }) => {
  const variants = {
    text: 'h-4',
    title: 'h-8',
    card: 'h-32',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10',
    stat: 'h-24'
  };

  return (
    <div 
      className={`${variants[variant]} bg-gray-200 rounded animate-pulse ${className}`}
    />
  );
};

export default Skeleton;