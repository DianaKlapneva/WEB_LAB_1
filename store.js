console.log('Script is loading...');

// тест для проверки ибо консоль молчит
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is ready!');
    
    const buttons = document.querySelectorAll('.add-to-cart');
    console.log('Found buttons:', buttons.length);
    
    // нажми
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked!', this.getAttribute('data-name'));
            alert('Button works!');
        });
    });
});