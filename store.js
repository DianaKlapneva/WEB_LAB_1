let cart = JSON.parse(localStorage.getItem('cart')) || [];//json для корзины

function addToCart(name, price, image) {
    console.log('Adding to cart:', name, price, image);
    const existingItem = cart.find(item => item.name === name);  
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }    
    updateCart();
    saveCartToStorage();
}

function removeFromCart(name) {
    console.log('Removing from cart:', name);
    cart = cart.filter(item => item.name !== name);
    updateCart();
    saveCartToStorage();
}

function updateQuantity(name, newQuantity) {
    console.log('Updating quantity:', name, newQuantity);
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = parseInt(newQuantity);
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCart();
            saveCartToStorage();
        }
    }
}

function updateCart() {
    console.log('Updating cart, items:', cart);
    const cartContainer = document.querySelector('#cart .cart-items');
    const totalElement = document.querySelector('.cart-total-price');
    
    if (!cartContainer || !totalElement) {
        console.error('Cart elements not found!');
        return;
    }
    
    cartContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartRow = document.createElement('div');
        cartRow.className = 'cart-row';
        cartRow.innerHTML = `
            <div class="cart-item cart-column">
                <img src="${item.image}" alt="${item.name}" width="100" height="100">
                <span>${item.name}</span>
            </div>
            <span class="cart-price cart-column">${item.price} руб.</span>
            <div class="cart-quantity cart-column">
                <input type="number" min="1" value="${item.quantity}" 
                       onchange="updateQuantity('${item.name}', this.value)">
                <button class="btn btn-danger remove-from-cart" 
                        onclick="removeFromCart('${item.name}')">Удалить</button>
            </div>
        `;
        cartContainer.appendChild(cartRow);
    });
    
    totalElement.textContent = total + ' руб.';
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}


document.addEventListener('click', function(event) {//для появляющихся кнопок удаления
    if (event.target.classList.contains('remove-from-cart')) {
        // получаем имя товара из атрибута onclick
        const onclickAttr = event.target.getAttribute('onclick');
        const match = onclickAttr.match(/removeFromCart\('([^']+)'\)/);
        if (match) {
            const name = match[1];
            removeFromCart(name);
        }
    }
});


document.addEventListener('DOMContentLoaded', function() {// это инициализация при загрузке страницы
    console.log('DOM loaded, initializing cart...');
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    console.log('Found add to cart buttons:', addToCartButtons.length);
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Add to cart button clicked');
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            if (!name || !price || !image) {
                console.error('Missing data attributes:', {name, price, image});
                return;
            }
            
            addToCart(name, price, image);
        });
    });
    
    updateCart();
});