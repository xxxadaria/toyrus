// айдишки игрущек
let cart = [];
let products = [
    { id: 1, name: 'Technic Monster Truck', price: 2499, img: 'https://ir.ozone.ru/s3/multimedia-1/6554350357.jpg', cat: 'Конструкторы' },
    { id: 2, name: 'Barbie Dreamhouse', price: 8999, img: 'https://ir.ozone.ru/s3/multimedia-1-9/c1000/7144018353.jpg', cat: 'Куклы' },
    { id: 3, name: 'Hot Wheels Mega Track', price: 1599, img: 'https://m.media-amazon.com/images/I/8161ILHsPfL.jpg', cat: 'Машинки' },
    { id: 4, name: 'Monopoly Classic', price: 2199, img: 'https://main-cdn.sbermegamarket.ru/big1/hlr-system/-49/479/320/726/143/4/100023249276b0.jpg', cat: 'Настольные' },
    { id: 5, name: 'Play-Doh Super Set', price: 1299, img: 'https://igralandia.ru/pictures/good_id7858/pic_name54683f258f514657b27f9a063ba6bb1e.jpg', cat: 'Творчество' },
    { id: 6, name: 'Nerf Elite Blaster', price: 3499, img: 'https://tsx.x5static.net/i/800x800-fit/xdelivery/files/29/f8/c4c4c60a9de9203326481555a60f.jpg', cat: 'Игрушки' },
    { id: 7, name: 'Fisher-Price Laugh', price: 1899, img: 'https://m.media-amazon.com/images/I/71RTpfKyzPL._AC_UF894,1000_QL80_.jpg', cat: 'Малыши' }
];
// хагрузка
document.addEventListener('DOMContentLoaded', function() {
    // Загрузить корзину
    loadCart();
    
    // Обновить счетчики на всех страницах
    updateAllCartCounters();
    
    // Инициализировать текущую страницу
    initCurrentPage();
    
    // Навигация
    initNavigation();
    
    // Анимации
    initAnimations();
});

//корзина
function loadCart() {
    const saved = localStorage.getItem('toysrus_cart');
    cart = saved ? JSON.parse(saved) : [];
}

function saveCart() {
    localStorage.setItem('toysrus_cart', JSON.stringify(cart));
}

function getCartTotalItems() {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

function getCartTotalPrice() {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
}

function updateAllCartCounters() {
    document.querySelectorAll('#cartCount, #cartBadge').forEach(counter => {
        counter.textContent = getCartTotalItems();
    });
}

// добавление товараов
window.addToCart = function(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    const cartItem = cart.find(item => item.id == productId);
    
    if (cartItem) {
        cartItem.quantity = (cartItem.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateAllCartCounters();
    
    //анимка добавлено
    const btn = event?.target;
    if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '✅ Добавлено!';
        btn.classList.add('added');
        setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.remove('added');
        }, 2000);
    }
};

