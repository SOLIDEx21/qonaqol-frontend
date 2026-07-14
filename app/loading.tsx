export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Skeleton Categories */}
      <div className="flex space-x-6 overflow-hidden mb-8">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-16 h-2 bg-gray-200 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-xl"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded-md mt-2"></div>
            <div className="w-1/2 h-3 bg-gray-200 rounded-md"></div>
            <div className="w-1/4 h-4 bg-gray-200 rounded-md mt-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
