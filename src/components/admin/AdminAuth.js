import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import credentials from '../../admin-credentials.json';
import './AdminAuth.css';

const AdminAuth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();

        const user = credentials.users.find(u =>
            u.username === username &&
            u.password === password
        );

        if (user) {
            const authData = {
                username: user.username,
                role: user.role,
                expiresAt: Date.now() + 3600000 
            };
            
            localStorage.setItem('adminAuth', JSON.stringify(authData));
            navigate('/admin-panel', { replace: true });
        } else {
            setError('Неверные учетные данные');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleLogin} className="auth-form">
                <h2>Панель администратора</h2>
                {error && <div className="auth-error">{error}</div>}

                <div className="form-group">
                    <label>Логин:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                        className="auth-input"
                    />
                </div>

                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="auth-input"
                    />
                </div>

                <button
                    type="submit"
                    className="auth-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>
            </form>
        </div>
    );
};

export default AdminAuth;