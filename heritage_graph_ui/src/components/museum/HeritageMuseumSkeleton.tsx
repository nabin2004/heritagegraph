import { Card, CardContent } from "@/components/ui/card";

export function HeritageMuseumSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-4 max-w-3xl">
        <div className="h-4 w-32 bg-muted rounded-full" />
        <div className="h-10 w-3/4 bg-muted rounded-lg" />
        <div className="h-4 w-full bg-muted rounded" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="p-4 rounded-xl border bg-card space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="h-10 flex-1 bg-muted rounded-lg" />
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-muted rounded-lg" />
            <div className="h-10 w-32 bg-muted rounded-lg" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-muted rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border border-border/60">
            <div className="aspect-[4/3] bg-muted w-full" />
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-muted rounded-full" />
                <div className="h-4 w-24 bg-muted rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-4/5 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
