import React, {useState} from 'react';
import {Button, Card, Form, Input, message, Typography} from 'antd';
import {register} from "../../api/services/userService";

const {Title} = Typography;

interface RegisterFormProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({onRegisterSuccess, onSwitchToLogin}) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
        setLoading(true);
        try {
            await register({username: values.name, email: values.email, password: values.password});
            message.success('Registration successful! Please login.');
            onRegisterSuccess();
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (

        <div
            style={{
                position: 'relative',
                height: '100vh',
                width: '100%',
                backgroundImage: 'url("/img/login_background_2.webp")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                }}
            />

            <Card
                style={{
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: 400,
                    width: '100%',
                    padding: '32px 24px',
                    borderRadius: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
            >
                <Title level={2} style={{textAlign: 'center', marginBottom: 24, color: '#333'}}>
                    Create Account
                </Title>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="name" label="Username" rules={[
                        {required: true},
                        { pattern: /^[\x00-\x7F]+$/, message: 'Username must contain only English characters' }
                    ]}>
                        <Input placeholder="Enter your username" size="large" style={{borderRadius: 4}}/>
                    </Form.Item>

                    <Form.Item name="email" label="Email" rules={[
                        {required: true, type: 'email'},
                        { pattern: /^[\x00-\x7F]+$/, message: 'Email must contain only English characters' }
                    ]}>
                        <Input placeholder="Enter your email" size="large" style={{borderRadius: 4}}/>
                    </Form.Item>

                    <Form.Item name="password" label="Password" rules={[
                        {required: true, min: 6},
                        { pattern: /^[\x00-\x7F]+$/, message: 'Password must contain only English characters' }
                    ]}>
                        <Input.Password placeholder="Enter your password" size="large" style={{borderRadius: 4}}/>
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {required: true, message: 'Please confirm your password!'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm your password" size="large" style={{borderRadius: 4}}/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}
                                style={{borderRadius: 4}}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>

                {onSwitchToLogin && (
                    <div style={{textAlign: 'center', marginTop: 16}}>
            <span style={{color: 'rgba(0,0,0,0.45)'}}>
              Already have an account?
            </span>
                        <Button type="link" onClick={onSwitchToLogin}>
                            Log In here
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default RegisterForm;