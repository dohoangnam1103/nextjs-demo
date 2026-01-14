'use client';

import { Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UserModal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    const handleCancel = () => {
        setOpen(false);
        router.back(); // Quay lại trang trước (tắt modal & đổi URL)
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null} // Không hiện nút OK/Cancel mặc định
            width={800}
            centered
            destroyOnClose
            style={{ top: 20 }}
        >
            {children}
        </Modal>
    );
}
