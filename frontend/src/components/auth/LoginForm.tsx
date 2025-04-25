import React, { useState } from 'react';
import {Button, Form, Input, message, Typography} from 'antd';
import {login} from "../../api/userService";

const { Title } = Typography;

interface LoginFormProps {
    onLoginSuccess: () => void;
    onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: {email:string, password:string} ) => {

        setLoading(true);
        try{
            const {token,username} = await login(values);
            localStorage.setItem('token', token);
            message.success('Welcome back, ' + username);
            onLoginSuccess();
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

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