'use client';

import { loginAction } from '@/actions/authActions';
import { Button, Input, Card, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card title="Đăng nhập hệ thống" className="w-96 shadow-xl" variant="borderless">
                {/* Google Sign In */}
                <Button
                    size="large"
                    icon={<GoogleOutlined />}
                    onClick={handleGoogleSignIn}
                    className="w-full mb-4"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: '#4285f4',
                        color: '#4285f4'
                    }}
                >
                    Đăng nhập bằng Google
                </Button>

                <Divider>Hoặc</Divider>

                {/* Email/Password Form */}
                <form action={loginAction}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <Input
                                name="email"
                                prefix={<UserOutlined />}
                                placeholder="admin@gmail.com"
                                size="large"
                                defaultValue="test@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <Input.Password
                                name="password"
                                prefix={<LockOutlined />}
                                placeholder="123123"
                                size="large"
                                defaultValue="password123"
                                required
                            />
                        </div>

                        <Button type="primary" htmlType="submit" className="w-full mt-4" size="large">
                            Đăng nhập
                        </Button>
                    </div>
                </form>

                <div className="mt-4 text-center text-gray-500 text-xs">
                    <p>Demo Account:</p>
                    <p>Email: test@example.com / Pass: password123</p>
                </div>
            </Card>
        </div>
    );
}
