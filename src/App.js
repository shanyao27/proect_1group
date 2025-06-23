import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./components/login/LoginPage.js";
import Register from './components/login/register';
import Menu from './components/menu/Menu';
import Products from './components/products/products.js';
import Profile from './components/profile/Profile.js';
import ProductDetails from './components/products/ProductDetails.js';
import NotFound from './components/NotFound';

import ForgotPassword from './components/login/forgot-password'
import AdminAuth from './components/admin/AdminAuth'; //авторизация
import AllUser_Admin from './components/admin/AdminAllUser'; //все пользователи
import AllProduct_Admin from './components/admin/AdminAllProducts'
import AdminMenu from './components/admin/AdminVariants';
function App() {
    return (
        <Router>
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminAuth />} />
                <Route path="/admin/all_prod" element={<AllProduct_Admin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* Защищенный маршрут */}
                <Route
                    path="/admin-panel"
                    element={
                        
                        <AllUser_Admin />
                      
                    }
                />

                
                 <Route path="*" element={<NotFound />} /> 
            </Routes>
        </Router>
    );
}

export default App;