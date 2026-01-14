import Link from 'next/link'
import { Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h2 className="text-6xl font-bold text-gray-800 mb-4">404</h2>
            <p className="text-xl text-gray-600 mb-8">Không tìm thấy trang bạn yêu cầu.</p>

            <Link href="/">
                <Button type="primary" size="large" icon={<HomeOutlined />}>
                    Quay về trang chủ
                </Button>
            </Link>
        </div>
    )
}
