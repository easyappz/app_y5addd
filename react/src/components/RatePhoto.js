import React, { useState, useEffect } from 'react';
import { Card, Button, Select, message, Rate, Spin } from 'antd';
import { getPhotosToRate, ratePhoto } from '../api/photo';

const { Option } = Select;

const RatePhoto = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [genderFilter, setGenderFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');

  useEffect(() => {
    fetchPhotos();
  }, [genderFilter, ageFilter]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await getPhotosToRate();
      setPhotos(data);
      if (data.length > 0) {
        setCurrentPhoto(data[0]);
      } else {
        setCurrentPhoto(null);
      }
    } catch (error) {
      message.error('Ошибка при загрузке фотографий для оценки');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async () => {
    if (!currentPhoto || rating === 0) {
      message.error('Пожалуйста, выберите оценку');
      return;
    }
    setLoading(true);
    try {
      await ratePhoto(currentPhoto.id, rating);
      message.success('Оценка сохранена');
      const updatedPhotos = photos.filter(photo => photo.id !== currentPhoto.id);
      setPhotos(updatedPhotos);
      setRating(0);
      if (updatedPhotos.length > 0) {
        setCurrentPhoto(updatedPhotos[0]);
      } else {
        setCurrentPhoto(null);
        message.info('Фотографии для оценки закончились');
      }
    } catch (error) {
      message.error('Ошибка при сохранении оценки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Оценка фотографий" style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Select 
          defaultValue="all" 
          style={{ width: 120, marginRight: 16 }} 
          onChange={value => setGenderFilter(value)}
        >
          <Option value="all">Все полы</Option>
          <Option value="male">Мужской</Option>
          <Option value="female">Женский</Option>
        </Select>
        <Select 
          defaultValue="all" 
          style={{ width: 120 }} 
          onChange={value => setAgeFilter(value)}
        >
          <Option value="all">Все возраста</Option>
          <Option value="18-25">18-25</Option>
          <Option value="26-35">26-35</Option>
          <Option value="36-50">36-50</Option>
          <Option value="50+">50+</Option>
        </Select>
      </div>
      {loading ? (
        <Spin size="large" />
      ) : currentPhoto ? (
        <div style={{ textAlign: 'center' }}>
          <img 
            src={currentPhoto.filePath} 
            alt="Photo to rate" 
            style={{ maxWidth: '100%', maxHeight: 400, marginBottom: 16 }} 
          />
          <div style={{ marginBottom: 16 }}>
            <Rate value={rating} onChange={setRating} />
          </div>
          <Button type="primary" onClick={handleRate} disabled={loading || rating === 0}>
            Оценить
          </Button>
        </div>
      ) : (
        <p>Фотографии для оценки отсутствуют. Попробуйте изменить фильтры.</p>
      )}
    </Card>
  );
};

export default RatePhoto;
