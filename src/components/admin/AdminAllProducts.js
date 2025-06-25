import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const AdminAllProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('all');
    const [editingProductId, setEditingProductId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        price: '',
        category: 'Бытовая техника',
        img: '',
        name_seller: '',
        description: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const categories = ['Бытовая техника', 'Еда', 'Лекарства', 'Услуги'];

    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem('adminAuth'));
        if (!authData || authData.role !== 'superadmin') {
            navigate('/admin');
            return;
        }

        const storedProducts = JSON.parse(localStorage.getItem('productsData')) || [];
        setProducts(storedProducts);

        const storedSellers = JSON.parse(localStorage.getItem('sellersData')) || [];
        setSellers(storedSellers);
    }, [navigate]);

    const saveProducts = (productsToSave) => {
        localStorage.setItem('productsData', JSON.stringify(productsToSave));
        setProducts(productsToSave);
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedProducts = () => {
        if (!sortConfig.key) return products;

        return [...products].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setEditFormData(prev => ({
                    ...prev,
                    img: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const searchProducts = (products, term, field) => {
        if (!term) return products;

        return products.filter(product => {
            if (field === 'all') {
                return (
                    product.id.toString().includes(term) ||
                    product.name.toLowerCase().includes(term.toLowerCase()) ||
                    product.price.toString().includes(term) ||
                    product.category.toLowerCase().includes(term.toLowerCase()) ||
                    product.name_seller.toLowerCase().includes(term.toLowerCase()) ||
                    (product.description && product.description.toLowerCase().includes(term.toLowerCase()))
                );
            } else {
                const value = product[field];
                return value && value.toString().toLowerCase().includes(term.toLowerCase());
            }
        });
    };

    const handleEditClick = (product) => {
        setEditingProductId(product.id);
        setEditFormData({
            name: product.name,
            price: product.price.toString(),
            category: product.category,
            img: product.img,
            name_seller: product.name_seller,
            description: product.description || ''
        });
        setImagePreview(product.img);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleSaveClick = () => {
        const price = parseFloat(editFormData.price);
        if (!editFormData.name || !editFormData.price || !editFormData.category) {
            alert('Заполните обязательные поля: Название, Цена и Категория');
            return;
        }
        if (isNaN(price)) {
            alert('Цена должна быть числом');
            return;
        }
        if (price <= 0) {
            alert('Цена должна быть больше 0');
            return;
        }

        const updatedProduct = {
            id: editingProductId,
            name: editFormData.name,
            price: price,
            category: editFormData.category,
            img: editFormData.img,
            name_seller: editFormData.name_seller,
            description: editFormData.description
        };

        const productExists = products.some(p => p.id === editingProductId);

        let updatedProducts;
        if (productExists) {
            updatedProducts = products.map(p =>
                p.id === editingProductId ? updatedProduct : p
            );
        } else {
            updatedProducts = [...products, updatedProduct];
        }

        saveProducts(updatedProducts);
        setEditingProductId(null);
        alert(productExists ? 'Товар обновлен!' : 'Товар добавлен!');
    };

    const handleCancelEdit = () => {
        const productExists = products.some(p => p.id === editingProductId);
        if (!productExists) {
            setProducts(products.filter(p => p.id !== editingProductId));
        }
        setEditingProductId(null);
    };

    const handleAddNew = () => {
        const newProduct = {
            id: Date.now(),
            name: '',
            price: '',
            category: 'Бытовая техника',
            img: '',
            name_seller: '',
            description: ''
        };

        setProducts([...products, newProduct]);
        setEditingProductId(newProduct.id);
        setEditFormData({
            name: '',
            price: '',
            category: 'Бытовая техника',
            img: '',
            name_seller: '',
            description: ''
        });
        setImagePreview(null);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Удалить этот товар?')) return;

        const updatedProducts = products.filter(p => p.id !== id);
        saveProducts(updatedProducts);
        alert('Товар удален');
    };

    const sortedProducts = getSortedProducts();
    const filteredProducts = searchProducts(sortedProducts, searchTerm, searchField);

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-title">Управление товарами</h1>
                <div className="admin-actions">
                    <button className="action-button users-button" onClick={() => navigate('/admin-panel')}>
                        Пользователи
                    </button>
                    <button className="action-button sellers-button" onClick={() => navigate('/admin-sellers')}>
                        Продавцы
                    </button>
                    <button className="action-button add-button" onClick={handleAddNew}>
                        Добавить товар
                    </button>
                    <button className="logout-button" onClick={() => {
                        localStorage.removeItem('adminAuth');
                        navigate('/admin');
                    }}>
                        Выйти
                    </button>
                </div>
            </div>

            <div className="admin-content">
                <div className="search-bar">
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="search-select"
                    >
                        <option value="all">Все поля</option>
                        <option value="id">ID</option>
                        <option value="name">Название</option>
                        <option value="price">Цена</option>
                        <option value="category">Категория</option>
                        <option value="name_seller">Продавец</option>
                        <option value="description">Описание</option>
                    </select>
                    <input
                        type="text"
                        placeholder={`Поиск по ${searchField === 'all' ? 'всем полям' : searchField}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <table className="users-table">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('id')}>
                                ID {sortConfig.key === 'id' && (
                                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th onClick={() => requestSort('name')}>
                                Название {sortConfig.key === 'name' && (
                                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th onClick={() => requestSort('price')}>
                                Цена {sortConfig.key === 'price' && (
                                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th onClick={() => requestSort('category')}>
                                Категория {sortConfig.key === 'category' && (
                                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th>Изображение</th>
                            <th onClick={() => requestSort('name_seller')}>
                                Продавец {sortConfig.key === 'name_seller' && (
                                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th onClick={() => requestSort('description')}>
                                Описание {sortConfig.key === 'description' && (
                                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>
                                    {editingProductId === product.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleEditFormChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        product.name
                                    )}
                                </td>
                                <td>
                                    {editingProductId === product.id ? (
                                        <input
                                            type="number"
                                            name="price"
                                            value={editFormData.price}
                                            onChange={handleEditFormChange}
                                            step="0.01"
                                            min="0.01"
                                            className="edit-input"
                                        />
                                    ) : (
                                        product.price + ' ₽'
                                    )}
                                </td>
                                <td>
                                    {editingProductId === product.id ? (
                                        <select
                                            name="category"
                                            value={editFormData.category}
                                            onChange={handleEditFormChange}
                                            className="edit-select"
                                        >
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        product.category
                                    )}
                                </td>
                                <td>
                                    {editingProductId === product.id ? (
                                        <div className="image-edit-container">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            {imagePreview && (
                                                <img
                                                    src={imagePreview}
                                                    alt="Предпросмотр"
                                                    className="product-image-preview"
                                                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        product.img && (
                                            <img
                                                src={product.img}
                                                alt={product.name}
                                                className="product-image"
                                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                                            />
                                        )
                                    )}
                                </td>
                                <td>
                                    {editingProductId === product.id ? (
                                        <select
                                            name="name_seller"
                                            value={editFormData.name_seller}
                                            onChange={handleEditFormChange}
                                            className="edit-select"
                                        >
                                            <option value="">Выберите продавца</option>
                                            {sellers.map(seller => (
                                                <option key={seller.id} value={seller.name}>
                                                    {seller.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        product.name_seller
                                    )}
                                </td>
                                <td>
                                    {editingProductId === product.id ? (
                                        <textarea
                                            name="description"
                                            value={editFormData.description}
                                            onChange={handleEditFormChange}
                                            className="description-textarea"
                                            rows="3"
                                        />
                                    ) : (
                                        product.description || '—'
                                    )}
                                </td>
                                <td>
                                    {editingProductId === product.id ? (
                                        <>
                                            <button
                                                className="action-button save-button"
                                                onClick={handleSaveClick}
                                            >
                                                Сохранить
                                            </button>
                                            <button
                                                className="action-button cancel-button"
                                                onClick={handleCancelEdit}
                                            >
                                                Отмена
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="action-button edit-button"
                                                onClick={() => handleEditClick(product)}
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                className="action-button delete-button"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                Удалить
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAllProducts;