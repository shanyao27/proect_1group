import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('appUsers')) || [];
        setUsers(storedUsers);
    }, []);

    const handleEditClick = (user) => {
        setEditingUserId(user.id);
        setEditFormData({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role || 'user'
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleSaveClick = () => {
        const updatedUsers = users.map(user => {
            if (user.id === editingUserId) {
                return {
                    ...user,
                    ...editFormData
                };
            }
            return user;
        });

        setUsers(updatedUsers);
        localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
        setEditingUserId(null);
    };

    const handleDelete = (userId) => {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-title">Панель администратора</h1>
            </div>

            <div className="admin-content">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Поиск пользователей..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Пароль</th>
                            <th>Роль</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleEditFormChange}
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editFormData.email}
                                            onChange={handleEditFormChange}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="text"
                                            name="password"
                                            value={editFormData.password}
                                            onChange={handleEditFormChange}
                                        />
                                    ) : (
                                        user.password
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <select
                                            name="role"
                                            value={editFormData.role}
                                            onChange={handleEditFormChange}
                                        >
                                            <option value="user">Пользователь</option>
                                            <option value="admin">Администратор</option>
                                        </select>
                                    ) : (
                                        user.role || 'user'
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <>
                                            <button
                                                className="action-button save-button"
                                                onClick={handleSaveClick}
                                            >
                                                Сохранить
                                            </button>
                                            <button
                                                className="action-button cancel-button"
                                                onClick={() => setEditingUserId(null)}
                                            >
                                                Отмена
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="action-button edit-button"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                className="action-button delete-button"
                                                onClick={() => handleDelete(user.id)}
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

export default Admin;