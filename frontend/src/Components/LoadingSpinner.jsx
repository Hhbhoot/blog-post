const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 w-full h-full min-h-[250px]">
      <div className="relative flex items-center justify-center w-12 h-12">
        {/* Spinner outer track */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        {/* Spinner active ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
