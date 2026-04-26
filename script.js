/* TresD Store - JavaScript */

const products = [
    { id: 1, name: "Elefante Decorativo", category: "decoracao", description: "Elefante moderno", price: 49.90, badge: "Mais Vendido", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop" },
    { id: 2, name: "Vaso Geométrico", category: "decoracao", description: "Design moderno", price: 39.90, badge: null, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&h=400&fit=crop" },
    { id: 3, name: "Miniatura D20", category: "miniaturas", description: "Dado para RPG", price: 29.90, badge: null, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&h=400&fit=crop" },
    { id: 4, name: "Organizador Canetas", category: "utilitarios", description: "Porta-canetas", price: 34.90, badge: null, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop" },
    { id: 5, name: "Personagem Anime", category: "brinquedos", description: "Figura colecionável", price: 59.90, badge: "Novo", image: "https://images.unsplash.com/photo-1608889825105-3d6a5c4a33d8?w=400&h=400&fit=crop" },
    { id: 6, name: "Suporte Fone", category: "utilitarios", description: "Suporte耳機", price: 24.90, badge: null, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop" },
    { id: 7, name: "Lâmpada 3D", category: "decoracao", description: "Abajur decorativo", price: 79.90, badge: null, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop" },
    { id: 8, name: "Tabuleiro Xadrez", category: "miniaturas", description: "Tabuleiro dobrável", price: 89.90, badge: null, image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=400&fit=crop" }
];

let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage with correct key
    const stored = localStorage.getItem('tresd_cart');
    cart = stored ? JSON.parse(stored) : [];
    
    const count = document.getElementById('cartCount');
    if (count) {
        count.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    renderProducts(products);
    setupFilters();
});

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('tresd_cart', JSON.stringify(cart));
    const count = document.getElementById('cartCount');
    if (count) {
        count.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Render products
function renderProducts(productsList) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = productsList.map(product => {
        const catName = getCategoryName(product.category);
        return `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <i class="fa-solid fa-cube" style="display:none; font-size:56px; color:var(--dark-3);"></i>
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <span class="product-category">${catName}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                        <button class="add-to-cart" onclick="addToCart(${product.id})"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getCategoryName(category) {
    const names = {
        decoracao: 'Decoração',
        brinquedos: 'Brinquedos',
        utilitários: 'Utilitários',
        miniaturas: 'Miniaturas'
    };
    return names[category] || category;
}

// Filters
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
            renderProducts(filtered);
        });
    });
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    showToast('Produto adicionado ao carrinho!');
}

function updateCartUI() {
    const count = document.getElementById('cartCount');
    const items = document.getElementById('cartItems');
    const total = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (count) count.textContent = totalItems;
    if (total) total.textContent = 'R$ ' + totalPrice.toFixed(2).replace('.', ',');
    
    if (!items) return;
    
    if (cart.length === 0) {
        items.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
    } else {
        items.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="cart-item-qty">
                    <button onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
        
        const style = document.createElement('style');
        style.textContent = `
            .cart-item { display:flex; gap:10px; padding:12px; background:var(--dark); border-radius:var(--radius); margin-bottom:10px; }
            .cart-item img { width:50px; height:50px; object-fit:cover; border-radius:8px; }
            .cart-item-info { flex:1; }
            .cart-item-info h4 { font-size:13px; margin-bottom:2px; }
            .cart-item-info p { font-size:13px; color:var(--primary-light); }
            .cart-item-qty { display:flex; align-items:center; gap:8px; }
            .cart-item-qty button { width:24px; height:24px; background:var(--dark-2); border-radius:6px; color:var(--white); }
            .cart-item-qty span { font-size:13px; min-width:20px; text-align:center; }
        `;
        document.head.appendChild(style);
    }
}

function updateQty(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    saveCart();
    showToast('Carrinho atualizado!');
}

function goToCheckout() {
    if (cart.length === 0) {
        showToast('Carrinho vazio!');
        return;
    }
    alert('Página de checkout em breve!');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--success);
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Expose functions globally
window.addToCart = addToCart;
window.updateQty = updateQty;
window.goToCheckout = goToCheckout;
window.renderProducts = renderProducts;