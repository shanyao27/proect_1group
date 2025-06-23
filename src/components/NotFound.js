import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css'; // Создайте соответствующий CSS-файл

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Страница не найдена</h2>

                <p className="not-found-text">
                    Запрашиваемая страница не существует или была перемещена.
                </p>

                <div className="not-found-actions">
                    <button
                        onClick={() => navigate(-1)}
                        className="not-found-button"
                    >
                        ← Назад
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="not-found-button primary"
                    >
                        На главную
                    </button>
                </div>

                <div className="not-found-image">
                    {/* Можно добавить SVG или изображение */}
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4A5568" strokeWidth="2" />
                        <path d="M15 9L9 15" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
                        <path d="M9 9L15 15" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default NotFound;