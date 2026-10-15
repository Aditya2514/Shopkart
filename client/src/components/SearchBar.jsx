const SearchBar = ({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
}) => {
  const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Books",
    "Home",
    "Groceries",
  ];

  return (
    <div className="bg-[#0E0E14] border border-white/[0.08] rounded-2xl p-4 sm:p-5 mb-8 shadow-xl flex flex-col md:flex-row items-center gap-3.5">
      <div className="relative flex-1 w-full">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-[#14141C] border border-white/[0.08] focus:border-[#CCA46B] focus:ring-1 focus:ring-[#CCA46B] rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition-all duration-200"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-1/2 md:w-44">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#14141C] border border-white/[0.08] focus:border-[#CCA46B] focus:ring-1 focus:ring-[#CCA46B] rounded-xl px-3.5 py-2.5 text-sm text-stone-200 outline-none transition-all duration-200 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === "All Categories" ? "All" : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/2 md:w-44">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-[#14141C] border border-white/[0.08] focus:border-[#CCA46B] focus:ring-1 focus:ring-[#CCA46B] rounded-xl px-3.5 py-2.5 text-sm text-stone-200 outline-none transition-all duration-200 cursor-pointer"
          >
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
