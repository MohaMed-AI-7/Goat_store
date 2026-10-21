document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-pill');
  const tabContents = document.querySelectorAll('.tab-content');
  const profileForm = document.getElementById('profileForm');
  const saveStatusFeedback = document.getElementById('saveStatusFeedback');
  const btnSignOut = document.getElementById('btnSignOut');
  
  const inputFullName = document.getElementById('fullName');
  const inputEmail = document.getElementById('profileEmail');
  const inputPhone = document.getElementById('profilePhone');
  const inputPreferredSize = document.getElementById('preferredSize');

  const modalOverlay = document.getElementById('interactiveModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  const btnActionCard = document.getElementById('btnActionCard');
  const btnActionStore = document.getElementById('btnActionStore');
  const btnActionWishlist = document.getElementById('btnActionWishlist');
  const pickupSubcard = document.getElementById('pickupSubcard');
  const supportSubcard = document.getElementById('supportSubcard');
  const helpLink = document.getElementById('helpLink');
  const trackLink = document.getElementById('trackLink');

  function switchTab(targetTabId) {
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === `tab-${targetTabId}`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    if (history.replaceState) {
      history.replaceState(null, null, `#${targetTabId}`);
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  const hash = window.location.hash.replace('#', '').toLowerCase();
  const validTabs = ['orders', 'profile', 'saved'];
  if (validTabs.includes(hash)) {
    switchTab(hash);
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && validTabs.includes(tabParam.toLowerCase())) {
      switchTab(tabParam.toLowerCase());
    }
  }

  const STORAGE_KEY = 'goat_user_profile_data';

  function loadProfileData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.fullName && inputFullName) inputFullName.value = parsed.fullName;
        if (parsed.email && inputEmail) inputEmail.value = parsed.email;
        if (parsed.phone && inputPhone) inputPhone.value = parsed.phone;
        if (parsed.preferredSize && inputPreferredSize) inputPreferredSize.value = parsed.preferredSize;
      } catch (e) {
        console.error('Error loading stored profile data', e);
      }
    } else if (typeof window.USER_CREDENTIALS !== 'undefined') {
      const u = window.USER_CREDENTIALS;
      if (inputFullName) inputFullName.value = u.displayName || 'Mohamed Ali';
      if (inputEmail) inputEmail.value = u.email || 'user@goat.com';
      if (inputPhone) inputPhone.value = u.phone || '+20 100 123 4567';
      if (inputPreferredSize) inputPreferredSize.value = u.preferredSize || 'L - Men';
    }
  }

  loadProfileData();

  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const profileData = {
        fullName: inputFullName.value.trim(),
        email: inputEmail.value.trim(),
        phone: inputPhone.value.trim(),
        preferredSize: inputPreferredSize.value.trim()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));

      if (saveStatusFeedback) {
        saveStatusFeedback.style.display = 'flex';
        saveStatusFeedback.style.opacity = '1';
        saveStatusFeedback.innerHTML = '<span>Changes saved ✓</span>';

        setTimeout(() => {
          saveStatusFeedback.style.opacity = '0.9';
        }, 2500);
      }
    });
  }

  let currentModalAction = null;

  function showModal(title, description, onConfirm = null, confirmText = 'OK') {
    modalTitle.textContent = title;
    modalDesc.innerHTML = description;
    modalConfirmBtn.textContent = confirmText;
    currentModalAction = onConfirm;

    modalOverlay.classList.add('open');
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    currentModalAction = null;
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => {
      if (typeof currentModalAction === 'function') {
        currentModalAction();
      }
      closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  if (btnActionCard) {
    btnActionCard.addEventListener('click', () => {
      showModal(
        'Add Payment Card',
        'Secure card integration is enabled. Enter your debit/credit card details to save for instant 1-tap checkout next time.',
        () => {
          alert('Card vault updated successfully.');
        },
        'Add Card'
      );
    });
  }

  if (btnActionStore) {
    btnActionStore.addEventListener('click', () => {
      showModal(
        'Add Pickup Store',
        'Select your preferred GOAT branch:<br><br><strong>• GOAT Store Mall of Egypt</strong><br><strong>• GOAT Store Cairo Festival City</strong><br><strong>• GOAT Store Alexandria City Centre</strong>',
        () => {
          alert('Default pickup store saved.');
        },
        'Save Store'
      );
    });
  }

  if (btnActionWishlist) {
    btnActionWishlist.addEventListener('click', () => {
      showModal(
        'My Wishlist',
        'Your wishlist is synced with your account. You have saved <strong>4 items</strong> to monitor for restocks.',
        () => {
          window.location.href = '../index.html';
        },
        'Browse Items'
      );
    });
  }

  if (pickupSubcard) {
    pickupSubcard.addEventListener('click', () => {
      showModal(
        'Store Pickup Information',
        'Your recent order is prepared and ready for collection at <strong>Store #04 — Downtown Cairo</strong>.<br><br>Store Hours: 10:00 AM – 11:00 PM.',
        null,
        'Got It'
      );
    });
  }

  if (supportSubcard) {
    supportSubcard.addEventListener('click', () => {
      showModal(
        'GOAT Support Team',
        'Need help with your order or sizing?<br><br>• Phone: +20 107 447 3660<br>• Email: support@goatstore.com<br>• Live chat: Available 24/7.',
        null,
        'Close'
      );
    });
  }

  if (btnSignOut) {
    btnSignOut.addEventListener('click', () => {
      showModal(
        'Sign Out',
        'Are you sure you want to sign out from your GOAT account?',
        () => {
          localStorage.removeItem('goat_user_session');
          window.location.href = '../login/login.html';
        },
        'Sign Out'
      );
    });
  }

  if (helpLink) {
    helpLink.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('Help & FAQ', 'Find answers about delivery timelines, authenticity verification, and our 14-day hassle-free returns policy.', null, 'Close');
    });
  }

  if (trackLink) {
    trackLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('orders');
    });
  }

  function renderAccountOrders() {
    const ordersGroup = document.querySelector('.order-items-group');
    if (!ordersGroup) return;

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

    if (!Array.isArray(items) || items.length === 0) return;

    let subtotal = 0;
    ordersGroup.innerHTML = items.map(item => {
      const prod = (typeof GoatDB !== 'undefined') ? GoatDB.getProductById(item.id) : null;
      const imgUrl = item.imageUrl || (prod && prod.imageUrl) || '';
      const iconType = item.iconType || (prod && prod.iconType) || 'shirt';
      const itemCost = (parseFloat(item.unitPrice) || 0) * (parseInt(item.qty, 10) || 1);
      subtotal += itemCost;

      let visualHtml = '';
      if (imgUrl) {
        const resolvedImg = (typeof GoatDB !== 'undefined') ? GoatDB.normalizeImageUrl(imgUrl) : imgUrl;
        visualHtml = `<img src="${resolvedImg}" alt="${item.title}" class="order-item-img" onerror="this.onerror=null; this.parentElement.innerHTML='${(typeof GoatDB !== 'undefined' ? GoatDB.renderIcon(iconType) : '').replace(/"/g, '&quot;')}';">`;
      } else if (typeof GoatDB !== 'undefined') {
        visualHtml = GoatDB.renderIcon(iconType);
      } else {
        visualHtml = `
          <svg class="product-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
          </svg>
        `;
      }

      return `
        <div class="order-product-row">
          <div class="product-icon-wrap">
            ${visualHtml}
          </div>
          <div class="product-text-meta">
            <div class="product-name">${item.title}</div>
            <div class="product-variant">Size ${item.size || 'M'} · Qty ${item.qty || 1}</div>
          </div>
          <div class="product-price">LE ${itemCost.toFixed(2)}</div>
        </div>
      `;
    }).join('');

    const orderTotalAmount = document.querySelector('.order-total-amount');
    if (orderTotalAmount) {
      const tax = subtotal > 0 ? 50.00 : 0;
      orderTotalAmount.textContent = `LE ${(subtotal + tax).toFixed(2)}`;
    }
  }

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

  updateOwnerButton();
  renderAccountOrders();
});
