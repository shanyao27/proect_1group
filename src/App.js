import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./components/login/LoginPage.js";
import Register from './components/login/register';
import Menu from './components/menu/Menu';
import Products from './components/products/products.js';
import Profile from './components/profile/Profile.js';
import ProductDetails from './components/products/ProductDetails.js';
import NotFound from './components/NotFound';

import ForgotPassword from './components/login/forgot-password'
import AdminAuth from './components/admin/AdminAuth'; 
import AllUser_Admin from './components/admin/AdminAllUser'; 
import AllProduct_Admin from './components/admin/AdminAllProducts'
import AdminMenu from './components/admin/AdminVariants';
import AdminAllSellers from './components/admin/AdminAllSellers';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminAuth />} />
                <Route path="/admin/all_prod" element={<AllProduct_Admin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin-sellers" element={<AdminAllSellers />} />
                <Route path="/admin-panel" element={<AllUser_Admin />}/>
                <Route path="*" element={<NotFound />} /> 
            </Routes>
        </Router>
    );
}

export default App;