import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './LoginPage.css'; 


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Здесь будет логика отправки запроса на восстановление пароля
      // В демо-версии просто имитируем успешный запрос
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Инструкции по восстановлению пароля отправлены на ваш email');
    } catch (err) {
      setError('Произошла ошибка. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <h1>GoslingShop</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>Восстановление пароля</h2>
          <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
            Введите email, связанный с вашей учетной записью, и мы вышлем инструкции по восстановлению пароля.
          </p>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div style={{ color: '#2ecc71', backgroundColor: '#d5f5e3', padding: '10px 15px', borderRadius: '4px', marginBottom: '10px' }}>{success}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Введите ваш email"
            />
          </div>
          
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Отправка...' : 'Отправить инструкции'}
          </button>
        </form>
        
        <div className="additional-links" style={{ justifyContent: 'center' }}>
          <Link to="/">Вернуться к входу</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;