import React, {useState} from 'react';
import {Button, Card, Form, Input, message, Typography} from 'antd';
import {login} from "../../api/userService";

const {Title} = Typography;

interface LoginFormProps {
    onLoginSuccess: () => void;
    onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onLoginSuccess, onSwitchToRegister}) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string, password: string }) => {

        setLoading(true);
        try {
            const {token, username} = await login(values);
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
        <div style={{
            height: '100vh',
            backgroundImage: 'url("/img/login_background_2.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            overflow: 'hidden'
        }}>
            <Card style={{
                maxWidth: 380,
                width: '100%',
                padding: '24px',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
                <Title level={2} style={{textAlign: 'center', marginBottom: '24px'}}>Welcome Back</Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="email" label="Email" rules={[{required: true, type: 'email'}]}>
                        <Input placeholder="Enter your email"/>
                    </Form.Item>

                    <Form.Item name="password" label="Password" rules={[{required: true, min: 6}]}>
                        <Input.Password placeholder="Enter your password"/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading} size="large">
                            Log In
                        </Button>
                    </Form.Item>
                </Form>

                {onSwitchToRegister && (
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <span style={{ color: 'rgba(0,0,0,0.45)' }}>Don't have an account? </span>
                        <Button type="link" onClick={onSwitchToRegister}>
                            Register here
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default LoginForm;