const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold mb-6 text-gray-800">{title}</h2>
      )}
      {children}
    </div>
  );
};

export default Card;