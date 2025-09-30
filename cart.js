// cart.js

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price, img) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), quantity: 1, img });
    }
    saveCart();
    updateCartDisplay();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartDisplay();
}

function changeQuantity(name, amount) {
    const item = cart.find(p => p.name === name);
    if (!item) return;
    item.quantity += amount;
    if (item.quantity < 1) item.quantity = 1;
    saveCart();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartList = document.getElementById('cart-list');
    const totalPrice = document.getElementById('total-price');
    if (!cartList) return;

    cartList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const li = document.createElement('li');
        li.className = "cart-item";

        li.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>S/ ${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="minus">-</button>
                    <span>${item.quantity}</span>
                    <button class="plus">+</button>
                </div>
            </div>
            <button class="remove">Eliminar</button>
        `;

        li.querySelector('.minus').onclick = () => changeQuantity(item.name, -1);
        li.querySelector('.plus').onclick = () => changeQuantity(item.name, 1);
        li.querySelector('.remove').onclick = () => removeFromCart(item.name);

        cartList.appendChild(li);
    });

    totalPrice.textContent = `Total: S/ ${total.toFixed(2)}`;
}

// Botón de comprar
function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }
    alert("El pago se hace presencialmente. Gracias por tu compra 😃");
    cart = [];
    saveCart();
    updateCartDisplay();
}

// Asociar botones de productos
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.agregar-carrito');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-nombre');
            const price = button.getAttribute('data-precio');
            const img = button.parentElement.querySelector('img').src;
            addToCart(name, price, img);
        });
    });
    updateCartDisplay();

    // Botón de comprar
    const buyBtn = document.getElementById('buy-btn');
    if (buyBtn) buyBtn.onclick = checkout;
});
