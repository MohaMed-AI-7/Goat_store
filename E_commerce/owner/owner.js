document.addEventListener('DOMContentLoaded', () => {
  let currentOwner = GoatDB.getOwnerSession();

  if (!currentOwner) {
    window.location.href = './login.html';
    return;
  }

  const ownerNameEl = document.getElementById('ownerNameEl');
  const ownerAvatarEl = document.getElementById('ownerAvatarEl');
  if (ownerNameEl && currentOwner) {
    ownerNameEl.textContent = currentOwner.name || 'Store Owner';
  }
  if (ownerAvatarEl && currentOwner) {
    const initial = (currentOwner.name || 'O').charAt(0).toUpperCase();
    ownerAvatarEl.textContent = initial;
  }

  const totalItemsEl = document.getElementById('totalItemsEl');
  const lowStockEl = document.getElementById('lowStockEl');
  const outOfStockEl = document.getElementById('outOfStockEl');

  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categorySelect');
  const productsTableBody = document.getElementById('productsTableBody');
  const emptyStateEl = document.getElementById('emptyStateEl');

  const btnAddNewItem = document.getElementById('btnAddNewItem');
  const productModal = document.getElementById('productModal');
  const modalTitle = document.getElementById('modalTitle');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const productForm = document.getElementById('productForm');

  const inputProductId = document.getElementById('inputProductId');
  const inputProductName = document.getElementById('inputProductName');
  const selectCategory = document.getElementById('selectCategory');
  const selectBrand = document.getElementById('selectBrand');
  const inputPrice = document.getElementById('inputPrice');
  const inputStock = document.getElementById('inputStock');
  const selectBadge = document.getElementById('selectBadge');
  const selectIconType = document.getElementById('selectIconType');
  const inputImageUrl = document.getElementById('inputImageUrl');
  const inputImageFile = document.getElementById('inputImageFile');
  const uploadDropZone = document.getElementById('uploadDropZone');
  const dropZoneEmpty = document.getElementById('dropZoneEmpty');
  const dropZonePreview = document.getElementById('dropZonePreview');
  const imagePreviewEl = document.getElementById('imagePreviewEl');
  const previewFileName = document.getElementById('previewFileName');
  const previewFileSize = document.getElementById('previewFileSize');
  const btnBrowseFile = document.getElementById('btnBrowseFile');
  const btnChangeImage = document.getElementById('btnChangeImage');
  const btnRemoveImage = document.getElementById('btnRemoveImage');
  const inputDescription = document.getElementById('inputDescription');

  let currentUploadedImageData = '';

  const btnLogout = document.getElementById('btnLogout');
  const toastContainer = document.getElementById('toastContainer');

  let currentFilter = {
    search: '',
    category: 'all'
  };

  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success' ? '<path d="M20 6L9 17l-5-5"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function updateStats() {
    const stats = GoatDB.getStats();
    if (totalItemsEl) totalItemsEl.textContent = stats.total;
    if (lowStockEl) lowStockEl.textContent = stats.lowStock;
    if (outOfStockEl) outOfStockEl.textContent = stats.outOfStock;
  }

  function renderStatusBadge(product) {
    const stock = parseInt(product.stock, 10) || 0;
    if (stock === 0 || product.status === 'Out of stock') {
      return `<span class="status-badge out-of-stock">Out of stock</span>`;
    }
    if (stock <= 5 || product.status === 'Low stock') {
      return `<span class="status-badge low-stock">Low stock</span>`;
    }
    return `<span class="status-badge live">Live</span>`;
  }

  function renderProducts() {
    const allProducts = GoatDB.getProducts();

    const filtered = allProducts.filter(p => {
      const matchesSearch = !currentFilter.search || 
        p.name.toLowerCase().includes(currentFilter.search.toLowerCase()) ||
        p.category.toLowerCase().includes(currentFilter.search.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(currentFilter.search.toLowerCase()));

      const matchesCat = currentFilter.category === 'all' || p.category.toLowerCase() === currentFilter.category.toLowerCase();

      return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
      productsTableBody.innerHTML = '';
      if (emptyStateEl) emptyStateEl.style.display = 'block';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';

    productsTableBody.innerHTML = filtered.map(p => {
      let visualHtml = '';
      if (p.imageUrl) {
        visualHtml = `<img src="${p.imageUrl}" alt="${p.name}" onerror="this.onerror=null; this.parentElement.innerHTML='${GoatDB.renderIcon(p.iconType || 'shirt').replace(/"/g, '&quot;')}';">`;
      } else {
        visualHtml = GoatDB.renderIcon(p.iconType || 'shirt');
      }

      return `
        <tr data-id="${p.id}">
          <td>
            <div class="item-cell">
              <div class="item-icon-box">
                ${visualHtml}
              </div>
              <div class="item-info">
                <div class="item-name">${p.name}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="item-category">${p.category}</span>
          </td>
          <td>
            <span class="item-price">${GoatDB.formatPrice(p.price)}</span>
          </td>
          <td>
            <span class="item-stock">${p.stock}</span>
          </td>
          <td>
            ${renderStatusBadge(p)}
          </td>
          <td>
            <div class="actions-cell">
              <button class="btn-action edit" data-action="edit" data-id="${p.id}">Edit</button>
              <button class="btn-action delete" data-action="delete" data-id="${p.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    updateStats();
  }

  function processAndCompressImage(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, GIF)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const MAX_DIM = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        currentUploadedImageData = compressedDataUrl;
        imagePreviewEl.src = compressedDataUrl;
        previewFileName.textContent = file.name || 'uploaded-item.jpg';
        const sizeKb = Math.round((compressedDataUrl.length * 0.75) / 1024);
        previewFileSize.textContent = `Optimized from device (${sizeKb} KB)`;

        dropZoneEmpty.style.display = 'none';
        dropZonePreview.style.display = 'flex';
        inputImageUrl.value = '';
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function clearImageUpload() {
    currentUploadedImageData = '';
    if (inputImageFile) inputImageFile.value = '';
    if (imagePreviewEl) imagePreviewEl.src = '';
    if (dropZonePreview) dropZonePreview.style.display = 'none';
    if (dropZoneEmpty) dropZoneEmpty.style.display = 'flex';
    if (inputImageUrl) inputImageUrl.value = '';
  }

  function triggerFileInput(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (inputImageFile) inputImageFile.click();
  }

  if (uploadDropZone) {
    uploadDropZone.addEventListener('click', (e) => {
      if (e.target.closest('#btnRemoveImage') || e.target.closest('#btnChangeImage')) return;
      if (!currentUploadedImageData && !imagePreviewEl.src) {
        triggerFileInput(e);
      }
    });

    uploadDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropZone.classList.add('drag-over');
    });

    uploadDropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadDropZone.classList.remove('drag-over');
    });

    uploadDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropZone.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        processAndCompressImage(e.dataTransfer.files[0]);
      }
    });
  }

  if (btnBrowseFile) {
    btnBrowseFile.addEventListener('click', triggerFileInput);
  }

  if (btnChangeImage) {
    btnChangeImage.addEventListener('click', triggerFileInput);
  }

  if (btnRemoveImage) {
    btnRemoveImage.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearImageUpload();
    });
  }

  if (inputImageFile) {
    inputImageFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processAndCompressImage(e.target.files[0]);
      }
    });
  }

  if (inputImageUrl) {
    inputImageUrl.addEventListener('input', () => {
      const url = inputImageUrl.value.trim();
      if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('../') || url.startsWith('./'))) {
        currentUploadedImageData = '';
        imagePreviewEl.src = url;
        previewFileName.textContent = 'Linked from Web URL';
        previewFileSize.textContent = 'Ready to save';
        dropZoneEmpty.style.display = 'none';
        dropZonePreview.style.display = 'flex';
      } else if (!url && !currentUploadedImageData) {
        clearImageUpload();
      }
    });
  }

  function openAddModal() {
    productForm.reset();
    inputProductId.value = '';
    modalTitle.textContent = 'Add New Product';
    clearImageUpload();
    
    const sizeM = document.querySelector('input[name="sizes"][value="M"]');
    if (sizeM) sizeM.checked = true;

    productModal.classList.add('active');
    inputProductName.focus();
  }

  function openEditModal(productId) {
    const product = GoatDB.getProductById(productId);
    if (!product) return;

    inputProductId.value = product.id;
    inputProductName.value = product.name;
    selectCategory.value = product.category;
    selectBrand.value = product.brand || 'Nike';
    inputPrice.value = product.price;
    inputStock.value = product.stock;
    selectBadge.value = product.badge || '';
    selectIconType.value = product.iconType || 'shirt';
    inputDescription.value = product.description || '';

    clearImageUpload();
    if (product.imageUrl) {
      currentUploadedImageData = product.imageUrl;
      imagePreviewEl.src = product.imageUrl;
      previewFileName.textContent = product.name;
      previewFileSize.textContent = product.imageUrl.startsWith('data:') ? 'Custom uploaded image' : 'Web URL image';
      dropZoneEmpty.style.display = 'none';
      dropZonePreview.style.display = 'flex';
      if (!product.imageUrl.startsWith('data:')) {
        inputImageUrl.value = product.imageUrl;
      }
    }

    const sizeCheckboxes = document.querySelectorAll('input[name="sizes"]');
    sizeCheckboxes.forEach(cb => {
      cb.checked = (product.sizes || []).includes(cb.value);
    });

    modalTitle.textContent = 'Edit Product';
    productModal.classList.add('active');
  }

  function closeModal() {
    productModal.classList.remove('active');
  }

  productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = inputProductName.value.trim();
    const price = parseFloat(inputPrice.value);
    const stock = parseInt(inputStock.value, 10);

    if (!name) {
      showToast('Please enter product name', 'error');
      return;
    }

    if (isNaN(price) || price < 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      showToast('Please enter a valid stock number', 'error');
      return;
    }

    const selectedSizes = Array.from(document.querySelectorAll('input[name="sizes"]:checked')).map(cb => cb.value);

    const finalImageUrl = currentUploadedImageData || inputImageUrl.value.trim();

    const productPayload = {
      id: inputProductId.value || undefined,
      name: name,
      category: selectCategory.value,
      brand: selectBrand.value,
      price: price,
      stock: stock,
      badge: selectBadge.value,
      iconType: selectIconType.value,
      imageUrl: finalImageUrl,
      description: inputDescription.value.trim(),
      sizes: selectedSizes.length > 0 ? selectedSizes : ['M']
    };

    const isEdit = !!inputProductId.value;
    GoatDB.saveProduct(productPayload);

    closeModal();
    renderProducts();

    showToast(
      isEdit ? `Updated "${name}" successfully.` : `Added "${name}"! It is now live in the store.`,
      'success'
    );
  });

  productsTableBody.addEventListener('click', (e) => {
    const target = e.target.closest('button[data-action]');
    if (!target) return;

    const action = target.getAttribute('data-action');
    const productId = target.getAttribute('data-id');

    if (action === 'edit') {
      openEditModal(productId);
    } else if (action === 'delete') {
      const product = GoatDB.getProductById(productId);
      if (!product) return;

      const confirmed = confirm(`Are you sure you want to delete "${product.name}" from your store?`);
      if (confirmed) {
        GoatDB.deleteProduct(productId);
        renderProducts();
        showToast(`Deleted "${product.name}" from the store.`, 'success');
      }
    }
  });

  searchInput.addEventListener('input', (e) => {
    currentFilter.search = e.target.value.trim();
    renderProducts();
  });

  categorySelect.addEventListener('change', (e) => {
    currentFilter.category = e.target.value;
    renderProducts();
  });

  btnAddNewItem.addEventListener('click', openAddModal);
  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);

  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
      closeModal();
    }
  });

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      GoatDB.logoutOwner();
      window.location.href = './login.html';
    });
  }

  window.addEventListener('goat_store_sync', () => {
    renderProducts();
  });

  renderProducts();
  updateStats();
});
