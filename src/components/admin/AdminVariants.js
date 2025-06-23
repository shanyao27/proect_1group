import React, { useState, useEffect } from 'react';
//import './AdminPanel.css'; // Создайте файл стилей

const AdminMenu = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Загрузка данных
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Загрузка пользователей
                const usersData = JSON.parse(localStorage.getItem('appUsers')) || [];
                setUsers(usersData);

                // Загрузка товаров (пример)
                const productsData = JSON.parse(localStorage.getItem('products')) || [];
                setProducts(productsData);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>Панель администратора</h1>
                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Все пользователи
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        Все товары
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {isLoading ? (
                    <div className="loading">Загрузка...</div>
                ) : activeTab === 'users' ? (
                    <UsersTable users={users} />
                ) : (
                    <ProductsTable products={products} />
                )}
            </div>
        </div>
    );
};

// Компонент таблицы пользователей
const UsersTable = ({ users }) => (
    <table className="data-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Email</th>
                <th>Роль</th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role || 'user'}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

// Компонент таблицы товаров
const ProductsTable = ({ products }) => (
    <table className="data-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Категория</th>
            </tr>
        </thead>
        <tbody>
            {products.map(product => (
                <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default AdminMenu;