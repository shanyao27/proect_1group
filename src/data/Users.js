const getFreshUsers = () => JSON.parse(localStorage.getItem('appUsers')) || [];

export const authenticateUser = (email, password) => {
    const users = getFreshUsers();
    return users.find(u => u.email === email && u.password === password) || null;
};

export const getAllUsers = () => getFreshUsers();

export const registerUser = (userData) => {
    const users = getFreshUsers();
    const userExists = users.some(u => u.email === userData.email);

    if (userExists) {
        return { success: false, message: 'Пользователь с таким email уже существует' };
    }

    const newUser = {
        id: users.length + 1,
        ...userData
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
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

export const updateUsers = (newUsers) => {
    localStorage.setItem('appUsers', JSON.stringify(newUsers));
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'appUsers',
        newValue: JSON.stringify(newUsers)
    }));
};

export default getFreshUsers();
