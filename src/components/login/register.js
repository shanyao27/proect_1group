import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../data/Users';
import './register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmailDomain = (email) => {
        return email.endsWith('@dvfu.ru');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmailDomain(formData.email)) {
            setError('Только почта @dvfu.ru разрешена для регистрации');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setIsLoading(true);

        try {
            const { success, message, user } = registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setError(message);
            }
        } catch (err) {
            setError('Ошибка при регистрации');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="register-container">
                <div className="register-box">
                    <h1 className="logo">GoslingShop</h1>
                    <div className="success-message">
                        Регистрация успешна! Перенаправляем на страницу входа...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="register-container">
            <div className="register-box">
                <div className="logo">
                    <h1>GoslingShop</h1>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Имя</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Введите ваше имя"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Введите ваш email @dvfu.ru"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                            placeholder="Придумайте пароль"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Подтвердите пароль</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Повторите пароль"
                        />
                    </div>

                    <button type="submit" className="register-button" disabled={isLoading}>
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <div className="additional-links">
                    Уже есть аккаунт? <Link to="/">Войти</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;