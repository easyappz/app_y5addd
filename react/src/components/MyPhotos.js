import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Alert, Spin, Modal } from 'antd';
import { getMyPhotos, getPhotoStatistics, addPhotoToEvaluated, removePhotoFromEvaluated } from '../api/photo';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const MyPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [points, setPoints] = useState(10); // Начальные баллы
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyPhotos();
        setPhotos(data.photos || []);
        setPoints(data.points || 10);
      } catch (err) {
        setError(err.message || 'Ошибка при загрузке фотографий');
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const handleToggleEvaluate = async (photoId, isEvaluated) => {
    if (!isEvaluated && points <= 0) {
      Modal.warning({
        title: 'Недостаточно баллов',
        content: 'У вас недостаточно баллов для добавления фото в список оцениваемых. Оцените фото других пользователей, чтобы заработать баллы.',
      });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isEvaluated) {
        await removePhotoFromEvaluated(photoId);
        setPhotos(photos.map(p => p.id === photoId ? { ...p, isEvaluated: false } : p));
      } else {
        await addPhotoToEvaluated(photoId);
        setPhotos(photos.map(p => p.id === photoId ? { ...p, isEvaluated: true } : p));
        setPoints(points - 1);
      }
    } catch (err) {
      setError(err.message || 'Ошибка при изменении статуса фото');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStats = async (photoId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPhotoStatistics(photoId);
      setSelectedPhoto(photoId);
      setStats(data);
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке статистики');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Мои фотографии</Title>
      <Text style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}>
        Ваши баллы: {points}
      </Text>
      <Button
        type="primary"
        onClick={() => navigate('/upload')}
        style={{ display: 'block', margin: '0 auto 20px' }}
      >
        Загрузить новое фото
      </Button>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: 'auto' }} />
      ) : photos.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {photos.map((photo) => (
            <Card
              key={photo.id}
              hoverable
              style={{ width: 240, borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
              cover={<img alt="Мое фото" src={photo.filePath} style={{ height: 200, objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />}
              actions={[
                <Button
                  key="evaluate"
                  type={photo.isEvaluated ? 'default' : 'primary'}
                  onClick={() => handleToggleEvaluate(photo.id, photo.isEvaluated)}
                  disabled={loading || (!photo.isEvaluated && points <= 0)}
                  style={{ width: '90%', margin: '0 auto' }}
                >
                  {photo.isEvaluated ? 'Убрать из оценки' : 'Добавить для оценки'}
                </Button>,
                <Button 
                  key="stats" 
                  type="default"
                  onClick={() => handleViewStats(photo.id)} 
                  disabled={loading}
                  style={{ width: '90%', margin: '0 auto' }}
                >
                  Статистика
                </Button>,
              ]}
            >
              <Card.Meta 
                title={`Фото ID: ${photo.id}`} 
                description={photo.isEvaluated ? 'В оценке' : 'Не в оценке'} 
                style={{ textAlign: 'center' }}
              />
            </Card>
          ))}
        </div>
      ) : (
        <Alert message="У вас нет загруженных фотографий" type="info" style={{ textAlign: 'center' }} />
      )}
      {stats && selectedPhoto && (
        <Modal
          title="Статистика фотографии"
          open={!!stats}
          onCancel={() => {
            setStats(null);
            setSelectedPhoto(null);
          }}
          footer={null}
          centered
          style={{ maxWidth: 500 }}
        >
          <div style={{ padding: '10px 0', textAlign: 'center' }}>
            <Text strong style={{ display: 'block', marginBottom: 10 }}>
              Всего оценок: {stats.totalRatings}
            </Text>
            <Text strong style={{ display: 'block', marginBottom: 10 }}>
              Средняя оценка: {stats.averageScore}
            </Text>
            <Text strong style={{ display: 'block' }}>
              Оценки: {stats.scores.join(', ')}
            </Text>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyPhotos;