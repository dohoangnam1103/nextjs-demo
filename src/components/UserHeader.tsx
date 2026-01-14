'use client'

import { Button, Avatar, Dropdown, MenuProps } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { logoutAction } from '@/actions/authActions'

// Nhận user session từ Server Component cha
export default function UserHeader({ user }: { user: any }) {

    if (!user) return null; // Chưa login thì không hiện gì (hoặc hiện nút Login)

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a onClick={() => logoutAction()}>
                    <LogoutOutlined /> Đăng xuất
                </a>
            ),
        },
    ];

    return (
        <div className="absolute top-5 right-5 z-50 flex items-center gap-3">
            <span className="text-gray-800 font-semibold hidden md:inline">Xin chào, {user.name}</span>
            <Dropdown menu={{ items }} placement="bottomRight">
                <Avatar style={{ backgroundColor: '#87d068', cursor: 'pointer' }} icon={<UserOutlined />} />
            </Dropdown>
        </div>
    )
}
