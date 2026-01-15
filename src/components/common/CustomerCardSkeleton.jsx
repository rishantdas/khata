import Skeleton from './Skeleton';

const CustomerCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-32" variant="text" />
            <Skeleton className="w-24" variant="text" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="w-20" variant="text" />
          <Skeleton className="w-16" variant="text" />
        </div>
      </div>
      <Skeleton className="w-full" variant="text" />
    </div>
  );
};

export default CustomerCardSkeleton;