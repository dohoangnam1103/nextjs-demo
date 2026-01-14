import { Button } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function Loading() {
    return (
        <div className="min-h-screen p-24">
            {/* Nút Back (giữ nguyên để user có thể click quay lại ngay nếu muốn) */}
            <Button icon={<ArrowLeftOutlined />} className="mb-8" disabled>
                Quay lại danh sách
            </Button>

            {/* Detail Card Skeleton */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl max-w-2xl mx-auto shadow-2xl animate-pulse">
                {/* Name & Username */}
                <div className="h-8 bg-zinc-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-zinc-800 rounded w-1/4 mb-8"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-zinc-800 rounded w-full"></div>
                        <div className="h-4 bg-zinc-800 rounded w-full"></div>
                        <div className="h-4 bg-zinc-800 rounded w-full"></div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-zinc-800 rounded w-full"></div>
                        <div className="h-4 bg-zinc-800 rounded w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
