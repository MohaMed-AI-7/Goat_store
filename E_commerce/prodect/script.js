document.addEventListener('DOMContentLoaded', () => {
  let currentProduct = {
    id: 'portugal-special-kit-2025',
    name: 'Portugal Special Kit 2025',
    subtitle: 'Black Panther Edition',
    category: 'Club Shirts',
    subCategory: 'National Teams',
    price: 750.00,
    badge: 'SPECIAL EDITION',
    stock: 24,
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'Official special-edition kit with embroidered crest and printed name/number set. Slim athletic fit, moisture-wicking fabric.'
  };

  let selectedSize = 'M';
  let quantity = 1;

  const elProductTitle = document.getElementById('productTitle');
  const elProductSubtitle = document.getElementById('productSubtitle');
  const elProductPrice = document.getElementById('productPrice');
  const elProductBadge = document.getElementById('productBadge');
  const elProductDetailsText = document.getElementById('productDetailsText');
  const elBreadcrumbName = document.getElementById('breadcrumbProductName');
  const elSizeButtonsGroup = document.getElementById('sizeButtonsGroup');
  const elQtyDisplay = document.getElementById('qtyDisplay');
  const btnQtyMinus = document.getElementById('btnQtyMinus');
  const btnQtyPlus = document.getElementById('btnQtyPlus');
  const btnAddToCart = document.getElementById('btnAddToCart');
  const btnBuyNow = document.getElementById('btnBuyNow');
  const navCartBadge = document.getElementById('navCartBadge');
  const toastContainer = document.getElementById('toastContainer');
  const sizeGuideBtn = document.getElementById('sizeGuideBtn');
  const sizeGuideModal = document.getElementById('sizeGuideModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const navBackBtn = document.getElementById('navBackBtn');

  function loadProductFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId && typeof GoatDB !== 'undefined') {
      const found = GoatDB.getProductById(productId);
      if (found) {
        currentProduct = {
          ...currentProduct,
          ...found,
          subtitle: found.id === 'portugal-special-kit-2025' ? 'Black Panther Edition' : (found.brand || 'Official Release'),
          badge: found.badge || (found.id === 'portugal-special-kit-2025' ? 'SPECIAL EDITION' : '')
        };
      }
    }

    renderProductDetails();
  }

  function renderProductDetails() {
    document.title = `${currentProduct.name} — GOAT`;

    if (elProductTitle) elProductTitle.textContent = currentProduct.name.toUpperCase();
    if (elProductSubtitle) elProductSubtitle.textContent = currentProduct.subtitle;
    if (elBreadcrumbName) elBreadcrumbName.textContent = currentProduct.name;
    
    if (elProductPrice) {
      elProductPrice.textContent = `LE ${parseFloat(currentProduct.price).toFixed(2)}`;
    }

    if (elProductBadge) {
      if (currentProduct.badge) {
        elProductBadge.textContent = currentProduct.badge;
        elProductBadge.style.display = 'inline-flex';
      } else {
        elProductBadge.style.display = 'none';
      }
    }

    if (elProductDetailsText && currentProduct.description) {
      elProductDetailsText.textContent = currentProduct.description;
    }

    const kitsContainer = document.getElementById('kitsContainer');
    if (kitsContainer) {
      if (currentProduct.imageUrl) {
        const resolvedImg = (typeof GoatDB !== 'undefined') ? GoatDB.normalizeImageUrl(currentProduct.imageUrl) : currentProduct.imageUrl;
        kitsContainer.innerHTML = `
          <div class="product-showcase-image-wrap">
            <img src="${resolvedImg}" alt="${currentProduct.name}" class="product-showcase-image" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=&quot;product-wireframe-wrap&quot;>${(typeof GoatDB !== 'undefined' ? GoatDB.renderIcon(currentProduct.iconType || 'shirt') : '').replace(/"/g, '&quot;')}</div>';">
          </div>
        `;
      } else if (currentProduct.id === 'portugal-special-kit-2025') {
        kitsContainer.innerHTML = `
          <!-- Front View -->
          <div class="kit-view-wrapper">
            <div class="jersey-graphic">
              <svg viewBox="0 0 180 220" class="jersey-svg" xmlns="http://www.w3.org/2000/svg">
                <path class="jersey-stroke" d="M 66 30 L 48 34 L 18 66 L 38 88 L 52 74 L 52 184 L 128 184 L 128 74 L 142 88 L 162 66 L 132 34 L 114 30 L 90 54 Z" />
                <path class="collar-stroke" d="M 68 31 L 90 44 L 112 31" />
                <text x="90" y="132" class="jersey-gold-num" text-anchor="middle">7</text>
              </svg>
            </div>
            <span class="kit-label">FRONT</span>
          </div>

          <!-- Back View -->
          <div class="kit-view-wrapper">
            <div class="jersey-graphic">
              <svg viewBox="0 0 180 220" class="jersey-svg" xmlns="http://www.w3.org/2000/svg">
                <path class="jersey-stroke" d="M 66 30 L 48 34 L 18 66 L 38 88 L 52 74 L 52 184 L 128 184 L 128 74 L 142 88 L 162 66 L 132 34 L 114 30 Q 90 38 66 30 Z" />
                <path class="collar-stroke" d="M 66 30 Q 90 46 114 30" />
                <text x="90" y="96" class="jersey-gold-name" text-anchor="middle">RONALDO</text>
                <text x="90" y="146" class="jersey-gold-num-back" text-anchor="middle">7</text>
              </svg>
            </div>
            <span class="kit-label">BACK</span>
          </div>
        `;
      } else {
        const iconSvg = typeof GoatDB !== 'undefined' ? GoatDB.renderIcon(currentProduct.iconType || 'shirt') : '';
        kitsContainer.innerHTML = `
          <div class="product-wireframe-wrap">
            ${iconSvg}
          </div>
        `;
      }
    }

    if (elSizeButtonsGroup && Array.isArray(currentProduct.sizes) && currentProduct.sizes.length > 0) {
      elSizeButtonsGroup.innerHTML = currentProduct.sizes.map(s => `
        <button type="button" class="size-btn ${s === selectedSize ? 'active' : ''}" data-size="${s}">${s}</button>
      `).join('');
    }
  }

  function updateCartBadge() {
    if (!navCartBadge) return;
    if (typeof GoatDB !== 'undefined') {
      const count = GoatDB.getCartCount();
      navCartBadge.textContent = count;
      navCartBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  if (elSizeButtonsGroup) {
    elSizeButtonsGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.size-btn');
      if (!btn) return;
      elSizeButtonsGroup.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.getAttribute('data-size');
    });
  }

  if (btnQtyMinus) {
    btnQtyMinus.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        if (elQtyDisplay) elQtyDisplay.textContent = quantity;
      }
    });
  }

  if (btnQtyPlus) {
    btnQtyPlus.addEventListener('click', () => {
      const maxStock = currentProduct.stock || 50;
      if (quantity < maxStock) {
        quantity++;
        if (elQtyDisplay) elQtyDisplay.textContent = quantity;
      } else {
        showToast(`Maximum available stock is ${maxStock}`);
      }
    });
  }

  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', () => {
      if (typeof GoatDB !== 'undefined') {
        GoatDB.addToCart(currentProduct, selectedSize, quantity);
        updateCartBadge();
        showToast(`Added "${currentProduct.name}" (Size ${selectedSize}, Qty ${quantity}) to cart!`);
      } else {
        showToast(`Added to cart!`);
      }
    });
  }

  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', () => {
      if (typeof GoatDB !== 'undefined') {
        GoatDB.addToCart(currentProduct, selectedSize, quantity);
        const subtotal = parseFloat(currentProduct.price) * quantity;
        const shipping = 50.00;
        const total = subtotal + shipping;
        localStorage.setItem('goat_cart_total', total.toFixed(2));
      }
      window.location.href = '../pyment/payment.html';
    });
  }

  if (sizeGuideBtn && sizeGuideModal) {
    sizeGuideBtn.addEventListener('click', () => {
      sizeGuideModal.classList.add('active');
      sizeGuideModal.setAttribute('aria-hidden', 'false');
    });
  }

  if (modalCloseBtn && sizeGuideModal) {
    modalCloseBtn.addEventListener('click', () => {
      sizeGuideModal.classList.remove('active');
      sizeGuideModal.setAttribute('aria-hidden', 'true');
    });
  }

  if (sizeGuideModal) {
    sizeGuideModal.addEventListener('click', (e) => {
      if (e.target === sizeGuideModal) {
        sizeGuideModal.classList.remove('active');
        sizeGuideModal.setAttribute('aria-hidden', 'true');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sizeGuideModal.classList.contains('active')) {
        sizeGuideModal.classList.remove('active');
        sizeGuideModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  if (navBackBtn) {
    navBackBtn.addEventListener('click', (e) => {
      if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
        e.preventDefault();
        window.history.back();
      }
    });
  }

  window.addEventListener('cart_updated', updateCartBadge);
  window.addEventListener('storage', (e) => {
    if (e.key === 'goat_cart_items') {
      updateCartBadge();
    }
  });

  loadProductFromUrl();
  updateCartBadge();
});
