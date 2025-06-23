import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.userData;



  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    avatar: user?.avatar || null,
  });

  const [message, setMessage] = useState('');

  if (!user) {
    return <p style={{ padding: '2rem' }}>Нет данных пользователя</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setMessage('');

    // Email валидация
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Неверный формат email');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setMessage('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage('Пароли не совпадают');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('appUsers')) || [];
    const updatedUsers = storedUsers.map(u =>
      u.id === user.id
        ? {
          ...u,
          name: formData.name,
          email: formData.email,
          password: formData.password ? formData.password : u.password,
          avatar: formData.avatar
        }
        : u
    );

    localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
    setMessage('Профиль успешно обновлён');
  };


  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.');

    if (!confirmed) return;

    const storedUsers = JSON.parse(localStorage.getItem('appUsers')) || [];
    const updatedUsers = storedUsers.filter(u => u.id !== user.id);

    localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
    navigate('/'); // редирект на логин
  };


  return (
    <div className="profile-page">
      <nav className="profile-nav">
        <div className="nav-buttons">
          <button className="back-button" onClick={() => navigate('/menu', { state: { userData: user } })}>
            Назад
          </button>
          <button className="products-button" onClick={() => navigate('/products', { state: { userData: user } })}>
            Товары
          </button>
        </div>
        <h1 className="profile-title">Профиль</h1>
        <div className="nav-placeholder"></div>
      </nav>

      <div className="profile-card">
        <img
          src={formData.avatar || 'https://via.placeholder.com/120?text=Avatar'}
          className="profile-avatar"
        />
        <label className="avatar-upload-label">
          Загрузить фото
          <input
            type="file"
            accept="image/*"
            className="avatar-upload-input"
            onChange={handleAvatarChange}
          />
        </label>

        <label>Имя</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="profile-input" />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="profile-input" />

        <label>Новый пароль</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} className="profile-input" />

        <label>Подтвердите пароль</label>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="profile-input" />

        <button onClick={handleSave} className="profile-button">Сохранить</button>

        <button onClick={handleDeleteAccount} className="delete-button">
          Удалить аккаунт
        </button>


        {message && <p className="profile-message">{message}</p>}
      </div>
    </div>
  );
};

export default Profile;
