import { Skeleton } from "@/components/ui/skeleton";

const PageSkeleton = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container mx-auto px-6 space-y-6">
      <div className="text-center space-y-3">
        <Skeleton className="h-4 w-24 mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-card/50 p-4 space-y-3">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PageSkeleton;
