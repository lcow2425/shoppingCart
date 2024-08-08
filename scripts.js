document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function fetchProducts() {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                displayProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button data-id="${product.id}">Add to Cart</button>
            `;
            productList.appendChild(productDiv);
        });
        document.querySelectorAll('.product button').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    function addToCart(event) {
        const productId = event.target.getAttribute('data-id');
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                const product = data.find(p => p.id === productId);
                const cartProduct = cart.find(p => p.id === productId);
                if (cartProduct) {
                    cartProduct.quantity += 1;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <span>${item.name}</span>
                <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                <span>$${(item.quantity * item.price).toFixed(2)}</span>
            `;
            cartItems.appendChild(itemDiv);
            total += item.quantity * item.price;
        });
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    checkoutButton.addEventListener('click', () => {
        alert('Checkout functionality is not implemented.');
    });

    updateCart();
    fetchProducts();
});
