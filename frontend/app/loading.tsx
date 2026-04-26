import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function GlobalLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pt-4">
        <div className="space-y-4 w-full max-w-md">
          {/* Badge */}
          <Skeleton className="h-6 w-28 rounded-full" />
          {/* Title */}
          <Skeleton className="h-10 w-full" />
          {/* Subtitle */}
          <Skeleton className="h-4 w-5/6" />
        </div>
        {/* Action Button */}
        <Skeleton className="h-12 w-36 rounded-xl shrink-0" />
      </div>

      {/* Top Cards Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-[2rem]" />
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Large Chart/Content Area */}
        <Skeleton className="h-[450px] lg:col-span-2 rounded-[2.5rem]" />
        
        {/* Side Widget Area */}
        <div className="space-y-6">
          <Skeleton className="h-[210px] rounded-[2.5rem]" />
          <Skeleton className="h-[210px] rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
