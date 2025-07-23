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
      const data = await getPhotosToRate({ gender: genderFilter, age: ageFilter });
      setPhotos(data);
      if (data.length > 0) {
        setCurrentPhoto(data[0]);
      } else {
        setCurrentPhoto(null);
      }
    } catch (error) {
      let errorMessage = 'Ошибка при загрузке фотографий для оценки';
      if (error.status === 401) {
        errorMessage = 'Вы не авторизованы. Пожалуйста, войдите в систему.';
      } else if (error.status === 500) {
        errorMessage = 'Серверная ошибка. Попробуйте позже.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      message.error({
        content: errorMessage,
        style: {
          marginTop: '20px',
          fontSize: '16px',
          textAlign: 'center',
        },
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async () => {
    if (!currentPhoto || rating === 0) {
      message.error({
        content: 'Пожалуйста, выберите оценку',
        style: {
          marginTop: '20px',
          fontSize: '16px',
          textAlign: 'center',
        },
        duration: 2,
      });
      return;
    }
    setLoading(true);
    try {
      await ratePhoto(currentPhoto.id, rating);
      message.success({
        content: 'Оценка сохранена',
        style: {
          marginTop: '20px',
          fontSize: '16px',
          textAlign: 'center',
        },
        duration: 2,
      });
      const updatedPhotos = photos.filter(photo => photo.id !== currentPhoto.id);
      setPhotos(updatedPhotos);
      setRating(0);
      if (updatedPhotos.length > 0) {
        setCurrentPhoto(updatedPhotos[0]);
      } else {
        setCurrentPhoto(null);
        message.info({
          content: 'Фотографии для оценки закончились',
          style: {
            marginTop: '20px',
            fontSize: '16px',
            textAlign: 'center',
          },
          duration: 3,
        });
      }
    } catch (error) {
      let errorMessage = 'Ошибка при сохранении оценки';
      if (error.status === 401) {
        errorMessage = 'Вы не авторизованы. Пожалуйста, войдите в систему.';
      } else if (error.status === 400) {
        errorMessage = 'Недопустимая оценка или фотография уже оценена.';
      } else if (error.status === 404) {
        errorMessage = 'Фотография не найдена.';
      } else if (error.status === 500) {
        errorMessage = 'Серверная ошибка. Попробуйте позже.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      message.error({
        content: errorMessage,
        style: {
          marginTop: '20px',
          fontSize: '16px',
          textAlign: 'center',
        },
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Оценка фотографий" style={{ marginBottom: 24, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
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
        <div style={{ textAlign: 'center', padding: 20 }}>
          <Spin size="large" />
        </div>
      ) : currentPhoto ? (
        <div style={{ textAlign: 'center' }}>
          <img 
            src={currentPhoto.filePath} 
            alt="Фото для оценки" 
            style={{ maxWidth: '100%', maxHeight: 400, marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }} 
          />
          <div style={{ marginBottom: 16 }}>
            <Rate value={rating} onChange={setRating} style={{ fontSize: 24 }} />
          </div>
          <Button type="primary" onClick={handleRate} disabled={loading || rating === 0} style={{ padding: '8px 16px', fontSize: 16 }}>
            Оценить
          </Button>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#888', fontSize: 16 }}>
          Фотографии для оценки отсутствуют. Попробуйте изменить фильтры.
        </p>
      )}
    </Card>
  );
};

export default RatePhoto;
