// Simple cart functionality
let cart = [];

function addToCart(product) {
    cart.push(product);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = item;
            cartItems.appendChild(itemElement);
        });
    }
}

// Simple favorites functionality
let favorites = [];

function addToFavorites(product) {
    favorites.push(product);
    updateFavoritesDisplay();
}

function updateFavoritesDisplay() {
    const favoriteItems = document.getElementById('favorite-items');
    if (favoriteItems) {
        favoriteItems.innerHTML = '';
        favorites.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = item;
            favoriteItems.appendChild(itemElement);
        });
    }
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

    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            addToCart('Product 1');
            alert('Product added to cart!');
        });
    }

    const favoriteBtn = document.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            addToFavorites('Product 1');
            alert('Product added to favorites!');
        });
    }
});
