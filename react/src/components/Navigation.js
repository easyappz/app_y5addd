import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import '../App.css';

const Navigation = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navigation-bar">
      <div className="nav-links">
        <Link to="/home" className="nav-link">Главная</Link>
        <Link to="/my-photos" className="nav-link">Мои фото</Link>
        <Link to="/upload" className="nav-link">Загрузить фото</Link>
        <Link to="/rate" className="nav-link">Оценить фото</Link>
      </div>
      <button onClick={handleLogout} className="logout-button">Выйти</button>
    </nav>
  );
};

export default Navigation;
