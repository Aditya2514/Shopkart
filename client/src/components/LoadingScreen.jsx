const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#070709] select-none text-stone-200">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-28 h-28 rounded-full bg-[#CCA46B]/15 blur-2xl animate-pulse" />
          <div className="w-20 h-20 rounded-full border-[2px] border-[#CCA46B]/20 border-t-[#CCA46B] animate-spin" />
          <div className="absolute w-14 h-14 rounded-full border-[1.5px] border-[#E5C07B]/25 border-b-[#E5C07B] animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />

          <div className="absolute w-10 h-10 rounded-full bg-[#0E0E14] border border-[#CCA46B]/30 flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#CCA46B]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-normal tracking-wide text-white font-editorial">
          Shop<span className="text-[#CCA46B] italic font-semibold">Kart</span>
        </h1>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-[11px] font-semibold uppercase tracking-[3px] text-[#A09D98]">
            Loading ShopKart
          </span>
          <span className="flex items-center gap-1 ml-1">
            <span className="w-1 h-1 rounded-full bg-[#CCA46B] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 rounded-full bg-[#CCA46B] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 rounded-full bg-[#CCA46B] animate-bounce" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
