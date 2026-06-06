const LoadingScreen = ({ message = 'Authenticating session...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Background ambient glow effect */}
      <div
        className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div
        className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDuration: '10s' }}
      />

      {/* Glassmorphic Container Card */}
      <div className="relative flex flex-col items-center p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] max-w-sm w-full mx-4">
        {/* Animated Spinners Container */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Outer glowing pulsing border */}
          <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping opacity-75" />

          {/* Outer Ring Spinner */}
          <div
            className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"
            style={{ animationDuration: '1s' }}
          />

          {/* Inner Reverse Ring Spinner */}
          <div
            className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-transparent border-b-cyan-400 border-l-indigo-400 animate-spin"
            style={{ animationDuration: '0.7s', animationDirection: 'reverse' }}
          />

          {/* Brand Core Pulse */}
          <div className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse" />
        </div>

        {/* Text Area */}
        <h2 className="mt-8 text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          BlogSpace
        </h2>
        <p className="mt-2 text-sm text-slate-400 font-medium tracking-wide animate-pulse">
          {message}
        </p>

        {/* Dynamic decorative line */}
        <div className="mt-6 w-16 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full opacity-60" />
      </div>
    </div>
  );
};

export default LoadingScreen;
