interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-onyx/5 rounded-sm animate-pulse ${className}`}
    />
  );
}
