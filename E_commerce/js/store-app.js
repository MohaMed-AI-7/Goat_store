document.addEventListener('DOMContentLoaded', () => {
  const productsGrid = document.querySelector('.products-grid');
  const categoryHeading = document.getElementById('categoryHeading');
  const productsCountEl = document.getElementById('productsCountEl');
  const searchInput = document.querySelector('.search-input');
  const categoryButtons = document.querySelectorAll('.second_elements button');
  const navCartBadge = document.getElementById('navCartBadge');
  const toastContainer = document.getElementById('toastContainer');

  let currentFilters = {
    category: 'all',
    search: '',
    brands: [],
    sizes: [],
    prices: []
  };

  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function updateCartBadge() {
    const totalCount = GoatDB.getCartCount();
    if (navCartBadge) {
      navCartBadge.textContent = totalCount;
      navCartBadge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }
  }

  function updateOwnerVisibility() {
    const ownerBadge = document.getElementById('ownerPortalBadge') || document.querySelector('.owner-portal-badge');
    if (ownerBadge) {
      const isOwner = window.GoatDB && typeof window.GoatDB.getOwnerSession === 'function' && window.GoatDB.getOwnerSession();
      if (isOwner) {
        ownerBadge.classList.add('is-visible');
        ownerBadge.style.display = 'inline-flex';
      } else {
        ownerBadge.classList.remove('is-visible');
        ownerBadge.style.display = 'none';
      }
    }
  }

  function readSidebarFilters() {
    const brandChecks = document.querySelectorAll('input[name="brand"]:checked');
    currentFilters.brands = Array.from(brandChecks).map(cb => cb.value.trim());

    const sizeChecks = document.querySelectorAll('input[name="size"]:checked');
    currentFilters.sizes = Array.from(sizeChecks).map(cb => cb.value.trim());

    const priceChecks = document.querySelectorAll('input[name="price"]:checked');
    currentFilters.prices = Array.from(priceChecks).map(cb => cb.value.trim());
  }

  function filterProducts() {
    const allProducts = GoatDB.getProducts();

    return allProducts.filter(item => {
      if (currentFilters.category !== 'all' && 
          item.category.toLowerCase() !== currentFilters.category.toLowerCase()) {
        return false;
      }

      if (currentFilters.search) {
        const query = currentFilters.search.toLowerCase();
        const inName = item.name.toLowerCase().includes(query);
        const inCat = item.category.toLowerCase().includes(query);
        const inBrand = item.brand && item.brand.toLowerCase().includes(query);
        if (!inName && !inCat && !inBrand) return false;
      }

      if (currentFilters.brands.length > 0) {
        if (!item.brand || !currentFilters.brands.includes(item.brand)) {
          return false;
        }
      }

      if (currentFilters.sizes.length > 0) {
        const itemSizes = item.sizes || ['M'];
        const hasSize = currentFilters.sizes.some(s => itemSizes.includes(s));
        if (!hasSize) return false;
      }

      if (currentFilters.prices.length > 0) {
        const price = parseFloat(item.price);
        const matchesPrice = currentFilters.prices.some(range => {
          if (range === 'Under LE 500') return price < 500;
          if (range === 'LE 500 – 1000' || range === 'LE 500 - 1000') return price >= 500 && price <= 1000;
          if (range === 'LE 1000+') return price > 1000;
          return true;
        });
        if (!matchesPrice) return false;
      }

      return true;
    });
  }

  function renderCard(product) {
    const isOut = product.stock === 0 || product.status === 'Out of stock';
    const isLow = !isOut && (product.stock <= 5 || product.status === 'Low stock');

    let visualHtml = '';
    if (product.imageUrl) {
      visualHtml = `<img src="${product.imageUrl}" alt="${product.name}" onerror="this.onerror=null; this.parentElement.innerHTML='${GoatDB.renderIcon(product.iconType || 'shirt').replace(/"/g, '&quot;')}';">`;
    } else {
      visualHtml = GoatDB.renderIcon(product.iconType || 'shirt');
    }

    let badgeHtml = '';
    if (product.badge) {
      const isSale = product.badge.toUpperCase() === 'SALE';
      badgeHtml = `<span class="badge-tag ${isSale ? 'sale' : ''}">${product.badge}</span>`;
    }

    let stockPill = '';
    if (isOut) {
      stockPill = `<span class="card-stock-pill out">Out of stock</span>`;
    } else if (isLow) {
      stockPill = `<span class="card-stock-pill low">Only ${product.stock} left</span>`;
    }

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="card-top-row">
          ${badgeHtml}
        </div>

        <div class="card-visual-wrap">
          ${visualHtml}
        </div>

        <div class="card-details">
          <h3 class="card-title">${product.name}</h3>

          <div class="card-meta-row">
            <span class="card-price">${GoatDB.formatPrice(product.price)}</span>
            ${stockPill}
          </div>

          <button 
            class="btn-card-add ${isOut ? 'disabled' : ''}" 
            data-action="add-cart" 
            data-id="${product.id}"
            ${isOut ? 'disabled' : ''}
          >
            ${isOut ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    `;
  }

  function renderStore() {
    if (!productsGrid) return;

    const filtered = filterProducts();

    if (productsCountEl) {
      productsCountEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'}`;
    }

    if (categoryHeading) {
      if (currentFilters.category === 'all') {
        categoryHeading.textContent = 'ALL PRODUCTS';
      } else {
        categoryHeading.textContent = currentFilters.category.toUpperCase();
      }
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-store-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
          <h3>No items match your filters</h3>
          <p>Try unchecking some filter options or searching for something else.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(renderCard).join('');
  }

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const catName = btn.textContent.trim();
      currentFilters.category = catName === 'All Items' || catName === 'All' ? 'all' : catName;
      renderStore();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.search = e.target.value.trim();
      renderStore();
    });
  }

  const filterCheckboxes = document.querySelectorAll('.sidebar-filters input[type="checkbox"]');
  filterCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      readSidebarFilters();
      renderStore();
    });
  });

  if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action="add-cart"]');
      if (btn) {
        if (btn.disabled) return;
        const productId = btn.getAttribute('data-id');
        const product = GoatDB.getProductById(productId);
        if (!product) return;

        GoatDB.addToCart(product, 'M', 1);
        updateCartBadge();
        showToast(`Added "${product.name}" to your cart!`);
        return;
      }

      const card = e.target.closest('.product-card');
      if (card) {
        const productId = card.getAttribute('data-id');
        if (productId) {
          window.location.href = `./prodect/prodect.html?id=${encodeURIComponent(productId)}`;
        }
      }
    });
  }

  window.addEventListener('goat_store_sync', () => {
    renderStore();
    updateCartBadge();
    updateOwnerVisibility();
  });

  window.addEventListener('cart_updated', () => {
    updateCartBadge();
  });

  window.addEventListener('products_updated', () => {
    renderStore();
  });

  readSidebarFilters();
  updateCartBadge();
  updateOwnerVisibility();
  renderStore();
});
