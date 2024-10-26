// Simple cart functionality
let cart = [];

function addToCart(product) {
    cart.push(product);
    updateCartDisplay();
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`${product.name} added to cart!`);
}

function updateCartDisplay() {
    const cartGrid = document.querySelector('.cart-grid');
    if (cartGrid) {
        cartGrid.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <h3>${item.name}</h3>
                <p class="cart-item-price">$${item.price}</p>
                <button class="btn remove-from-cart-btn" data-id="${item.id}">Remove</button>
            `;
            cartGrid.appendChild(cartItem);
        });
    }
    updateCartTotal();
}

function updateCartTotal() {
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
        cartTotal.textContent = total.toFixed(2);
    }
}

function updateCartCount() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        const count = cart.length;
        cartIcon.setAttribute('data-count', count);
        cartIcon.classList.toggle('has-items', count > 0);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart));
}

function removeAllFromCart() {
    cart = [];
    updateCartDisplay();
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Simple favorites functionality
let favorites = [];

function addToFavorites(product, button) {
    const index = favorites.findIndex(item => item.id === product.id);
    if (index === -1) {
        favorites.push(product);
        button.classList.add('active');
        showNotification(`${product.name} added to favorites!`);
    } else {
        favorites.splice(index, 1);
        button.classList.remove('active');
        showNotification(`${product.name} removed from favorites!`);
    }
    updateFavoritesDisplay();
    updateFavoritesCount();
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateFavoritesDisplay() {
    const favoritesGrid = document.querySelector('.favorites-grid');
    if (favoritesGrid) {
        favoritesGrid.innerHTML = '';
        favorites.forEach(item => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="favorite-item-image">
                <h3>${item.name}</h3>
                <p class="favorite-item-price">$${item.price}</p>
                <div class="favorite-item-buttons">
                    <button class="btn remove-from-favorites-btn" data-id="${item.id}">Remove</button>
                    <button class="btn add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
                </div>
            `;
            favoritesGrid.appendChild(favoriteItem);
        });
    }
}

function updateFavoritesCount() {
    const favoritesIcon = document.querySelector('.heart-icon');
    if (favoritesIcon) {
        const count = favorites.length;
        favoritesIcon.setAttribute('data-count', count);
        favoritesIcon.classList.toggle('has-items', count > 0);
    }
}

