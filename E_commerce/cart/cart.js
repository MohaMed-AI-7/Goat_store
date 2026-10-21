document.addEventListener('DOMContentLoaded', () => {
  let cart = [];
  function loadCartData() {
    if (typeof GoatDB !== 'undefined') {
      cart = GoatDB.getCart();
    } else {
      try {
        const saved = localStorage.getItem('goat_cart_items');
        cart = saved ? JSON.parse(saved) : [];
      } catch(e) {
        cart = [];
      }
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      const p1 = (typeof GoatDB !== 'undefined') ? GoatDB.getProductById('real-madrid-2026-home-shirt') : null;
      const p2 = (typeof GoatDB !== 'undefined') ? GoatDB.getProductById('training-shorts-navy') : null;
      cart = [
        {
          id: 'real-madrid-2026-home-shirt',
          title: 'Real Madrid 2026 Home Shirt',
          size: 'M',
          color: 'White',
          unitPrice: 660.00,
          qty: 1,
          imageUrl: p1 ? p1.imageUrl : '',
          iconType: 'jersey-v'
        },
        {
          id: 'training-shorts-navy',
          title: 'Training Shorts — Navy',
          size: 'M',
          color: 'Navy',
          unitPrice: 380.00,
          qty: 1,
          imageUrl: p2 ? p2.imageUrl : '',
          iconType: 'shorts'
        }
      ];
    }
  }

  loadCartData();

  let appliedDiscount = 0;
  let appliedPromoCode = '';
  const TAX_RATE = 50.00;

  const cartItemsList = document.getElementById('cartItemsList');
  const emptyCartState = document.getElementById('emptyCartState');
  const itemsCountBadge = document.getElementById('itemsCountBadge');
  const navCartBadge = document.getElementById('navCartBadge');

  const subtotalEl = document.getElementById('subtotalEl');
  const taxEl = document.getElementById('taxEl');
  const discountRow = document.getElementById('discountRow');
  const discountEl = document.getElementById('discountEl');
  const discountLabel = document.getElementById('discountLabel');
  const orderTotalEl = document.getElementById('orderTotalEl');

  const promoInput = document.getElementById('promoInput');
  const btnPromoApply = document.getElementById('btnPromoApply');
  const promoMsg = document.getElementById('promoMsg');
  const promoHint = document.getElementById('promoHint');
  const btnProceed = document.getElementById('btnProceed');

  function formatMoney(amount) {
    return `LE ${Number(amount).toFixed(2)}`;
  }

  function renderCartItems() {
    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = '';
      return;
    }

    cartItemsList.innerHTML = cart.map(item => {
      const prod = (typeof GoatDB !== 'undefined') ? GoatDB.getProductById(item.id) : null;
      const imgUrl = item.imageUrl || (prod && prod.imageUrl) || '';
      const iconType = item.iconType || (prod && prod.iconType) || 'shirt';

      let visualHtml = '';
      if (imgUrl) {
        const resolvedImg = (typeof GoatDB !== 'undefined') ? GoatDB.normalizeImageUrl(imgUrl) : imgUrl;
        visualHtml = `<img src="${resolvedImg}" alt="${item.title}" class="cart-item-img" onerror="this.onerror=null; this.parentElement.innerHTML='${(typeof GoatDB !== 'undefined' ? GoatDB.renderIcon(iconType) : '').replace(/"/g, '&quot;')}';">`;
      } else if (typeof GoatDB !== 'undefined') {
        visualHtml = GoatDB.renderIcon(iconType);
      } else {
        visualHtml = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
          </svg>
        `;
      }

      return `
        <div class="cart-item-card" data-item-id="${item.id}">
          <div class="item-left-wrap">
            <div class="item-thumbnail">
              ${visualHtml}
            </div>
            <div class="item-details">
              <h3 class="item-title">${item.title}</h3>
              <span class="item-meta">Size ${item.size || 'M'} · ${item.color || 'Default'}</span>
              <div class="qty-controller">
                <button type="button" class="qty-btn btn-qty-minus" aria-label="Decrease quantity">−</button>
                <span class="qty-value">${item.qty}</span>
                <button type="button" class="qty-btn btn-qty-plus" aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>
          <div class="item-right-wrap">
            <span class="item-price">${formatMoney(item.unitPrice * item.qty)}</span>
            <button type="button" class="btn-remove-item">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    attachItemEvents();
  }

  function updateCalculations() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    if (itemsCountBadge) {
      itemsCountBadge.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
    }
    if (navCartBadge) {
      navCartBadge.textContent = totalItems;
      navCartBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    }

    if (cart.length === 0) {
      if (cartItemsList) cartItemsList.style.display = 'none';
      if (emptyCartState) emptyCartState.style.display = 'block';
      if (subtotalEl) subtotalEl.textContent = formatMoney(0);
      if (taxEl) taxEl.textContent = formatMoney(0);
      if (discountRow) discountRow.style.display = 'none';
      if (orderTotalEl) orderTotalEl.textContent = formatMoney(0);
      if (btnProceed) {
        btnProceed.style.pointerEvents = 'none';
        btnProceed.style.opacity = '0.5';
      }
      localStorage.setItem('goat_cart_total', '0.00');
      localStorage.setItem('goat_cart_items', JSON.stringify([]));
      window.dispatchEvent(new Event('cart_updated'));
      return;
    } else {
      if (cartItemsList) cartItemsList.style.display = 'flex';
      if (emptyCartState) emptyCartState.style.display = 'none';
      if (btnProceed) {
        btnProceed.style.pointerEvents = 'auto';
        btnProceed.style.opacity = '1';
      }
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
    const tax = subtotal > 0 ? TAX_RATE : 0;
    const discountAmount = appliedDiscount > 0 ? (subtotal * (appliedDiscount / 100)) : 0;
    const grandTotal = Math.max(0, subtotal - discountAmount + tax);

    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (taxEl) taxEl.textContent = formatMoney(tax);

    if (appliedDiscount > 0 && discountRow && discountEl && discountLabel) {
      discountRow.style.display = 'flex';
      discountLabel.textContent = `Discount (${appliedPromoCode} ${appliedDiscount}%)`;
      discountEl.textContent = `-${formatMoney(discountAmount)}`;
    } else if (discountRow) {
      discountRow.style.display = 'none';
    }

    if (orderTotalEl) orderTotalEl.textContent = formatMoney(grandTotal);

    localStorage.setItem('goat_cart_subtotal', subtotal.toFixed(2));
    localStorage.setItem('goat_cart_tax', tax.toFixed(2));
    localStorage.setItem('goat_cart_total', grandTotal.toFixed(2));
    localStorage.setItem('goat_cart_items', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart_updated'));
  }

  function attachItemEvents() {
    const itemCards = document.querySelectorAll('.cart-item-card');

    itemCards.forEach(card => {
      const itemId = card.getAttribute('data-item-id');
      const minusBtn = card.querySelector('.btn-qty-minus');
      const plusBtn = card.querySelector('.btn-qty-plus');
      const qtyVal = card.querySelector('.qty-value');
      const priceVal = card.querySelector('.item-price');
      const removeBtn = card.querySelector('.btn-remove-item');

      const item = cart.find(i => i.id === itemId);
      if (!item) return;

      if (minusBtn) {
        minusBtn.onclick = () => {
          if (item.qty > 1) {
            item.qty--;
            qtyVal.textContent = item.qty;
            priceVal.textContent = formatMoney(item.unitPrice * item.qty);
            updateCalculations();
          }
        };
      }

      if (plusBtn) {
        plusBtn.onclick = () => {
          item.qty++;
          qtyVal.textContent = item.qty;
          priceVal.textContent = formatMoney(item.unitPrice * item.qty);
          updateCalculations();
        };
      }

      if (removeBtn) {
        removeBtn.onclick = () => {
          card.classList.add('removing');
          setTimeout(() => {
            card.remove();
            cart = cart.filter(i => i.id !== itemId);
            updateCalculations();
          }, 250);
        };
      }
    });
  }

  function applyPromo(code) {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;

    if (normalized === 'GOAT10') {
      appliedDiscount = 10;
      appliedPromoCode = 'GOAT10';
      promoMsg.className = 'promo-msg success';
      promoMsg.textContent = 'Promo code GOAT10 applied! (10% discount)';
      promoInput.value = 'GOAT10';
      updateCalculations();
    } else if (normalized === 'GOAT20') {
      appliedDiscount = 20;
      appliedPromoCode = 'GOAT20';
      promoMsg.className = 'promo-msg success';
      promoMsg.textContent = 'Promo code GOAT20 applied! (20% discount)';
      promoInput.value = 'GOAT20';
      updateCalculations();
    } else {
      promoMsg.className = 'promo-msg error';
      promoMsg.textContent = 'Invalid promo code. Please try again.';
    }
  }

  if (btnPromoApply && promoInput) {
    btnPromoApply.addEventListener('click', () => {
      applyPromo(promoInput.value);
    });

    promoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPromo(promoInput.value);
      }
    });
  }

  if (promoHint) {
    promoHint.addEventListener('click', () => {
      if (promoInput) promoInput.value = 'GOAT10';
      applyPromo('GOAT10');
    });
  }

  function refreshCartFromStore() {
    loadCartData();
    renderCartItems();
    updateCalculations();
  }

  window.addEventListener('cart_updated', refreshCartFromStore);
  window.addEventListener('products_updated', refreshCartFromStore);
  window.addEventListener('storage', (e) => {
    if (e.key === 'goat_cart_items' || e.key === 'goat_products') {
      refreshCartFromStore();
    }
  });

  function updateOwnerButton() {
    const ownerNavBtn = document.getElementById('ownerNavBtn') || document.querySelector('.owner-nav-btn');
    if (ownerNavBtn) {
      const isOwner = (typeof GoatDB !== 'undefined' && typeof GoatDB.getOwnerSession === 'function' && GoatDB.getOwnerSession()) || localStorage.getItem('goat_owner_auth');
      if (isOwner) {
        ownerNavBtn.classList.add('is-visible');
        ownerNavBtn.style.display = 'inline-flex';
      } else {
        ownerNavBtn.classList.remove('is-visible');
        ownerNavBtn.style.display = 'none';
      }
    }
  }

  renderCartItems();
  updateCalculations();
  updateOwnerButton();
});
