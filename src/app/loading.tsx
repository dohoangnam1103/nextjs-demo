export default function Loading() {
    return (
        <div className="min-h-screen p-24">
            {/* Header Skeleton */}
            <div className="w-full max-w-5xl mb-10 mx-auto">
                <div className="h-4 bg-zinc-800 rounded w-48 mx-auto mb-4 animate-pulse"></div>
                <div className="h-10 bg-zinc-800 rounded w-96 mx-auto animate-pulse"></div>
            </div>

            {/* List Skeleton */}
            <div className="border border-zinc-700 rounded-lg p-5 mt-5 max-w-5xl mx-auto">
                <div className="h-8 bg-zinc-800 rounded w-64 mb-6 animate-pulse"></div>

                {/* Search Bar Skeleton */}
                <div className="flex gap-4 mb-6">
                    <div className="h-10 bg-zinc-800 rounded flex-1 animate-pulse"></div>
                    <div className="h-10 bg-zinc-800 rounded w-32 animate-pulse"></div>
                </div>

                {/* Items Skeleton */}
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-zinc-800 rounded-lg animate-pulse border border-zinc-700"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
