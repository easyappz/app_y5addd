import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { resetPassword } from '../../api/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Title } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await resetPassword(token, values.password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '50px 0' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Сброс пароля</Title>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      {success ? (
        <Alert
          message="Пароль успешно изменен. Теперь вы можете войти с новым паролем."
          type="success"
          style={{ marginBottom: 16 }}
        />
      ) : (
        <Form
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Новый пароль"
            name="password"
            rules={[{ required: true, message: 'Введите новый пароль' }]}
          >
            <Input.Password placeholder="Введите новый пароль" />
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
              Сохранить
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

export default ResetPassword;