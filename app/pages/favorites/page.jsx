import { Suspense } from "react";
import SavedSnippets from "@/components/snippets/favorite-snippet";
import { Skeleton } from "@/components/ui/skeleton";

export default function favoriteSnippet() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Snippets</h1>
          <p className="text-muted-foreground mt-1">
            Browse and discover your saved code snippets from the community
          </p>
        </div>

        <div className="flex flex-col justify-center">
          <div>
            <Suspense fallback={<SnippetsListSkeleton />}>
              <SavedSnippets />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function SnippetsListSkeleton() {
  return (
    <div className="space-y-6">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="flex justify-between items-center pt-2">
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}