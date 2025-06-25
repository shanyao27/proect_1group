import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './LoginPage.css';
import { authenticateUser } from '../../data/Users';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmailDomain = (email) => {
        return email.endsWith('@dvfu.ru');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateEmailDomain(email)) {
            setError('Доступ разрешен только для почт @dvfu.ru');
            return;
        }

        setIsLoading(true);

        try {
            const user = authenticateUser(email, password);
            if (user) {
                console.log('Вход выполнен:', user);
                navigate('/menu', {
                    state: {
                        userData: {
                            email: user.email,
                            name: user.name,
                            id: user.id,
                            role: user.role
                        }
                    }
                });
            } else {
                setError('Неверный email или пароль');
            }
        } catch (err) {
            setError('Произошла ошибка при входе');
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
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Введите ваш email @dvfu.ru"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Введите ваш пароль"
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className="additional-links">
                    <Link to="/forgot-password">Забыли пароль?</Link>
                    <Link to="/register">Регистрация</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;