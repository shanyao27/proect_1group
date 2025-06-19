import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Получаем данные пользователя из состояния навигации
  const userData = location.state?.userData || {};
    console.log(userData);
  return (
    <div className="menu-container">
      <div className="menu-box">
        <h1 className="menu-title">Добро пожаловать, {userData.name || 'Гость'}!</h1>
        
        <div className="menu-options">
          <button 
            className="menu-button"
            onClick={() => navigate('/products')}
          >
            Товары
          </button>
          
          <button 
            className="menu-button"
            onClick={() => navigate('/profile')}
          >
            Профиль
          </button>
          
          {/* Кнопка админ-панели показывается только для admin */}
          {userData.role == 'admin' && (
            <button
              className="menu-button admin-button"
              onClick={() => navigate('/admin')}
            >
              Админ панель
            </button>
          )}
          
          <button 
            className="menu-button logout-button"
            onClick={() => navigate('/')}
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;