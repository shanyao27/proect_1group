import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Menu.css';

const Menu = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(location.state?.userData || null);

  useEffect(() => {
    if (user) {
      const storedUsers = JSON.parse(localStorage.getItem('appUsers')) || [];
      const currentUser = storedUsers.find(u => u.id === user.id);
      if (currentUser) setUser(currentUser);
    }
  }, []);

  if (!user) return <p>Нет данных пользователя</p>;
    
  return (
    <div className="menu-container">
      <div className="menu-box">
        <h1 className="menu-title">Добро пожаловать, {user.name}!</h1>

        <div className="menu-options">
                  <button className="menu-button" onClick={() => navigate('/products', { state: { userData: user } })} >Товары</button>
          <button className="menu-button" onClick={() => navigate('/profile', { state: { userData: user } })}>Профиль</button>
          {user.role === 'admin' && (
            <button className="menu-button admin-button" onClick={() => navigate('/admin')}>Админ панель</button>
          )}
          <button className="menu-button logout-button" onClick={() => navigate('/')}>Выйти</button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
