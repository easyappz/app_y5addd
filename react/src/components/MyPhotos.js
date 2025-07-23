import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Alert, Spin, Modal } from 'antd';
import { getPhotoStatistics, addPhotoToEvaluated, removePhotoFromEvaluated } from '../api/photo';
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
    // Здесь должен быть запрос на получение списка загруженных фотографий пользователя
    // Пока используем заглушку
    setTimeout(() => {
      setPhotos([
        { id: '1', filePath: '/placeholder-image.jpg', isEvaluated: false },
        { id: '2', filePath: '/placeholder-image.jpg', isEvaluated: true },
      ]);
      setLoading(false);
    }, 1000);
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
        onClick={() => navigate('/upload')}
        style={{ display: 'block', margin: '0 auto 20px' }}
      >
        Загрузить новое фото
      </Button>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: 'auto' }} />
      ) : photos.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {photos.map((photo) => (
            <Card
              key={photo.id}
              cover={<img alt="Мое фото" src={photo.filePath} style={{ height: 200, objectFit: 'contain' }} />}
              actions={[
                <Button
                  key="evaluate"
                  onClick={() => handleToggleEvaluate(photo.id, photo.isEvaluated)}
                  disabled={loading || (!photo.isEvaluated && points <= 0)}
                >
                  {photo.isEvaluated ? 'Убрать из оценки' : 'Добавить для оценки'}
                </Button>,
                <Button key="stats" onClick={() => handleViewStats(photo.id)} disabled={loading}>
                  Статистика
                </Button>,
              ]}
            >
              <Card.Meta title={`Фото ID: ${photo.id}`} description={photo.isEvaluated ? 'В оценке' : 'Не в оценке'} />
            </Card>
          ))}
        </div>
      ) : (
        <Alert message="У вас нет загруженных фотографий" type="info" />
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
        >
          <p>Всего оценок: {stats.totalRatings}</p>
          <p>Средняя оценка: {stats.averageScore}</p>
          <p>Оценки: {stats.scores.join(', ')}</p>
          {/* Здесь можно добавить более детализированную статистику по полу и возрасту, если API это поддерживает */}
        </Modal>
      )}
    </div>
  );
};

export default MyPhotos;