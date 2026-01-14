import { userService } from '@/services/userService';
import { Button } from 'antd';
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Hàm tạo Metadata động cho SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const user = await userService.getUserDetail(id);

    if (!user) {
        return {
            title: 'Người dùng không tồn tại',
            description: 'Không tìm thấy thông tin người dùng.'
        };
    }

    return {
        title: `${user.name} | User Profile`,
        description: `Thông tin chi tiết về ${user.name}, làm việc tại ${user.company?.name}. Liên hệ: ${user.email}`,
        openGraph: {
            title: user.name,
            description: `Profile của ${user.name}`,
            // images: [user.avatar] // Nếu có ảnh
        }
    };
}

// ... (generateStaticParams giữ nguyên)
// Next.js sẽ gọi hàm này lúc Build, lấy danh sách ID, và render HTML sẵn cho từng user.
export async function generateStaticParams() {
    const users = await userService.getUsers();

    // GIẢ LẬP: Chỉ build trước 3 user đầu tiên (Hàng Hot)
    // Các user còn lại (4, 5, 6...) sẽ được geneate lúc Runtime (Hàng Ế)
    return users.slice(0, 3).map((user) => ({
        id: String(user.id),
    }));
}

// Định nghĩa kiểu cho props của Page
// params trong Next.js 15 là Promise, cần await
type Props = {
    params: Promise<{ id: string }>
}



export default async function UserDetailPage({ params }: Props) {
    // Lấy ID từ URL
    const { id } = await params;

    console.log(`[SERVER RENDER] Rendering Page for User ID: ${id} at ${new Date().toISOString()}`);

    let user;
    try {
        // Fetch dữ liệu trên Server
        user = await userService.getUserDetail(id);
        // Kiểm tra nếu API trả về rỗng (tùy logic API của bạn)
        if (!user) notFound();
    } catch (error) {
        // Nếu API lỗi 404 -> Chuyển sang trang Not Found
        console.error("Fetch User Error:", error);
        notFound();
    }

    return (
        <div className="min-h-screen p-24">
            <Link href="/">
                <Button icon={<ArrowLeftOutlined />} className="mb-8">
                    Quay lại danh sách
                </Button>
            </Link>

            <div className="bg-white border border-gray-200 p-8 rounded-xl max-w-2xl mx-auto shadow-xl">
                <h1 className="text-3xl font-bold mb-2 text-blue-600">{user.name}</h1>
                <p className="text-gray-500 mb-8 italic">@{user.username || 'unknown'}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold border-b border-gray-200 pb-2 text-gray-800">Thông tin liên hệ</h3>
                        <p className="text-gray-700"><strong>📧 Email:</strong> {user.email}</p>
                        <p className="text-gray-700"><strong>📞 Phone:</strong> {user.phone}</p>
                        <p className="text-gray-700"><strong>🌐 Website:</strong> {user.website}</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold border-b border-gray-200 pb-2 text-gray-800">Công ty</h3>
                        <p className="text-gray-700"><strong>🏢 Name:</strong> {user.company?.name}</p>
                        <p className="text-gray-700"><strong>📍 CatchPhrase:</strong> {user.company?.catchPhrase}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
