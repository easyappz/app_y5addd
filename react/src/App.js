import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import MyPhotos from './components/MyPhotos';
import Upload from './components/Upload';
import RatePhoto from './components/RatePhoto';
import { checkAuth } from './api/auth';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by validating token via API call
    const verifyAuth = async () => {
      try {
        const isAuth = await checkAuth();
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error('Error during auth check:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div>Загрузка...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes for unauthenticated users */}
          <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/home" />} />
          <Route path="/register" element={!isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/home" />} />
          <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/home" />} />
          <Route path="/reset-password" element={!isAuthenticated ? <ResetPassword setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/home" />} />

          {/* Protected routes for authenticated users */}
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/my-photos" element={isAuthenticated ? <MyPhotos /> : <Navigate to="/login" />} />
          <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} />
          <Route path="/rate" element={isAuthenticated ? <RatePhoto /> : <Navigate to="/login" />} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
