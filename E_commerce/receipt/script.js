document.addEventListener('DOMContentLoaded', () => {
  const btnPrintReceipt = document.getElementById('btnPrintReceipt');
  const receiptDate = document.getElementById('receiptDate');
  const receiptPurchaseNumber = document.getElementById('receiptPurchaseNumber');
  const receiptPaymentMethod = document.getElementById('receiptPaymentMethod');
  const receiptTotalVal = document.getElementById('receiptTotalVal');

  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => {
      window.print();
    });
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    
    const methodParam = urlParams.get('method') || localStorage.getItem('goat_last_payment_method');
    if (methodParam) {
      if (methodParam.toLowerCase().includes('wallet')) {
        receiptPaymentMethod.textContent = 'Mobile Wallet';
      } else if (methodParam.toLowerCase().includes('cash')) {
        receiptPaymentMethod.textContent = 'Cash on Pickup';
      } else if (methodParam.toLowerCase().includes('card')) {
        receiptPaymentMethod.textContent = 'Card';
      } else {
        receiptPaymentMethod.textContent = methodParam;
      }
    }

    const purchaseParam = urlParams.get('order') || urlParams.get('purchase');
    if (purchaseParam) {
      receiptPurchaseNumber.textContent = purchaseParam;
    }

    const dateParam = urlParams.get('date');
    if (dateParam) {
      receiptDate.textContent = dateParam;
    }

    const totalParam = urlParams.get('total');
    if (totalParam) {
      receiptTotalVal.textContent = totalParam.startsWith('LE') ? totalParam : `LE ${totalParam}`;
    }
  } catch (err) {
    console.warn('Could not read custom order data:', err);
  }

  function renderReceiptItems() {
    const itemsListEl = document.querySelector('.items-list');
    if (!itemsListEl) return;

    let items = [];
    try {
      const lastOrder = localStorage.getItem('goat_last_order');
      if (lastOrder) {
        items = JSON.parse(lastOrder);
      } else if (typeof GoatDB !== 'undefined') {
        items = GoatDB.getCart();
      } else {
        const saved = localStorage.getItem('goat_cart_items');
        items = saved ? JSON.parse(saved) : [];
      }
    } catch (e) {
      items = [];
    }

    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    let subtotal = 0;
    itemsListEl.innerHTML = items.map(item => {
      const prod = (typeof GoatDB !== 'undefined') ? GoatDB.getProductById(item.id) : null;
      const imgUrl = item.imageUrl || (prod && prod.imageUrl) || '';
      const iconType = item.iconType || (prod && prod.iconType) || 'shirt';
      const itemCost = (parseFloat(item.unitPrice) || 0) * (parseInt(item.qty, 10) || 1);
      subtotal += itemCost;

      let visualHtml = '';
      if (imgUrl) {
        const resolvedImg = (typeof GoatDB !== 'undefined') ? GoatDB.normalizeImageUrl(imgUrl) : imgUrl;
        visualHtml = `<img src="${resolvedImg}" alt="${item.title}" class="receipt-item-img" onerror="this.onerror=null; this.parentElement.innerHTML='${(typeof GoatDB !== 'undefined' ? GoatDB.renderIcon(iconType) : '').replace(/"/g, '&quot;')}';">`;
      } else if (typeof GoatDB !== 'undefined') {
        visualHtml = GoatDB.renderIcon(iconType);
      } else {
        visualHtml = `
          <svg class="item-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
          </svg>
        `;
      }

      return `
        <div class="item-card">
          <div class="item-icon-box">
            ${visualHtml}
          </div>
          <div class="item-details">
            <h4 class="item-name">${item.title}</h4>
            <span class="item-desc">Size ${item.size || 'M'} · Qty ${item.qty || 1}</span>
          </div>
          <div class="item-amount">LE ${itemCost.toFixed(2)}</div>
        </div>
      `;
    }).join('');

    const tax = subtotal > 0 ? 50.00 : 0;
    const total = subtotal + tax;

    const priceVals = document.querySelectorAll('.prices-group .price-val');
    if (priceVals.length >= 2) {
      priceVals[0].textContent = `LE ${subtotal.toFixed(2)}`;
      priceVals[1].textContent = `LE ${tax.toFixed(2)}`;
    }

    if (receiptTotalVal && !urlParams.get('total')) {
      receiptTotalVal.textContent = `LE ${total.toFixed(2)}`;
    }
  }

  renderReceiptItems();
});
