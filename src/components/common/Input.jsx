const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  maxLength,
  required = false,
  labelHindi 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {labelHindi && `/ ${labelHindi}`}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
      </div>
    </div>
  );
};

export default Input;