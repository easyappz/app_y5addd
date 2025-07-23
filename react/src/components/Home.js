import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Alert, Select, Spin } from 'antd';
import { getPhotosToRate, ratePhoto } from '../api/photo';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [points, setPoints] = useState(10); // Начальные баллы
  const [genderFilter, setGenderFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhotos();
  }, [genderFilter, ageFilter]);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPhotosToRate();
      setPhotos(data);
      if (data.length > 0) {
        setCurrentPhoto(data[0]);
      } else {
        setCurrentPhoto(null);
      }
    } catch (err) {
      setError(err.message || 'Ошибка загрузки фотографий');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (score) => {
    if (!currentPhoto) return;
    setLoading(true);
    try {
      await ratePhoto(currentPhoto.id, score);
      setPoints(points + 1); // Добавляем балл за оценку
      const newPhotos = photos.filter((p) => p.id !== currentPhoto.id);
      setPhotos(newPhotos);
      setCurrentPhoto(newPhotos.length > 0 ? newPhotos[0] : null);
    } catch (err) {
      setError(err.message || 'Ошибка при оценке');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Оценка фотографий</Title>
      <Text style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}>
        Ваши баллы: {points}
      </Text>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Button onClick={() => navigate('/upload')} style={{ marginRight: 10 }}>
          Загрузить фото
        </Button>
        <Button onClick={() => navigate('/my-photos')}>
          Мои фотографии
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Select
          defaultValue="all"
          style={{ width: 120, marginRight: 10 }}
          onChange={setGenderFilter}
        >
          <Option value="all">Все полы</Option>
          <Option value="male">Мужской</Option>
          <Option value="female">Женский</Option>
        </Select>
        <Select
          defaultValue="all"
          style={{ width: 120 }}
          onChange={setAgeFilter}
        >
          <Option value="all">Все возраста</Option>
          <Option value="18-25">18-25</Option>
          <Option value="26-35">26-35</Option>
          <Option value="36-50">36-50</Option>
        </Select>
      </div>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: 'auto' }} />
      ) : currentPhoto ? (
        <Card
          cover={<img alt="Фото для оценки" src={currentPhoto.filePath} style={{ height: 400, objectFit: 'contain' }} />}
          actions={[
            <Button key="1" onClick={() => handleRate(1)}>1</Button>,
            <Button key="2" onClick={() => handleRate(2)}>2</Button>,
            <Button key="3" onClick={() => handleRate(3)}>3</Button>,
            <Button key="4" onClick={() => handleRate(4)}>4</Button>,
            <Button key="5" onClick={() => handleRate(5)}>5</Button>,
          ]}
        >
          <Card.Meta title="Оцените это фото" description="Выберите оценку от 1 до 5" />
        </Card>
      ) : (
        <Alert message="Нет фотографий для оценки" type="info" />
      )}
    </div>
  );
};

export default Home;