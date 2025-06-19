import React from 'react';
import { useNavigate } from 'react-router-dom';
import './products.css';


import skin1 from './photos/Desert Eagle Blaze.png';
import skin2 from './photos/AWP Dragon Lore.png';
import skin3 from './photos/kill_confirmed.png';
import skin4 from './photos/Karambit Doppler (Ruby).png';
import skin5 from './photos/Butterfly Knife Fade.jpg';
import skin6 from './photos/M9 Bayonet Crimson Web.jpg';
import skin7 from './photos/AK-47 Fire Serpent.png';
import skin8 from './photos/M4A4 Howl.png';
import skin9 from './photos/AWP Medusa.jpg';
import skin10 from './photos/MP9 Stained Glass.png';
import skin11 from './photos/P90 Death by Kitty.jpg';
import skin12 from './photos/Glock-18 Fade.jpg';
import skin13 from './photos/AWP Gungnir.png';
import skin14 from './photos/M4A1-S Printstream.jpg';
import skin15 from './photos/Skeleton Knife Case Hardened.png';


const Products = () => {
    const navigate = useNavigate();
    const products = [
        {
            id: 1,
            name: 'Desert Eagle | Blaze',
            price: 350,
            image: skin1
        },
        {
            id: 2,
            name: 'AWP | Dragon Lore',
            price: 12000,
            image: skin2
        },
        {
            id: 3,
            name: 'USP-S | Kill Confirmed',
            price: 200,
            image: skin3
        },
        {
            id: 4,
            name: 'Karambit | Doppler (Ruby)',
            price: 5000,
            image: skin4
        },
        {
            id: 5,
            name: 'Butterfly Knife | Fade',
            price: 1500,
            image: skin5
        },
        {
            id: 6,
            name: 'M9 Bayonet | Crimson Web',
            price: 1200,
            image: skin6
        },
        {
            id: 7,
            name: 'AK-47 | Fire Serpent',
            price: 1500,
            image: skin7
        },
        {
            id: 8,
            name: 'M4A4 | Howl',
            price: 3500,
            image: skin8
        },
        {
            id: 9,
            name: 'AWP | Medusa',
            price: 2000,
            image: skin9
        },
        {
            id: 10,
            name: 'MP9 | Stained Glass',
            price: 100,
            image: skin10
        },
        {
            id: 11,
            name: 'P90 | Death by Kitty',
            price: 200,
            image: skin11
        },
        {
            id: 12,
            name: 'Glock-18 | Fade',
            price: 150,
            image: skin12
        },
        {
            id: 13,
            name: 'AWP | Gungnir',
            price: 6000,
            image: skin13
        },
        {
            id: 14,
            name: 'M4A1-S | Printstream',
            price: 400,
            image: skin14
        },
        {
            id: 15,
            name: 'Skeleton Knife | Marble Fade',
            price: 1100,
            image: skin15
        }
    ];

return (
        <div className="products-page">
            <nav className="products-nav">
                <div className="nav-left">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        Назад
                    </button>
                    <button className="back-button" onClick={() => navigate('/profile')}>
                        Профиль
                    </button>
                </div>
                <h1 className="products-title">Товары</h1>
                <div className="nav-placeholder"></div>
            </nav>

            <div className="products-gallery">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-price">${product.price}</p>
                        <button className="add-to-cart">Посмотреть</button>
                    </div>
                ))}
            </div>

            <footer className="products-footer">
                <p>© 2024 GoslingShop. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default Products;