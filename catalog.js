const products = [
    { id: 1, name: 'Лего Technic', price: 2499, img: 'https://avatars.mds.yandex.net/get-mpic/10483373/2a0000018b6d7d6bad4516b712fe1c0c6e6b/orig', cat: 'Конструкторы' },
    { id: 2, name: 'Barbie Dreamhouse', price: 8999, img: 'https://ir.ozone.ru/s3/multimedia-1-9/c1000/7144018353.jpg', cat: 'Куклы' },
    { id: 3, name: 'Hot Wheels Track', price: 1599, img: 'https://via.placeholder.com/300x250/45B7D1/FFFFFF?text=Hot+Wheels', cat: 'Машинки' },
    { id: 4, name: 'Monopoly Classic', price: 2199, img: 'https://via.placeholder.com/300x250/96CEB4/FFFFFF?text=Monopoly', cat: 'Настольные игры' },
];

let visibleProducts = 8;
let allProducts = [...products];

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.slice(0, visibleProducts).map(p => `
        <div class="product-card" data-category="${p.cat}">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <h3>${p.name}</h3>
            <div class="price">${p.price.toLocaleString()} ₽</div>
            <button class="add-cart" onclick="addToCart(${p.id})">🛒 В корзину</button>
        </div>
    `).join('');
}

function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    allProducts = products.filter(p => 
        (!category || p.cat === category) &&
        (p.name.toLowerCase().includes(search))
    );
    
    visibleProducts = 8;
    renderProducts(allProducts);
}

function loadMoreProducts() {
    visibleProducts += 4;
    renderProducts(allProducts);
}

function addToCart(id) {
    alert(`🛒 "${products.find(p => p.id === id).name}" добавлен в корзину!`);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('sortFilter').addEventListener('change', filterProducts);
    document.getElementById('searchInput').addEventListener('input', filterProducts);
});
// В конец catalog.js добавить:
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge(); // Обновить счетчик корзины
});