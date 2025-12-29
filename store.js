document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPrice = document.querySelector('.cart-total-price');
    const orderModal = document.getElementById('orderModal');
    const orderForm = document.getElementById('orderForm');

    function openModal() {
        if (cart.length === 0) {
            alert('Корзина пуста. Добавьте товары перед оформлением заказа.');
            return;
        }
        orderModal.style.display = 'flex';
    }
    
    function closeModal() {
        orderModal.style.display = 'none';
        // Очистка формы при закрытии
        orderForm.reset();
    }

    orderModal.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            closeModal();
        }
    });


    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();
        //тут еще будет новое сообщение
        
        //очищаем корзину тк заказали
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();

        closeModal();
    });
    
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-row" style="text-align: center; padding: 40px; color: #666;">Корзина пуста</div>';
            cartTotalPrice.textContent = '0 руб.';
            return;
        }
        
        let total = 0;
        
        //создаем элементы для каждого товара чтобы добавить в корзину
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const cartRow = document.createElement('div');
            cartRow.className = 'cart-row';
            cartRow.innerHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" width="50" height="50">
                    <span>${item.name}</span>
                </div>
                <span class="cart-price">${item.price} руб.</span>
                <div class="cart-quantity">
                    <input type="number" value="${item.quantity}" min="1">
                    <button class="btn btn-danger" data-index="${index}">Удалить</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartRow);
        });
        
        cartTotalPrice.textContent = `${total} руб.`;
        
        addCartEventListeners();
    }
    
    function addToCart(name, price, image) {
        const existingItemIndex = cart.findIndex(item => 
            item.name === name && 
            item.price === price && 
            item.image === image
        );
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {

            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartDisplay();
        
        document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
    }
    
    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
    
    function updateQuantity(index, newQuantity) {
        if (newQuantity >= 1) {
            cart[index].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }
    

    function addCartEventListeners() {
        document.querySelectorAll('.cart-row .btn-danger').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
        

        document.querySelectorAll('.cart-quantity input').forEach(input => {
            input.addEventListener('change', function() {
                const row = this.closest('.cart-row');
                const button = row.querySelector('.btn-danger');
                const index = parseInt(button.getAttribute('data-index'));
                const newQuantity = parseInt(this.value);
                updateQuantity(index, newQuantity);
            });
        });
    }
    

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            addToCart(name, price, image);
        });
    });
    
    const checkoutButton = document.querySelector('#cart .add-to-cart');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', openModal);
        checkoutButton.textContent = 'Оформить заказ';
    }
    
    updateCartDisplay();
});