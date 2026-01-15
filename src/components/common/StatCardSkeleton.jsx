import Skeleton from './Skeleton';

const StatCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <Skeleton className="w-24" variant="text" />
          <Skeleton className="w-32" variant="title" />
          <Skeleton className="w-20" variant="text" />
        </div>
        <Skeleton variant="avatar" />
      </div>
    </div>
  );
};

export default StatCardSkeleton;