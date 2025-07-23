import React, { useState } from 'react';
import { Upload, Button, Typography, Alert, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadPhoto } from '../api/photo';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const UploadPhoto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async ({ file }) => {
    setLoading(true);
    setError(null);
    try {
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('photo', file);
      await uploadPhoto(formData);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке фото');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Загрузить фотографию</Title>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      {success ? (
        <Alert
          message="Фотография успешно загружена!"
          type="success"
          style={{ marginBottom: 16 }}
        />
      ) : (
        <Card style={{ textAlign: 'center', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <Upload
            customRequest={handleUpload}
            showUploadList={false}
            accept="image/jpeg,image/png"
            disabled={loading}
          >
            <Button icon={<UploadOutlined />} loading={loading} size="large" style={{ borderRadius: 6 }}>
              Выбрать фото
            </Button>
          </Upload>
          <p style={{ marginTop: 10, color: '#888', fontSize: '14px' }}>
            Поддерживаются форматы JPEG и PNG, максимальный размер 5 МБ
          </p>
        </Card>
      )}
      <Button
        onClick={() => navigate('/')}
        style={{ marginTop: 20, borderRadius: 6 }}
        size="large"
        block
      >
        Вернуться на главную
      </Button>
    </div>
  );
};

export default UploadPhoto;