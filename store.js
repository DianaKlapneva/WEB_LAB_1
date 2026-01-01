document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPrice = document.querySelector('.cart-total-price');
    const orderModal = document.getElementById('orderModal');
    const modalContent = document.getElementById('modalContent');
    let orderForm = document.getElementById('orderForm');
    let isSuccessMessageShown = false;
//все без inner html. создаем элементы динамически
    function openModal() {
        if (isSuccessMessageShown) {
        restoreForm();
    }
        orderModal.style.display = 'flex';
    }
    
    function closeModal() {
        orderModal.style.display = 'none';
        if (orderForm) {
            orderForm.reset();
        }
    }

    
    function showSuccessMessage() {

        while (modalContent.firstChild) {
            modalContent.removeChild(modalContent.firstChild);
        }
        

        const title = document.createElement('h2');
        title.textContent = 'Ваш заказ создан!';
        modalContent.appendChild(title);
        

        const successButtons = document.createElement('div');
        successButtons.className = 'success-buttons';
        
        const continueButton = document.createElement('button');
        continueButton.type = 'button';
        continueButton.id = 'continueShopping';
        continueButton.className = 'btn btn-primary';
        continueButton.textContent = 'Вернуться к покупкам';
        

        continueButton.addEventListener('click', function() {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            closeModal();
            isSuccessMessageShown = true;
        });
        
        successButtons.appendChild(continueButton);
        modalContent.appendChild(successButtons);
    }

    //строим заново
    function restoreForm() {
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }
    

    const title = document.createElement('h2');
    title.textContent = 'Оформление заказа';
    modalContent.appendChild(title);
    

    orderForm = document.createElement('form');
    orderForm.id = 'orderForm';

    const fields = [
        { id: 'firstName', label: 'Имя *', type: 'text', required: true },
        { id: 'lastName', label: 'Фамилия *', type: 'text', required: true },
        { id: 'address', label: 'Адрес доставки *', type: 'textarea', required: true, rows: 3 },
        { id: 'phone', label: 'Телефон *', type: 'tel', required: true, placeholder: '+7 (XXX) XXX-XX-XX' }
    ];
    

    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
  
        const label = document.createElement('label');
        label.htmlFor = field.id;
        label.textContent = field.label;
        formGroup.appendChild(label);

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            if (field.rows) input.rows = field.rows;
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }
        
        input.id = field.id;
        input.className = 'form-input';
        input.required = field.required;
        
        if (field.placeholder) {
            input.placeholder = field.placeholder;
        }
        
        formGroup.appendChild(input);
        orderForm.appendChild(formGroup);
    });
    
    
    const formButtons = document.createElement('div');
    formButtons.className = 'form-buttons';
    
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn btn-danger';
    closeButton.textContent = 'Закрыть';
    closeButton.addEventListener('click', closeModal);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary';
    submitButton.textContent = 'Создать заказ';
    
    formButtons.appendChild(closeButton);
    formButtons.appendChild(submitButton);
    orderForm.appendChild(formButtons);
    modalContent.appendChild(orderForm);

    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();
        showSuccessMessage();
    });
    
    isSuccessMessageShown = false;
}


    
    function updateCartDisplay() {
        while (cartItemsContainer.firstChild) {
            cartItemsContainer.removeChild(cartItemsContainer.firstChild);
        }

        let total = 0;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const cartRow = document.createElement('div');
            cartRow.className = 'cart-row';
        
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            
            const itemImage = document.createElement('img');
            itemImage.src = item.image;
            itemImage.alt = item.name;
            itemImage.width = 50;
            itemImage.height = 50;
            

            const itemName = document.createElement('span');
            itemName.textContent = item.name;
            
            cartItemDiv.appendChild(itemImage);
            cartItemDiv.appendChild(itemName);
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'cart-price';
            priceSpan.textContent = `${item.price} руб.`;
            
            const quantityDiv = document.createElement('div');
            quantityDiv.className = 'cart-quantity';
            

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = item.quantity;
            quantityInput.min = 1;
            

            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-danger';
            removeButton.dataset.index = index;
            removeButton.textContent = 'Удалить';
            

            quantityDiv.appendChild(quantityInput);
            quantityDiv.appendChild(removeButton);
            
            cartRow.appendChild(cartItemDiv);
            cartRow.appendChild(priceSpan);
            cartRow.appendChild(quantityDiv);
            
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
                const index = parseInt(this.dataset.index);
                removeFromCart(index);
            });
        });
        
        document.querySelectorAll('.cart-quantity input').forEach(input => {
            input.addEventListener('change', function() {
                const row = this.closest('.cart-row');
                const button = row.querySelector('.btn-danger');
                const index = parseInt(button.dataset.index);
                const newQuantity = parseInt(this.value);
                updateQuantity(index, newQuantity);
            });
        });
    }
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const name = this.dataset.name;
        const price = parseFloat(this.dataset.price);
        const image = this.dataset.image;
        
        addToCart(name, price, image);
        });
    })
    
    const checkoutButton = document.querySelector('.checkout-btn');
        if (checkoutButton) {
    checkoutButton.addEventListener('click', openModal);
    }

    restoreForm();
    updateCartDisplay();
});