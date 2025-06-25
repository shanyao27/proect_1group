import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const AdminAllSellers = () => {
    const navigate = useNavigate();
    const [sellers, setSellers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingSellerId, setEditingSellerId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        rating: '5.0'
    });

    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem('adminAuth'));
        if (!authData || authData.role !== 'superadmin') {
            navigate('/admin');
            return;
        }

        const storedSellers = JSON.parse(localStorage.getItem('sellersData')) || [];
        setSellers(storedSellers);
    }, [navigate]);

    const saveSellers = (sellersToSave) => {
        localStorage.setItem('sellersData', JSON.stringify(sellersToSave));
        setSellers(sellersToSave);
    };

    const handleEditClick = (seller) => {
        setEditingSellerId(seller.id);
        setEditFormData({
            name: seller.name,
            email: seller.email,
            rating: seller.rating.toString()
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'rating') {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) return; 
            
            if (numValue < 1.0) {
                setEditFormData({
                    ...editFormData,
                    rating: '1.0'
                });
                return;
            }
            if (numValue > 5.0) {
                setEditFormData({
                    ...editFormData,
                    rating: '5.0'
                });
                return;
            }
        }
        
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleSaveClick = () => {
        const updatedSeller = {
            id: editingSellerId,
            name: editFormData.name,
            email: editFormData.email,
            rating: parseFloat(editFormData.rating)
        };

        const updatedSellers = sellers.map(s => 
            s.id === editingSellerId ? updatedSeller : s
        );

        saveSellers(updatedSellers);
        setEditingSellerId(null);
    };

    const handleAddNew = () => {
        const newSeller = {
            id: Date.now(),
            name: '',
            email: '',
            rating: 5.0
        };

        setSellers([...sellers, newSeller]);
        setEditingSellerId(newSeller.id);
        setEditFormData({
            name: '',
            email: '',
            rating: '5.0'
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm('Удалить этого продавца?')) return;
        const updatedSellers = sellers.filter(s => s.id !== id);
        saveSellers(updatedSellers);
    };

    const filteredSellers = sellers.filter(seller =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-title">Управление продавцами</h1>
                <div className="admin-actions">
                    <button className="action-button users-button" onClick={() => navigate('/admin-panel')}>
                        Пользователи
                    </button>
                    <button className="action-button products-button" onClick={() => navigate('/admin/all_prod')}>
                        Товары
                    </button>
                    <button className="action-button add-button" onClick={handleAddNew}>
                        Добавить продавца
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
                    <input
                        type="text"
                        placeholder="Поиск продавцов..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Рейтинг</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSellers.map(seller => (
                            <tr key={seller.id}>
                                <td>{seller.id}</td>
                                <td>
                                    {editingSellerId === seller.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleEditFormChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        seller.name
                                    )}
                                </td>
                                <td>
                                    {editingSellerId === seller.id ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editFormData.email}
                                            onChange={handleEditFormChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        seller.email
                                    )}
                                </td>
                                <td>
                                    {editingSellerId === seller.id ? (
                                        <input
                                            type="number"
                                            name="rating"
                                            value={editFormData.rating}
                                            onChange={handleEditFormChange}
                                            min="1.0"
                                            max="5.0"
                                            step="0.1"
                                            className="edit-input"
                                        />
                                    ) : (
                                        seller.rating.toFixed(1)
                                    )}
                                </td>
                                <td>
                                    {editingSellerId === seller.id ? (
                                        <>
                                            <button className="action-button save-button" onClick={handleSaveClick}>
                                                Сохранить
                                            </button>
                                            <button className="action-button cancel-button" onClick={() => setEditingSellerId(null)}>
                                                Отмена
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="action-button edit-button" onClick={() => handleEditClick(seller)}>
                                                Редактировать
                                            </button>
                                            <button className="action-button delete-button" onClick={() => handleDelete(seller.id)}>
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

export default AdminAllSellers;