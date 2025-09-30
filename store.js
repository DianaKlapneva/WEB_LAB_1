let cart = JSON.parse(localStorage.getItem('cart')) || []; // в этом json хранятся данные о корзине

function addToCart(name, price, image) {
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
    cart = cart.filter(item => item.name !== name);
    updateCart();
    saveCartToStorage();
}

function updateQuantity(name, newQuantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = newQuantity;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCart();
            saveCartToStorage();
        }
    }
}

function updateCart() {
    const cartContainer = document.querySelector('#cart .cart-items');
    const totalElement = document.querySelector('.cart-total-price');
    cartContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {  // добавляем товары в корзину
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
    
    totalElement.textContent = total + ' руб.'; // обновляем сумму покупок
}


function saveCartToStorage() {// сохраняем данные корзины в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', function() {// это инициализация при загрузке страницы
    const addToCartButtons = document.querySelectorAll('.add-to-cart'); // это обработчики для кнопок "Добавить в корзину"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            addToCart(name, price, image);
        });
    });
    updateCart();// при первом заходе на сайт загружаем корзину
});

    document.addEventListener('click', function(event) { //для появляющихся кнопок удаления
        if (event.target.classList.contains('remove-from-cart')) {
            const name = event.target.getAttribute('onclick').match(/'([^']+)'/)[1];
            removeFromCart(name);
        }
    });
    
    updateCart();
});