// корзина с карт хтмл
window.updateCartUI = function() {
    const emptyCart = document.getElementById('emptyCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartSubtitle = document.getElementById('cartSubtitle');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.style.display = 'none';
        cartTotal.style.display = 'none';
        cartSubtitle.textContent = 'Корзина пуста';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    cartTotal.style.display = 'block';
    cartSubtitle.textContent = `Выбрано товаров: ${getCartTotalItems()}`;
    
    // рендерка товаров
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="price">${(item.price * (item.quantity || 1)).toLocaleString()} ₽</p>
                <div class="quantity-controls">
                    <button class="btn btn-secondary qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
                    <span class="qty">${item.quantity || 1}</span>
                    <button class="btn btn-secondary qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-actions">
                <button class="btn btn-primary" onclick="removeFromCart(${index})">🗑️ Удалить</button>
            </div>
        </div>
    `).join('');
    
    // обновить итог
    document.getElementById('totalPrice').textContent = getCartTotalPrice().toLocaleString();
};

window.updateQuantity = function(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartUI();
        updateAllCartCounters();
    }
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    updateAllCartCounters();
};

window.checkout = function() {
    const user = JSON.parse(localStorage.getItem('toysrus_user') || '{}');
    const total = getCartTotalPrice();
    
    if (!user.name || !user.address) {
        alert('⚠️ Заполните профиль в Настройках для оформления заказа!');
        return;
    }
    
    // оплата
    const btn = event.target;
    btn.innerHTML = '⏳ Обрабатываем...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert(` ВАШ ЗАКАЗ ОПЛАЧЕН УСПЕШНО!\n\n💰 Сумма: ${total.toLocaleString()} ₽\n📦 
        Адрес: ${user.address}\n👤 Покупатель: ${user.name}\n📧 ${user.email}\n\nСпасибо 
        за покупку! 🎉\n\nТовары скоро будут отправлены`);
        
        cart = [];
        saveCart();
        updateCartUI();
        updateAllCartCounters();
        
        btn.innerHTML = '✅ заказ оформлен!';
        btn.style.background = '#27AE60';
        setTimeout(() => {
            btn.innerHTML = '✅ Оформить и оплатить заказ';
            btn.disabled = false;
            btn.style.background = '';
        }, 3000);
    }, 2000);
};

// настройки
function initSettings() {
    const saved = JSON.parse(localStorage.getItem('toysrus_user') || '{}');
    const fields = ['userName', 'userEmail', 'userPhone', 'deliveryAddress'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = saved[id] || '';
    });
    
    const checkboxes = ['newsletter', 'notifications'];
    checkboxes.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = saved[id] !== false;
    });
}

window.saveSettings = function() {
    const user = {
        name: document.getElementById('userName')?.value || '',
        email: document.getElementById('userEmail')?.value || '',
        phone: document.getElementById('userPhone')?.value || '',
        address: document.getElementById('deliveryAddress')?.value || '',
        newsletter: document.getElementById('newsletter')?.checked || false,
        notifications: document.getElementById('notifications')?.checked || false
    };
    
    localStorage.setItem('toysrus_user', JSON.stringify(user));
    alert('✅ Профиль сохранён! Теперь можно оформлять заказы 🛒');
};

window.resetSettings = function() {
    if (confirm('Сбросить все настройки?')) {
        localStorage.removeItem('toysrus_user');
        location.reload();
    }
};

// каталог
let visibleProducts = 8;
let allProducts = [...products];

window.renderProducts = function(productsList = products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = productsList.slice(0, visibleProducts).map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <h3>${p.name}</h3>
            <div class="price">${p.price.toLocaleString()} ₽</div>
            <button class="add-cart" onclick="addToCart(${p.id})">🛒 В корзину</button>
        </div>
    `).join('');
};

window.filterProducts = function() {
    const category = document.getElementById('categoryFilter')?.value || '';
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    allProducts = products.filter(p => 
        (!category || p.cat.includes(category)) && 
        p.name.toLowerCase().includes(search)
    );
    
    visibleProducts = 8;
    renderProducts(allProducts);
};

window.loadMoreProducts = function() {
    visibleProducts += 4;
    renderProducts(allProducts);
};

// навигация и
function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function initCurrentPage() {
    // Корзина
    if (document.getElementById('cartItems')) {
        updateCartUI();
    }
    
    // Настройки
    if (document.querySelector('.settings-grid')) {
        initSettings();
    }
    
    // Каталог
    if (document.getElementById('productsGrid')) {
        renderProducts();
        document.getElementById('categoryFilter')?.addEventListener('change', filterProducts);
        document.getElementById('searchInput')?.addEventListener('input', filterProducts);
    }
    
    // Контакты
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('✅ Сообщение отправлено!');
            form.reset();
        });
    }
}

function initAnimations() {
    document.querySelectorAll('.card, .product-card, .setting-card, .cart-item').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        setTimeout(() => {
            el.style.transition = 'all 0.7s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, i * 120);
    });
}