
const ContextSkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Main Description Skeleton */}
      <div className="rounded-lg p-6 pb-0 pt-1 mb-5">
        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
      </div>

      {/* Insight Cards Skeleton */}
      <div className="mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-lg h-32"></div>
          ))}
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-50 rounded-lg h-[350px]"></div>
        ))}
      </div>

      {/* Keypoint Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded-lg h-40"></div>
        ))}
      </div>
    </div>
  );
};

export default ContextSkeleton;