"use client";

import { Suspense } from "react";
import SnippetsList from "@/components/snippets/snippet-list";
import SnippetsFilter from "@/components/snippets/snippet-filter";
import { Skeleton } from "@/components/ui/skeleton";

export default function SnippetsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Snippets</h1>
          <p className="text-muted-foreground mt-1">
            Browse and discover useful code snippets from the community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Suspense fallback={<SnippetsListSkeleton />}>
              <SnippetsFilter />
            </Suspense>
          </div>
          <div className="lg:col-span-3">
            <Suspense fallback={<SnippetsListSkeleton />}>
              <SnippetsList />
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
