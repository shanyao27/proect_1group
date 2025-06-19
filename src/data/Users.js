// Users.js - имитация базы данных пользователей
let users = JSON.parse(localStorage.getItem('appUsers')) || [
    { id: 1, email: 'user1@example.com', password: 'password1', name: 'Иван Иванов', role: 'user' },
    { id: 2, email: 'user2@example.com', password: 'password2', name: 'Ииииииииванооооов ЕВгенийЕвгенич', role: 'user' },
    { id: 3, email: 'user3@example.com', password: 'password3', name: 'Виктор Василек', role:'admin' }
];

// Функция для проверки пользователя
export const authenticateUser = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
};

// Функция для получения всех пользователей (если нужно)
export const getAllUsers = () => {
    return users;
};

export const registerUser = (userData) => {
    // Проверяем, нет ли уже пользователя с таким email
    const userExists = users.some(u => u.email === userData.email);

    if (userExists) {
        return { success: false, message: 'Пользователь с таким email уже существует' };
    }

    const newUser = {
        id: users.length + 1,
        ...userData
    };

    users.push(newUser);

    localStorage.setItem('appUsers', JSON.stringify(users));
    return { success: true, user: newUser };
};

export const subscribeToUsersUpdate = (callback) => {
    const handler = (e) => {
        if (e.key === 'appUsers') {
            callback(JSON.parse(e.newValue));
        }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
};

// Обновленная функция изменения пользователей
export const updateUsers = (newUsers) => {
    localStorage.setItem('appUsers', JSON.stringify(newUsers));
    // Генерируем событие для текущей вкладки
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'appUsers',
        newValue: JSON.stringify(newUsers)
    }));
};
export default users;