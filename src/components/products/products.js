import React, { useEffect, useState, useRef } from 'react';
import './products.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFilter, FaChevronDown, FaChevronUp, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { CSSTransition } from 'react-transition-group';

const Products = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.userData;
    const filtersRef = useRef(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = () => {
            const savedProducts = localStorage.getItem('productsData');
            const initialProducts = savedProducts ? JSON.parse(savedProducts) : [];
            setProducts(initialProducts);
        };

        loadProducts();

        const handleStorageChange = (e) => {
            if (e.key === 'productsData') {
                loadProducts();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const getProductImage = (product) => {
        if (product.img) {
            return product.img; 
        }

        return 'https://via.placeholder.com/300'; 
    };

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`, { state: { userData: user } });
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        sortBy: 'default',
        sortDirection: 'asc',
        category: 'all',
        minPrice: 0,
        maxPrice: Math.max(...products.map(p => p.price), 100000)
    });

    const [appliedFilters, setAppliedFilters] = useState({ ...filters });
    const productsPerPage = 6;

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = appliedFilters.category === 'all' || product.category === appliedFilters.category;
            const matchesPrice = product.price >= appliedFilters.minPrice &&
                product.price <= appliedFilters.maxPrice;

            return matchesSearch && matchesCategory && matchesPrice;
        })
        .sort((a, b) => {
            let compareResult = 0;

            switch (appliedFilters.sortBy) {
                case 'price':
                    compareResult = a.price - b.price;
                    break;
                case 'name':
                    compareResult = a.name.localeCompare(b.name);
                    break;
                default:
                    return 0;
            }

            return appliedFilters.sortDirection === 'asc' ? compareResult : -compareResult;
        });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const smoothScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        smoothScrollToTop();
    };

    const applyFilters = () => {
        setAppliedFilters(filters);
        setCurrentPage(1);
        setShowFilters(false);
        smoothScrollToTop();
    };

    const resetFilters = () => {
        const defaultFilters = {
            sortBy: 'default',
            sortDirection: 'asc',
            category: 'all',
            minPrice: 0,
            maxPrice: Math.max(...products.map(p => p.price), 100000)
        };
        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        setCurrentPage(1);
        setShowFilters(false);
        smoothScrollToTop();
    };

    const toggleSortDirection = () => {
        setFilters(prev => ({
            ...prev,
            sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
        }));
    };

    const categories = [...new Set(products.map(p => p.category))];

    return (
        <div className="products-page">
            <nav className="products-nav">
                <div className="nav-buttons">
                    <button className="nav-button" onClick={() => navigate('/menu', { state: { userData: user } })}>
                        Назад
                    </button>
                    <button
                        className="nav-button"
                        onClick={() => navigate('/profile', { state: { userData: user } })}
                    >
                        Профиль
                    </button>
                </div>
                <h1 className="products-title">GoslingShop</h1>
                <div className="nav-placeholder"></div>
            </nav>

            <div className="search-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Поиск товаров..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="toggle-filters"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter />
                        {showFilters ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>

                <CSSTransition
                    in={showFilters}
                    nodeRef={filtersRef}
                    timeout={300}
                    classNames="filters-transition"
                    unmountOnExit
                >
                    <div className="filters-panel" ref={filtersRef}>
                        <div className="sort-container">
                            <div className="filter-group">
                                <label>Сортировка:</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                >
                                    <option value="default">По умолчанию</option>
                                    <option value="price">Цена</option>
                                    <option value="name">Название</option>
                                </select>
                            </div>

                            {filters.sortBy !== 'default' && (
                                <div className="sort-direction-buttons">
                                    <button
                                        className={`sort-btn ${filters.sortDirection === 'asc' ? 'active' : ''}`}
                                        onClick={toggleSortDirection}
                                        aria-label={filters.sortDirection === 'asc' ? 'По возрастанию' : 'По убыванию'}
                                    >
                                        <FaArrowUp />
                                    </button>
                                    <button
                                        className={`sort-btn ${filters.sortDirection === 'desc' ? 'active' : ''}`}
                                        onClick={toggleSortDirection}
                                        aria-label={filters.sortDirection === 'desc' ? 'По убыванию' : 'По возрастанию'}
                                    >
                                        <FaArrowDown />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="filter-group">
                            <label>Категория:</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            >
                                <option value="all">Все категории</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Цена: от {filters.minPrice} до {filters.maxPrice}</label>
                            <div className="price-range">
                                <input
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) || 0 })}
                                    min="0"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) || 0 })}
                                    min={filters.minPrice}
                                />
                            </div>
                        </div>

                        <div className="filter-actions">
                            <button className="apply-btn" onClick={applyFilters}>
                                Применить
                            </button>
                            <button className="reset-btn" onClick={resetFilters}>
                                Сбросить
                            </button>
                        </div>
                    </div>
                </CSSTransition>
            </div>

            <div className="products-gallery">
                {currentProducts.length > 0 ? (
                    currentProducts.map(product => (
                        <div
                            key={product.id}
                            className="product-card"
                            onClick={() => handleProductClick(product.id)}
                        >
                            <img
                                src={getProductImage(product)}
                                alt={product.name}
                                className="product-image"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300';
                                }}
                            />
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="product-meta">
                                    <span className="product-category">{product.category}</span>
                                    <span className="product-seller">
                                        Продавец: {product.name_seller || 'Не указан'}
                                    </span>
                                </div>
                                <p className="product-price">₽{product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-products">
                        <h3>Товары не найдены</h3>
                        <p>Попробуйте изменить параметры поиска</p>
                    </div>
                )}
            </div>

            {filteredProducts.length > productsPerPage && (
                <div className="search-pagination-container">
                    <div className="pagination">
                        <button
                            className="pagination-button"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            В начало
                        </button>
                        <button
                            className="pagination-button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ← Назад
                        </button>
                        <span className="current-page">
                            Страница {currentPage} из {totalPages}
                        </span>
                        <button
                            className="pagination-button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Вперёд →
                        </button>
                        <button
                            className="pagination-button"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            В конец
                        </button>
                    </div>
                </div>
            )}

            <footer className="products-footer">
                <p>© 2025 GoslingShop. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default Products;