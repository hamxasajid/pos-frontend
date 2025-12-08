import React from 'react';

export const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`}
            {...props}
        />
    );
};

export const ProductCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-900 m-2 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <Skeleton className="h-40 w-full mb-4 rounded-xl" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-10 w-full mt-4 rounded-xl" />
        </div>
    );
};

export const StatsCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-2/3" />
            </div>
        </div>
    );
};
