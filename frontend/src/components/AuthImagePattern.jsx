const AuthImagePattern = ({ title, subtitle, className = "" }) => {
  return (
    <div
      className={`hidden lg:flex items-center justify-center bg-base-200 p-12 w-full min-h-[300px] ${className}`}
    >
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl ${
                i % 2 === 0
                  ? "animate-pulse bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
                  : "bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400"
              } shadow-md`}
              style={i % 2 === 0 ? { animationDelay: `${i * 100}ms` } : {}}
              aria-hidden="true"
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4 text-base-content">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
