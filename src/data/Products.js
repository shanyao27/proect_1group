// data/Products.js
const STORAGE_KEY = 'appProducts';

const initialProducts = [
    {
        id: 1,
        name: '���������� DeLonghi Magnifica',
        price: 35000,
        category: "������� �������",
        img: "",
        name_seller: "barash_smesharik"
    },
    {
        id: 2,
        name: '����������� Samsung Side by Side',
        price: 120000,
        category: "������� �������",
        img: "",
        name_seller: "krosh_smesharik"
    }
];


if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
}

export const getAllProducts = () => {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return products.map(p => ({
        ...p,
        price: Number(p.price) || 0 
    }));
};


const getFreshProducts = () => {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return products || initialProducts;
};

if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
}



export const searchProducts = (term) => {
    const products = getFreshProducts();
    if (!term) return products;

    return products.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(term.toLowerCase())) ||
        (product.name_seller && product.name_seller.toLowerCase().includes(term.toLowerCase())) ||
        (product.price && product.price.toString().includes(term))
    );
};

export const addProduct = (productData) => {
    const products = getAllProducts();
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...productData,
        price: Number(productData.price) || 0,
        category: productData.category || "��� ���������"
    };

    const updatedProducts = [...products, newProduct];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    return newProduct;
};


export const updateProduct = (id, productData) => {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) throw new Error('����� �� ������');

    const updatedProduct = {
        ...products[index],
        ...productData,
        price: Number(productData.price) || 0,
        category: productData.category || products[index].category
    };

    const updatedProducts = [...products];
    updatedProducts[index] = updatedProduct;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    return updatedProduct;
};

export const deleteProduct = (productId) => {
    const products = getFreshProducts();
    const updatedProducts = products.filter(p => p.id !== productId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    dispatchProductsUpdate(updatedProducts);
    return true;
};

export const subscribeToProductsUpdate = (callback) => {
    const handler = (e) => {
        if (e.key === STORAGE_KEY) {
            callback(JSON.parse(e.newValue));
        }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
};

const dispatchProductsUpdate = (products) => {
    window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(products)
    }));
};

export const getProductById = (id) => {
    const products = getFreshProducts();
    return products.find(p => p.id === id);
};

export default getFreshProducts();