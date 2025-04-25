import React, { useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';
const { Title } = Typography;

interface RegisterFormProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [loading, setLoading] = useState(false);

    // const onFinish = async (values: any) => {
    //     setLoading(true);
    //     try {
    //         await register(values.name, values.email, values.password);
    //         message.success('Registration successful!');
    //         onRegisterSuccess();
    //     } catch (error: any) {
    //         message.error(error?.response?.data?.message || 'Registration failed');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const onFinish = (values: any) => {
        setLoading(true);

        // Имитация на регистрация
        console.log('Registering with:', values);

        setTimeout(() => {
            setLoading(false);
            onRegisterSuccess(); // Можем да логнем или върнем към login
        }, 1000);
    };

    return (
        <div style={{ maxWidth: 300, margin: '100px auto' }}>
            <Title level={3}>Register</Title>

            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item name="confirmPassword" label="Confirm Password" dependencies={['password']} hasFeedback
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Register
                    </Button>
                </Form.Item>

                {onSwitchToLogin && (
                    <Form.Item>
                        <Button type="link" onClick={onSwitchToLogin} block>
                            Already have an account? Login
                        </Button>
                    </Form.Item>
                )}
            </Form>
        </div>
    );
};

export default RegisterForm;