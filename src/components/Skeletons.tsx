import { Card, CardContent } from "@/components/ui/card";

interface SkeletonProps {
    className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-muted/70 rounded-md ${className}`}
        />
    );
}

export function AdCardSkeleton() {
    return (
        <Card className="overflow-hidden border-border/50 bg-card shadow-card">
            <Skeleton className="w-full h-48 rounded-none" />
            <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="w-24 h-3" />
                </div>
                <Skeleton className="w-3/4 h-5 mb-2" />
                <Skeleton className="w-full h-3 mb-1" />
                <Skeleton className="w-2/3 h-3 mb-4" />
                <div className="flex justify-between items-center">
                    <div className="flex gap-1.5">
                        <Skeleton className="w-14 h-5 rounded-full" />
                        <Skeleton className="w-16 h-5 rounded-full" />
                        <Skeleton className="w-12 h-5 rounded-full" />
                    </div>
                    <Skeleton className="w-24 h-3" />
                </div>
            </CardContent>
        </Card>
    );
}

export function ProfileSkeleton() {
    return (
        <Card className="overflow-hidden border-border/50 bg-card shadow-card">
            <Skeleton className="w-full h-32 rounded-none" />
            <CardContent className="p-6">
                <div className="flex items-end gap-4 -mt-12">
                    <Skeleton className="w-24 h-24 rounded-2xl border-4 border-card" />
                    <div className="flex-1 mb-1">
                        <Skeleton className="w-40 h-6 mb-2" />
                        <Skeleton className="w-56 h-3" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                </div>
            </CardContent>
        </Card>
    );
}

export { Skeleton };
