'use client'

import { useState, useMemo, useCallback, useOptimistic, startTransition, useRef } from 'react';
import { Modal, Button, Input, Form, App } from 'antd';
import { type User } from '../types/common';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';

import { deleteUserAction, addUserAction } from '@/actions/userActions'; // Import thêm addUserAction
import { useRouter } from 'next/navigation';

export const UserList = ({ initialUsers }: { initialUsers: User[] }) => {
    // Không dùng useUsers hook cũ nữa
    const router = useRouter();

    // Sử dụng Hook của Ant Design
    const { modal, message } = App.useApp();

    // --- OPTIMISTIC UI (DELETE) ---
    // State ảo: Ban đầu bằng initialUsers. Khi gọi deleteOptimisticUser, nó sẽ tạm thời xóa user đó đi.
    const [optimisticUsers, deleteOptimisticUser] = useOptimistic(
        initialUsers,
        (currentUsers: User[], userIdToDelete: number) => {
            return currentUsers.filter(user => user.id !== userIdToDelete);
        }
    );

    // --- ADD USER STATE ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false); // Loading state thủ công

    // --- HANDLER DELETE ---
    const handleDelete = useCallback((userId: number, e: React.MouseEvent) => {
        // ... (Giữ nguyên logic delete cũ)
        e.stopPropagation();
        modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Xóa user này khỏi Database?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                startTransition(() => {
                    deleteOptimisticUser(userId);
                });
                const result = await deleteUserAction(userId);
                if (!result.success) message.error(result.message);
                else message.success(result.message);
            }
        });
    }, [modal, message, deleteOptimisticUser]);

    // --- HANDLER ADD (Server ActionWrapper) ---
    const handleAddUser = async (formData: FormData) => {
        setIsAdding(true);

        // Truyền thẳng FormData xuống Server Action (Server tự lo việc lấy name/email và mock data còn thiếu)
        const result = await addUserAction(formData);

        setIsAdding(false);

        if (result.success) {
            message.success(result.message);
            setIsAddModalOpen(false);
        } else {
            message.error(result.message);
        }
    }

    // State Form UI
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const defaultSearch = searchParams?.get('q') || '';

    const [searchTerm, setSearchTerm] = useState(defaultSearch);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Xử lý Search có Debounce
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const url = value ? `/?q=${encodeURIComponent(value)}` : '/';
            startTransition(() => {
                router.replace(url);
            });
        }, 500); // Đợi 500ms sau khi ngừng gõ mới gọi Server
    };

    // --- USE MEMO ---
    // Sử dụng optimisticUsers thay vì users (từ React Query)
    // const filteredUsers = useMemo(() => {
    //     return optimisticUsers.filter(user =>
    //         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    //     );
    // }, [optimisticUsers, searchTerm]);

    // 4. Render giao diện
    // Không cần check loading ở đây nữa vì initialUsers luôn có dữ liệu (hoặc rỗng) từ Server
    // if (loading) return <div style={{ padding: '20px', color: '#888' }}>⏳ Đang tải danh sách người dùng...</div>;
    // if (error) return <div style={{ padding: '20px', color: 'red' }}>⚠️ Lỗi: {error}</div>;

    return (
        <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            marginTop: '20px',
            textAlign: 'left',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Danh sách người dùng (Server-Side Search)</h3>

            <Input
                placeholder="Tìm kiếm theo tên hoặc email (Server)..."
                prefix={<SearchOutlined />}
                style={{ marginBottom: '20px' }}
                value={searchTerm}
                onChange={handleSearch}
            />

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {/* Lấy trực tiếp optimisticUsers (được sync từ initialUsers lấy từ DB theo từ khóa) */}
                {optimisticUsers.map(user => (
                    <li key={user.id}
                        onClick={() => router.push(`/users/${user.id}`)}
                        className="group"
                        style={{
                            marginBottom: '10px',
                            padding: '15px',
                            background: '#fff',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1668dc'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#333' }}>{user.name}</span>
                                <div style={{ fontSize: '0.9em', color: '#6b7280' }}>
                                    {user.email}
                                    {/* Highlight từ khóa tìm kiếm nếu thích (Client side logic) */}
                                </div>
                            </div>
                            <Button
                                type="text"
                                danger
                                onClick={(e) => handleDelete(user.id, e)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Xóa
                            </Button>
                        </div>
                    </li>
                ))}

                {optimisticUsers.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        Không tìm thấy user nào khớp với "{searchTerm}".
                    </div>
                )}
            </ul>

            {/* Nút thêm mới - FAB */}
            <Button
                type="primary"
                shape="circle"
                icon={<UserAddOutlined />}
                size="large"
                style={{ position: 'fixed', bottom: '30px', right: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
                onClick={() => setIsAddModalOpen(true)}
            />

            {/* Modal Form Thêm Mới */}
            <Modal
                title="Thêm người dùng mới"
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                footer={null} // Tự custom nút submit
            >
                <form action={handleAddUser} className="space-y-4 pt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                        <Input name="name" placeholder="Ví dụ: Nguyễn Văn A" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <Input type="email" name="email" placeholder="example@gmail.com" required />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button onClick={() => setIsAddModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={isAdding}>
                            {isAdding ? 'Đang lưu...' : 'Lưu User'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
