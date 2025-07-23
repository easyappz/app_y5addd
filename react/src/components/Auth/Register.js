import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { register } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(values.email, values.password);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '50px 0' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Регистрация</Title>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      <Form
        name="register"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Введите ваш email', type: 'email' }]}
        >
          <Input placeholder="Введите email" />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>
        <Form.Item
          label="Подтверждение пароля"
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Подтвердите пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли не совпадают'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Подтвердите пароль" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
      <Button type="link" onClick={() => navigate('/login')} block>
        Уже есть аккаунт? Войти
      </Button>
    </div>
  );
};

export default Register;