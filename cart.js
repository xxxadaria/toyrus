let cart = JSON.parse(localStorage.getItem('toysrus_cart') || '[]');

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const emptyCart = document.getElementById('emptyCart');
    const cartCount = document.getElementById('cartCount');
    const totalPrice = document.getElementById('totalPrice');

    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartTotal.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    cartItems.style.display = 'block';
    cartTotal.style.display = 'block';
    emptyCart.style.display = 'none';

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price.toLocaleString()} ₽</p>
            </div>
            <div style="margin-left: auto; display: flex; flex-direction: column; gap: 1rem;">
                <button class="btn btn-secondary" onclick="updateQuantity(${index}, -1)">−</button>
                <span style="font-weight: 600; font-size: 1.2rem;">${item.quantity}</span>
                <button class="btn btn-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                <button class="btn btn-primary" onclick="removeFromCart(${index})" style="padding: 0.8rem 1rem; font-size: 0.9rem;">Удалить</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = total.toLocaleString();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('toysrus_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('toysrus_cart', JSON.stringify(cart));
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('toysrus_cart', JSON.stringify(cart));
    updateCartUI();
}

function checkout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`✅ Заказ оформлен на сумму ${total.toLocaleString()} 
    ₽!\n\nСпасибо за покупку!\n❤️`);
    cart = [];
    localStorage.setItem('toysrus_cart', '[]');
    updateCartUI();
}
    // Обновляет счетчик в навигации на всех страницах
function updateCartBadge() {
    const badges = document.querySelectorAll('#cartCount');
    badges.forEach(badge => badge.textContent = cart.length);
}

// Глобальная функция для каталога
window.addToCart = addToCart;
window.updateCartBadge = updateCartBadge;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    updateCartUI();
});