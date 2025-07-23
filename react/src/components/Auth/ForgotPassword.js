import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { forgotPassword } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(values.email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Ошибка при восстановлении пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '50px 0' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Восстановление пароля</Title>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      {success ? (
        <Alert
          message="Инструкции по восстановлению пароля отправлены на ваш email"
          type="success"
          style={{ marginBottom: 16 }}
        />
      ) : (
        <Form
          name="forgot-password"
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
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Отправить
            </Button>
          </Form.Item>
        </Form>
      )}
      <Button type="link" onClick={() => navigate('/login')} block>
        Вернуться ко входу
      </Button>
    </div>
  );
};

export default ForgotPassword;