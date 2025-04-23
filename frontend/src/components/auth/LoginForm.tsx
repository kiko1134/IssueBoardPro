import React, { useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';

const { Title } = Typography;

interface LoginFormProps {
    onLoginSuccess: () => void;
    onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [loading, setLoading] = useState(false);


    // const onFinish = async (values: any) => {
    //     setLoading(true);
    //     try {
    //         const data = await login(values.email, values.password);
    //         localStorage.setItem('token', data.token);
    //         message.success('Login successful!');
    //         onLoginSuccess();
    //     } catch (error: any) {
    //         message.error(error?.response?.data?.message || 'Login failed');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const onFinish = (values: any) => {
        setLoading(true);

        // Тук можеш да добавиш реална логика за login (напр. API call)
        console.log('Login with:', values);

        setTimeout(() => {
            setLoading(false);
            onLoginSuccess(); // казваме на App.tsx, че сме "влезли"
        }, 1000);
    };

    return (
        <div style={{ maxWidth: 300, margin: '100px auto' }}>
            <Title level={3}>Login</Title>

            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Login
                    </Button>
                </Form.Item>

                {onSwitchToRegister && (
                    <Form.Item>
                        <Button type="link" onClick={onSwitchToRegister} block>
                            Don't have and account? Register
                        </Button>
                    </Form.Item>
                )}
            </Form>
        </div>
    );
};

export default LoginForm;