function removeFromFavorites(productId) {
    favorites = favorites.filter(item => item.id !== productId);
    updateFavoritesDisplay();
    updateFavoritesCount();
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function removeAllFromFavorites() {
    favorites = [];
    updateFavoritesDisplay();
    updateFavoritesCount();
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

// Function to set username in navbar
function setUsername() {
    const username = localStorage.getItem('username') || getUrlParameter('username') || 'User';
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = username;
    }
    localStorage.setItem('username', username);
}

// Function to toggle user dropdown
function toggleUserDropdown(event) {
    event.stopPropagation();
    document.getElementById('userDropdown').classList.toggle('show');
}

// Function to sign out
function signOut(event) {
    event.preventDefault();
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    setUsername();

    const userButton = document.getElementById('userButton');
    const signOutButton = document.getElementById('signOutButton');

    if (userButton) {
        userButton.addEventListener('click', toggleUserDropdown);
    }

    if (signOutButton) {
        signOutButton.addEventListener('click', signOut);
    }

    // Close the dropdown if the user clicks outside of it
    document.addEventListener('click', function(event) {
        if (!event.target.matches('.user-btn') && !event.target.closest('.user-dropdown')) {
            var dropdowns = document.getElementsByClassName('user-dropdown');
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    });

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
        updateCartCount();
    }

    // Add event listeners for "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const product = {
                    id: productCard.dataset.id,
                    name: productCard.dataset.name,
                    price: productCard.dataset.price,
                    image: productCard.dataset.image
                };
                addToCart(product);
                alert(`${product.name} added to cart!`);
            } else {
                console.error('Product card not found');
            }
        });
    });

    // Add event listener for "Remove" buttons in cart
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = e.target.dataset.id;
            removeFromCart(productId);
        }
    });

    const removeAllBtn = document.querySelector('.remove-all-btn');
    if (removeAllBtn) {
        removeAllBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove all items from your cart?')) {
                removeAllFromCart();
            }
        });
    }

    // Add event listeners for "Add to Favorites" buttons
    const addToFavoritesButtons = document.querySelectorAll('.add-to-favorites-btn');
    addToFavoritesButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const product = {
                    id: productCard.dataset.id,
                    name: productCard.dataset.name,
                    price: productCard.dataset.price,
                    image: productCard.dataset.image
                };
                addToFavorites(product, button);
            } else {
                console.error('Product card not found');
            }
        });
    });

    // Add event listener for "Remove" buttons in favorites
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-favorites-btn')) {
            const productId = e.target.dataset.id;
            removeFromFavorites(productId);
        }
    });

    // Add event listener for "Remove All Favorites" button
    const removeAllFavoritesBtn = document.querySelector('.remove-all-favorites-btn');
    if (removeAllFavoritesBtn) {
        removeAllFavoritesBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove all items from your favorites?')) {
                removeAllFromFavorites();
            }
        });
    }

    // Add event listener for "Add All to Cart" button
    const addAllToCartBtn = document.querySelector('.add-all-to-cart-btn');
    if (addAllToCartBtn) {
        addAllToCartBtn.addEventListener('click', () => {
            favorites.forEach(item => addToCart(item));
            alert('All favorite items added to cart!');
        });
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
        updateFavoritesDisplay();
        updateFavoritesCount();
    }

    // Add this function to debug
    function debugAddToCart() {
        console.log('Add to Cart buttons:', document.querySelectorAll('.add-to-cart-btn'));
        console.log('Product cards:', document.querySelectorAll('.product-card'));
    }

    // Call this function at the end of the DOMContentLoaded event
    debugAddToCart();

    // Add event listeners for "Add to Cart" buttons in shop page
    const shopAddToCartButtons = document.querySelectorAll('.shop-add-to-cart-btn');
    shopAddToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const product = {
                    id: productCard.dataset.id,
                    name: productCard.dataset.name,
                    price: productCard.dataset.price,
                    image: productCard.dataset.image
                };
                addToCart(product);
                showNotification(`${product.name} added to cart!`);
            } else {
                console.error('Product card not found');
            }
        });
    });

    // Add this to your existing code
    const products = [
        {
            id: "1",
            name: "THE LEATHER LARGE TOTE BAG",
            price: "595.00",
            image: "assets/images/large-tote.jpg"
        },
        {
            id: "2",
            name: "THE LEATHER MEDIUM TOTE BAG",
            price: "450.00",
            image: "assets/images/medium-tote.jpg"
        },
        // Add all your products here
    ];

    function initializeSearch() {
        const searchIcon = document.querySelector('.search-icon');
        const searchDropdown = document.querySelector('.search-dropdown');
        const searchInput = document.getElementById('searchInput');

        // Toggle search dropdown
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            searchDropdown.classList.toggle('show');
            if (searchDropdown.classList.contains('show')) {
                searchInput.focus();
            }
        });

        // Close search dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchDropdown.classList.remove('show');
            }
        });

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const searchResults = document.querySelector('.search-results');
            
            if (searchTerm === '') {
                searchResults.innerHTML = '';
                return;
            }

            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );

            if (filteredProducts.length === 0) {
                searchResults.innerHTML = `
                    <div class="no-results">
                        No products found
                    </div>
                `;
                return;
            }

            searchResults.innerHTML = filteredProducts.map(product => `
                <div class="search-result-item" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <p>$${product.price}</p>
                    </div>
                </div>
            `).join('');

            // Add click event for search results
            const resultItems = searchResults.querySelectorAll('.search-result-item');
            resultItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Navigate to product page or handle click as needed
                    window.location.href = `product.html?id=${item.dataset.id}`;
                });
            });
        });
    }

    // Add this to your DOMContentLoaded event listener
    initializeSearch();
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    notificationMessage.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
