import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
//import './productDetails.css'; // Создайте соответствующий CSS файл

const ProductDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const user = location.state?.userData;
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProduct = () => {
            try {
                console.log(12345);
                const savedProducts = localStorage.getItem('productsData');
                if (!savedProducts) throw new Error('No products data');

                const products = JSON.parse(savedProducts);
                if (!Array.isArray(products)) throw new Error('Invalid products data');

                const foundProduct = products.find(p => p.id.toString() === id);
                if (!foundProduct) throw new Error('Product not found');

                setProduct(foundProduct);
            } catch (error) {
                console.error('Error loading product:', error);
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const getProductImage = (product) => {
        if (product?.img) {
            return product.img;
        }
        return 'https://via.placeholder.com/600'; // Большое изображение для детальной страницы
    };

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (!product) {
        return (
            <div className="product-not-found">
                <h2>Товар не найден</h2>
                <button onClick={() => navigate('/products', { state: { userData: user } })}>
                    Вернуться к списку товаров
                </button>
            </div>
        );
    }

    return (
        <div className="product-details-page">
            <nav className="details-nav">
                <div className="nav-buttons">
                    <button className="nav-button" onClick={() => navigate(-1, { state: { userData: user } })}>
                        Назад
                    </button>
                    <button
                        className="nav-button"
                        onClick={() => navigate('/profile', { state: { userData: user } })}
                    >
                        Профиль
                    </button>
                </div>
                <h1 className="details-title">GoslingShop</h1>
                <div className="nav-placeholder"></div>
            </nav>

            <div className="product-details-container">
                <div className="product-images">
                    <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="main-product-image"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/600';
                        }}
                    />
                </div>

                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-price">₽{product.price.toFixed(2)}</p>
                    <p className="product-category">Категория: {product.category}</p>

                    <div className="product-seller">
                        <h3>Информация о продавце:</h3>
                        <p>Имя: {product.name_seller || 'Не указано'}</p>
                        <p>Контакт: {product.contact_seller || 'Не указан'}</p>
                    </div>

                    <div className="product-description">
                        <h3>Описание:</h3>
                        <p>{product.description || 'Описание отсутствует.'}</p>
                    </div>

                    <button className="back-button" onClick={() => navigate('/products', { state: { userData: user } })}>
                        Вернуться к списку товаров
                    </button>
                </div>
            </div>

            <footer className="details-footer">
                <p>© 2025 GoslingShop. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default ProductDetails;