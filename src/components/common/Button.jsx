const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  fullWidth = false,
  type = 'button'
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        py-3 px-6 rounded-lg font-medium transition shadow-lg hover:shadow-xl
        disabled:bg-gray-400 disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
};

export default Button;