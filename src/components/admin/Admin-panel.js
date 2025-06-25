import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './productDetails.css';

const ProductDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const user = location.state?.userData;
    const [product, setProduct] = useState(null);
    const [sellerContact, setSellerContact] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState('');

    useEffect(() => {
        const loadProductAndSeller = async () => {
            try {
                // Загрузка товара
                const savedProducts = localStorage.getItem('productsData');
                if (!savedProducts) throw new Error('No products data');
                const products = JSON.parse(savedProducts);
                const foundProduct = products.find(p => p.id.toString() === id);
                if (!foundProduct) throw new Error('Product not found');

                // Загрузка контактов продавца
                const savedSellers = localStorage.getItem('sellersData');
                if (savedSellers) {
                    const sellers = JSON.parse(savedSellers);
                    const seller = sellers.find(s => s.name === foundProduct.name_seller);
                    if (seller) {
                        setSellerContact(seller.email || 'Контакт не указан');
                    }
                }

                setProduct(foundProduct);
                setDescription(foundProduct.description || '');
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProductAndSeller();
    }, [id]);

    const handleSaveDescription = () => {
        if (!product || !user || user.role !== 'superadmin') return;

        const updatedProduct = {
            ...product,
            description: description
        };

        const products = JSON.parse(localStorage.getItem('productsData')) || [];
        const updatedProducts = products.map(p => 
            p.id === product.id ? updatedProduct : p
        );

        localStorage.setItem('productsData', JSON.stringify(updatedProducts));
        setProduct(updatedProduct);
        setIsEditing(false);
        alert('Описание сохранено!');
    };

    const getProductImage = (product) => {
        return product?.img || 'https://via.placeholder.com/600x400';
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

            <div className="main-content-wrapper">
                <div className="product-details-container">
                    <div className="product-images">
                        <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="main-product-image"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/600x400';
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
                            <p>Контакт: {sellerContact || 'Не указан'}</p>
                        </div>

                        <div className="product-description">
                            <h3>Описание:</h3>
                            {isEditing && user?.role === 'superadmin' ? (
                                <>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="description-textarea"
                                        rows="5"
                                    />
                                    <button 
                                        className="save-button" 
                                        onClick={handleSaveDescription}
                                    >
                                        Сохранить
                                    </button>
                                    <button 
                                        className="cancel-button" 
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Отмена
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>{description || 'Описание отсутствует.'}</p>
                                    {user?.role === 'superadmin' && (
                                        <button 
                                            className="edit-button" 
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Редактировать описание
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        <button 
                            className="back-button" 
                            onClick={() => navigate('/products', { state: { userData: user } })}
                        >
                            Вернуться к списку товаров
                        </button>
                    </div>
                </div>
            </div>

            <footer className="details-footer">
                <p>© 2025 GoslingShop. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default ProductDetails;