import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Home from './components/Home';
import UploadPhoto from './components/Upload';
import MyPhotos from './components/MyPhotos';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: 0, textAlign: 'center' }}>
          <h1>Система оценки фотографий</h1>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadPhoto />} />
            <Route path="/my-photos" element={<MyPhotos />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Система оценки фотографий ©2023
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;