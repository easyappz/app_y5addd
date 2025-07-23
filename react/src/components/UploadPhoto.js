import React, { useState } from 'react';
import { Upload, Button, message, Card, List, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadPhoto, addPhotoToEvaluated, removePhotoFromEvaluated } from '../api/photo';

const { Dragger } = Upload;

const UploadPhoto = ({ userPhotos, setUserPhotos, userPoints }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async ({ file, onSuccess, onError }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const data = await uploadPhoto(formData);
      setUserPhotos([...userPhotos, { id: data.photoId, url: URL.createObjectURL(file), evaluated: false }]);
      onSuccess('ok');
      message.success('Фотография успешно загружена');
    } catch (error) {
      onError(error);
      message.error('Ошибка при загрузке фотографии');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEvaluated = async (photoId, checked) => {
    if (checked && userPoints < 1) {
      message.error('Недостаточно баллов для добавления в оцениваемые');
      return;
    }
    try {
      if (checked) {
        await addPhotoToEvaluated(photoId);
      } else {
        await removePhotoFromEvaluated(photoId);
      }
      setUserPhotos(userPhotos.map(photo => 
        photo.id === photoId ? { ...photo, evaluated: checked } : photo
      ));
      message.success(checked ? 'Фотография добавлена в оцениваемые' : 'Фотография удалена из оцениваемых');
    } catch (error) {
      message.error('Ошибка при изменении статуса фотографии');
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    customRequest: handleUpload,
    showUploadList: false,
  };

  return (
    <Card title="Загрузка фотографий" style={{ marginBottom: 24 }}>
      <Dragger {...uploadProps} disabled={loading} style={{ marginBottom: 16 }}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Нажмите или перетащите файлы для загрузки</p>
        <p className="ant-upload-hint">Поддерживаются только изображения (JPEG, PNG)</p>
      </Dragger>
      <List
        header={<div>Ваши фотографии</div>}
        bordered
        dataSource={userPhotos}
        renderItem={item => (
          <List.Item>
            <img src={item.url} alt="Uploaded" style={{ width: 100, height: 100, objectFit: 'cover', marginRight: 16 }} />
            <span>Статус: {item.evaluated ? 'Оценивается' : 'Не оценивается'}</span>
            <Switch 
              checked={item.evaluated} 
              onChange={(checked) => handleToggleEvaluated(item.id, checked)} 
              style={{ marginLeft: 16 }} 
              disabled={loading || (!item.evaluated && userPoints < 1)}
            />
          </List.Item>
        )}
      />
      <div style={{ marginTop: 16 }}>
        <p>Текущие баллы: {userPoints}</p>
        <p>Для добавления фотографии в оцениваемые требуется минимум 1 балл.</p>
      </div>
    </Card>
  );
};

export default UploadPhoto;
