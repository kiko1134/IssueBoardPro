import React, {useState} from 'react';
import {Button, Form, Input, message, Typography} from 'antd';
import {register} from "../../api/userService";

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
        <div style={{maxWidth: 300, margin: '100px auto'}}>
            <Title level={3}>Register</Title>

            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item name="name" label="Name" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>

                <Form.Item name="email" label="Email" rules={[{required: true, type: 'email'}]}>
                    <Input/>
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[{required: true, min: 6}]}>
                    <Input.Password/>
                </Form.Item>

                <Form.Item name="confirmPassword" label="Confirm Password" dependencies={['password']} hasFeedback
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
                    <Input.Password/>
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