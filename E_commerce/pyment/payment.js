document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button, .tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel, .tab-content');
  const actionButton = document.getElementById('actionButton');
  
  const cardNumberInput = document.getElementById('cardNumberInput');
  const cardNameInput = document.getElementById('cardNameInput');
  const cardExpiryInput = document.getElementById('cardExpiryInput');
  const cardCvvInput = document.getElementById('cardCvvInput');
  
  const vcNumber = document.getElementById('vcNumber');
  const vcHolder = document.getElementById('vcHolder');
  const vcExpiry = document.getElementById('vcExpiry');
  
  const successModal = document.getElementById('successModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMsg = document.getElementById('modalMsg');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  let currentMethod = 'card';
  let currentTotal = '800.00';

  function renderOrderSummary() {
    const itemsGroup = document.querySelector('.items-group');
    if (!itemsGroup) return;

    let cart = [];
    if (typeof GoatDB !== 'undefined') {
      cart = GoatDB.getCart();
    } else {
      try {
        const saved = localStorage.getItem('goat_cart_items');
        cart = saved ? JSON.parse(saved) : [];
      } catch (e) {
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
          unitPrice: 660.00,
          qty: 1,
          imageUrl: p1 ? p1.imageUrl : '',
          iconType: 'jersey-v'
        },
        {
          id: 'training-shorts-navy',
          title: 'Training Shorts — Navy',
          size: 'M',
          unitPrice: 90.00,
          qty: 1,
          imageUrl: p2 ? p2.imageUrl : '',
          iconType: 'shorts'
        }
      ];
    }

    let subtotal = 0;
    itemsGroup.innerHTML = cart.map(item => {
      const prod = (typeof GoatDB !== 'undefined') ? GoatDB.getProductById(item.id) : null;
      const imgUrl = item.imageUrl || (prod && prod.imageUrl) || '';
      const iconType = item.iconType || (prod && prod.iconType) || 'shirt';
      const itemCost = (parseFloat(item.unitPrice) || 0) * (parseInt(item.qty, 10) || 1);
      subtotal += itemCost;

      let visualHtml = '';
      if (imgUrl) {
        const resolvedImg = (typeof GoatDB !== 'undefined') ? GoatDB.normalizeImageUrl(imgUrl) : imgUrl;
        visualHtml = `<img src="${resolvedImg}" alt="${item.title}" class="summary-item-img" onerror="this.onerror=null; this.parentElement.innerHTML='${(typeof GoatDB !== 'undefined' ? GoatDB.renderIcon(iconType) : '').replace(/"/g, '&quot;')}';">`;
      } else if (typeof GoatDB !== 'undefined') {
        visualHtml = GoatDB.renderIcon(iconType);
      } else {
        visualHtml = `
          <svg class="shirt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
          </svg>
        `;
      }

      return `
        <div class="item-row" data-id="${item.id}">
          <div class="item-icon-wrap">
            ${visualHtml}
          </div>
          <div class="item-meta">
            <div class="item-title">${item.title}</div>
            <div class="item-sub">Size ${item.size || 'M'} · Qty ${item.qty || 1}</div>
          </div>
          <div class="item-cost">LE ${itemCost.toFixed(2)}</div>
        </div>
      `;
    }).join('');

    const tax = subtotal > 0 ? 50.00 : 0;
    const total = subtotal + tax;
    currentTotal = total.toFixed(2);
    localStorage.setItem('goat_cart_total', currentTotal);

    const priceLines = document.querySelectorAll('.prices-group .price-line span:last-child');
    if (priceLines.length >= 2) {
      priceLines[0].textContent = `LE ${subtotal.toFixed(2)}`;
      priceLines[1].textContent = `LE ${tax.toFixed(2)}`;
    }

    const totalValEl = document.querySelector('.total-val');
    if (totalValEl) {
      totalValEl.textContent = `LE ${currentTotal}`;
    }

    if (actionButton && currentMethod !== 'cash') {
      actionButton.textContent = `Pay LE ${currentTotal}`;
    }
  }

  function switchPaymentMethod(method) {
    currentMethod = method;

    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-method') === method;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    tabPanels.forEach(panel => {
      const isTarget = panel.id === `panel-${method}`;
      panel.classList.toggle('active', isTarget);
    });

    if (method === 'cash') {
      actionButton.textContent = 'Confirm order';
    } else {
      actionButton.textContent = `Pay LE ${currentTotal}`;
    }
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const method = button.getAttribute('data-method');
      switchPaymentMethod(method);
    });
  });

  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 16) value = value.slice(0, 16);

      const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
      e.target.value = formatted;

      if (vcNumber) {
        if (!value) {
          vcNumber.textContent = '•••• •••• •••• ••••';
        } else {
          let displayStr = '';
          for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 === 0) displayStr += ' ';
            displayStr += (i < value.length) ? value[i] : '•';
          }
          vcNumber.textContent = displayStr;
        }
      }
    });
  }

  if (cardNameInput) {
    cardNameInput.addEventListener('input', (e) => {
      const value = e.target.value.trim();
      if (vcHolder) {
        vcHolder.textContent = value.length > 0 ? value.toUpperCase() : 'FULL NAME';
      }
    });
  }

  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);

      if (value.length >= 3) {
        e.target.value = `${value.slice(0, 2)} / ${value.slice(2)}`;
      } else if (value.length >= 2) {
        e.target.value = `${value.slice(0, 2)} / `;
      } else {
        e.target.value = value;
      }

      if (vcExpiry) {
        if (!value) {
          vcExpiry.textContent = 'MM / YY';
        } else if (value.length <= 2) {
          vcExpiry.textContent = `${value.padEnd(2, '•')} / YY`;
        } else {
          vcExpiry.textContent = `${value.slice(0, 2)} / ${value.slice(2).padEnd(2, '•')}`;
        }
      }
    });
  }

  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
  }

  if (actionButton) {
    actionButton.addEventListener('click', () => {
      localStorage.setItem('goat_last_payment_method', currentMethod);
      
      let cartToSave = [];
      if (typeof GoatDB !== 'undefined') {
        cartToSave = GoatDB.getCart();
      } else {
        try {
          cartToSave = JSON.parse(localStorage.getItem('goat_cart_items') || '[]');
        } catch (e) {
          cartToSave = [];
        }
      }
      localStorage.setItem('goat_last_order', JSON.stringify(cartToSave));
      localStorage.setItem('goat_last_order_total', currentTotal);

      if (currentMethod === 'card') {
        modalTitle.textContent = 'Payment Completed!';
        modalMsg.textContent = `Your card payment of LE ${currentTotal} has been successfully processed.`;
      } else if (currentMethod === 'wallet') {
        modalTitle.textContent = 'Request Sent!';
        modalMsg.textContent = `Please check your phone to approve the mobile wallet transaction of LE ${currentTotal}.`;
      } else if (currentMethod === 'cash') {
        modalTitle.textContent = 'Order Confirmed!';
        modalMsg.textContent = `Your order is confirmed! Please pay LE ${currentTotal} when collecting your items from the store within 24 hours.`;
      }

      if (successModal) {
        successModal.classList.add('open');
      }
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      if (successModal) successModal.classList.remove('open');
    });
  }

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('open');
      }
    });
  }

  window.addEventListener('cart_updated', renderOrderSummary);
  window.addEventListener('products_updated', renderOrderSummary);
  window.addEventListener('storage', (e) => {
    if (e.key === 'goat_cart_items' || e.key === 'goat_products') {
      renderOrderSummary();
    }
  });

  renderOrderSummary();
});
