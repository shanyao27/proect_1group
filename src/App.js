import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from "./components/login/LoginPage.js"
import Register from './components/login/register';
import Admin from './components/admin/Admin';
import Menu from './components/menu/Menu';
import Products from './components/products/products.js';
import Profile from './components/profile/Profile.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  return LoginPage();
}

export default App;