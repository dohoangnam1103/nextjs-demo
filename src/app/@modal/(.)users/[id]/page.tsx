import UserModal from '@/components/UserModal';
import { userService } from '@/services/userService';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ id: string }>
}

export default async function InterceptedUserPage({ params }: Props) {
    const { id } = await params;

    // Fetch dữ liệu (nếu đã cache thì lấy từ cache, cực nhanh)
    let user;
    try {
        user = await userService.getUserDetail(id);
        if (!user) notFound();
    } catch {
        notFound();
    }

    return (
        <UserModal>
            <div className="p-4">
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
        </UserModal>
    );
}
