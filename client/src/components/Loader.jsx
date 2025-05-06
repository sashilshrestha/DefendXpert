const Loader = () => {
  return (
    <div className="absolute w-full h-screen top-0 left-0 inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-blue-900/80">
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-lg text-white"></span>
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
