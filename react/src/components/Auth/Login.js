import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(values.email, values.password);
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '50px 0' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Вход</Title>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      <Form
        name="login"
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
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Войти
          </Button>
        </Form.Item>
      </Form>
      <Button type="link" onClick={() => navigate('/forgot-password')} block>
        Забыли пароль?
      </Button>
      <Button type="link" onClick={() => navigate('/register')} block>
        Нет аккаунта? Зарегистрироваться
      </Button>
    </div>
  );
};

export default Login;
