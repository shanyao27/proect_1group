import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem('adminAuth'));

        // ��������� ��� �������:
        // 1. ���� �� ������ �����������
        // 2. �� ����� �� ����� (���� ���� expiresAt)
        // 3. ������������� �� ����
        const isUnauthorized = (
            !authData ||
            (authData.expiresAt && authData.expiresAt < Date.now()) ||
            (requiredRole && authData.role !== requiredRole)
        );

        if (isUnauthorized) {
            localStorage.removeItem('adminAuth');
            navigate('/admin/login', {
                state: { from: location.pathname },
                replace: true
            });
        }
    }, [navigate, location, requiredRole]);

    return children;
};

export default ProtectedRoute;