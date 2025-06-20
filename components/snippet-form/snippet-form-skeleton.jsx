'use client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SnippetFormSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <Card className="border shadow-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <CardTitle><Skeleton className="h-8 w-48" /></CardTitle>
          </div>
          <CardDescription>
            <Skeleton className="h-4 w-full max-w-md" />
          </CardDescription>
        </CardHeader>
        
        <div className="px-6 pb-2 flex space-x-2 border-b">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>

        <CardContent className="pt-6 pb-2 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-32 w-full" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    </div>
  );
}