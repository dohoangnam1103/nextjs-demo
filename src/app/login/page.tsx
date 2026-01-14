'use client';

import { useActionState } from 'react';
import { loginAction } from '@/actions/authActions'; // Chúng ta sẽ tạo file này sau
import { Button, Input, Form, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useFormStatus } from 'react-dom';

// Component nút Submit có loading state
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-4"
            loading={pending}
            size="large"
        >
            {pending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
    );
}

// Initial State cho useActionState
const initialState = {
    message: '',
    error: undefined,
};

export default function LoginPage() {
    const [state, action] = useActionState(loginAction, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card title="Đăng nhập hệ thống" className="w-96 shadow-xl" variant="borderless">
                <form action={action}>
                    <div className="space-y-4">
                        {/* Hiển thị lỗi nếu có */}
                        {state?.message && (
                            <Alert message={state.message} type="error" showIcon className="mb-4" />
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <Input
                                name="email"
                                prefix={<UserOutlined />}
                                placeholder="admin@gmail.com"
                                size="large"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <Input.Password
                                name="password"
                                prefix={<LockOutlined />}
                                placeholder="123123"
                                size="large"
                            />
                        </div>

                        <SubmitButton />
                    </div>
                </form>

                <div className="mt-4 text-center text-gray-500 text-xs">
                    <p>Demo Account:</p>
                    <p>Email: admin@gmail.com / Pass: 123123</p>
                </div>
            </Card>
        </div>
    );
}
