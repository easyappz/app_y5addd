import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import UploadPhoto from '../components/UploadPhoto';
import RatePhoto from '../components/RatePhoto';

const { Header, Content, Footer } = Layout;

const Home = () => {
  const [currentTab, setCurrentTab] = useState('upload');
  const [userPhotos, setUserPhotos] = useState([]);
  const [userPoints, setUserPoints] = useState(10); // Mock value for points

  const menuItems = [
    { key: 'upload', label: 'Загрузить фото' },
    { key: 'rate', label: 'Оценить фото' },
  ];

  const handleMenuClick = (e) => {
    setCurrentTab(e.key);
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['upload']}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 24 }}>
        <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 380 }}>
          {currentTab === 'upload' && (
            <UploadPhoto userPhotos={userPhotos} setUserPhotos={setUserPhotos} userPoints={userPoints} />
          )}
          {currentTab === 'rate' && <RatePhoto />}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Photo Rating App ©2023
      </Footer>
    </Layout>
  );
};

export default Home;
