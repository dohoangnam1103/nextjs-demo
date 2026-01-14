import UserModal from '@/components/UserModal';
import { Skeleton } from 'antd';

export default function LoadingModal() {
    return (
        <UserModal>
            <div className="p-4">
                {/* Skeleton Tiêu đề */}
                <Skeleton active paragraph={{ rows: 1 }} title={{ width: '50%' }} />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skeleton Cột 1 */}
                    <div className="space-y-4">
                        <Skeleton active paragraph={{ rows: 3 }} title={{ width: '30%' }} />
                    </div>

                    {/* Skeleton Cột 2 */}
                    <div className="space-y-4">
                        <Skeleton active paragraph={{ rows: 2 }} title={{ width: '30%' }} />
                    </div>
                </div>
            </div>
        </UserModal>
    );
}
