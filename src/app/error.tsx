'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log lỗi ra service bên ngoài (như Sentry) nếu cần
        console.error('App Error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h2 className="text-4xl font-bold text-red-500 mb-4">Đã xảy ra lỗi!</h2>
            <p className="text-gray-600 mb-2">Hệ thống gặp sự cố không mong muốn.</p>

            {/* Hiển thị chi tiết lỗi (Chỉ hiện khi dev, production nên ẩn) */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-8 max-w-lg text-left overflow-auto">
                <code className="text-red-700 text-sm">{error.message}</code>
            </div>

            <div className="flex gap-4">
                <Button
                    onClick={() => reset()} // reset() sẽ thử render lại phần bị lỗi
                    type="primary"
                    danger
                    size="large"
                    icon={<ReloadOutlined />}
                >
                    Thử lại
                </Button>
                <Button href="/" type="default" size="large">
                    Về trang chủ
                </Button>
            </div>
        </div>
    )
}
