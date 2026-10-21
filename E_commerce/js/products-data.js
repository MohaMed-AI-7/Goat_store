const STORAGE_KEYS = {
  PRODUCTS: 'goat_products',
  CART: 'goat_cart_items',
  OWNER_AUTH: 'goat_owner_auth',
  OWNER_ACCOUNTS: 'goat_owner_accounts'
};

const DEFAULT_PRODUCTS = [
  {
    id: 'portugal-special-kit-2025',
    name: 'Portugal Special Kit 2025',
    category: 'Club Shirts',
    brand: 'Nike',
    price: 750.00,
    stock: 24,
    status: 'Live',
    badge: 'SALE',
    sizes: ['M', 'L', 'XL'],
    iconType: 'jersey',
    imageUrl: '',
    description: 'Official Portugal Special Kit 2025 Edition with authentic breathable fabric.'
  },
  {
    id: 'real-madrid-2026-home-shirt',
    name: 'Real Madrid 2026 Home Shirt',
    category: 'Club Shirts',
    brand: 'Adidas',
    price: 660.00,
    stock: 12,
    status: 'Live',
    badge: 'NEW',
    sizes: ['S', 'M', 'L'],
    iconType: 'jersey-v',
    imageUrl: '',
    description: 'Real Madrid 2026 Home Shirt with royal crest and moisture-wicking technology.'
  },
  {
    id: 'nike-pro-long-sleeve-compression',
    name: 'Nike Pro Long Sleeve Compression Shirt',
    category: 'Tracksuits',
    brand: 'Nike',
    price: 600.00,
    stock: 5,
    status: 'Low stock',
    badge: '',
    sizes: ['M', 'L'],
    iconType: 'shirt',
    imageUrl: '',
    description: 'Nike Pro Dri-FIT tight compression fit shirt for intense training sessions.'
  },
  {
    id: 'nike-mercurial-football-boots',
    name: 'Nike Mercurial Football Boots',
    category: 'Football Shoes',
    brand: 'Nike',
    price: 1450.00,
    stock: 8,
    status: 'Live',
    badge: '',
    sizes: ['M', 'L', 'XL'],
    iconType: 'boots',
    imageUrl: '',
    description: 'High-speed traction soccer cleats designed for quick acceleration.'
  },
  {
    id: 'adidas-essentials-backpack',
    name: 'Adidas Essentials Backpack',
    category: 'Bags',
    brand: 'Adidas',
    price: 890.00,
    stock: 0,
    status: 'Out of stock',
    badge: '',
    sizes: ['M'],
    iconType: 'backpack',
    imageUrl: '',
    description: 'Durable multi-compartment backpack with padded shoulder straps.'
  },
  {
    id: 'training-shorts-navy',
    name: 'Training Shorts — Navy',
    category: 'Shorts',
    brand: 'Nike',
    price: 380.00,
    stock: 30,
    status: 'Live',
    badge: '',
    sizes: ['S', 'M', 'L', 'XL'],
    iconType: 'shorts',
    imageUrl: '',
    description: 'Lightweight and breathable navy workout shorts with secure waistband.'
  },
  {
    id: 'new-balance-550-sneakers',
    name: 'New Balance 550 Classic Sneakers',
    category: 'Sneakers',
    brand: 'New Balance',
    price: 950.00,
    stock: 4,
    status: 'Low stock',
    badge: 'NEW',
    sizes: ['M', 'L'],
    iconType: 'sneakers',
    imageUrl: '',
    description: 'Retro basketball silhouette with premium leather and heritage styling.'
  }
];

const PRODUCT_SVGS = {
  'shirt': `<svg viewBox="0 0 100 100" class="prod-svg-icon" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M30 18 L40 26 C46 30, 54 30, 60 26 L70 18 L90 32 L80 44 L72 38 L72 82 C72 85, 70 87, 67 87 L33 87 C30 87, 28 85, 28 82 L28 38 L20 44 L10 32 Z"/>
    <path d="M40 26 C46 32, 54 32, 60 26"/>
  </svg>`,
  'jersey-v': `<svg viewBox="0 0 100 100" class="prod-svg-icon" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M30 18 L40 25 L60 25 L70 18 L90 32 L81 44 L73 38 L73 82 C73 85, 71 87, 68 87 L32 87 C29 87, 27 85, 27 82 L27 38 L19 44 L10 32 Z"/>
    <path d="M38 25 L50 48 L62 25" stroke-width="2.5"/>
    <rect x="42" y="32" width="16" height="24" rx="2" stroke-width="2"/>
  </svg>`,
  'jersey': `<svg viewBox="0 0 100 100" class="prod-svg-icon" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M32 18 C40 23, 60 23, 68 18 L88 32 L79 43 L72 38 L72 82 C72 85, 70 87, 67 87 L33 87 C30 87, 28 85, 28 82 L28 38 L21 43 L12 32 Z"/>
    <path d="M38 19 C42 28, 58 28, 62 19"/>
    <path d="M44 48 L56 48"/>
  </svg>`,
  'boots': `<svg viewBox="0 0 100 100" class="prod-svg-icon" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 68 C16 68, 12 64, 12 58 C12 52, 18 48, 25 48 C30 48, 35 44, 42 38 C48 33, 56 30, 68 30 C76 30, 84 35, 87 43 C89 48, 88 56, 85 62 C81 67, 72 68, 62 68 Z"/>
    <path d="M20 68 L20 74 M36 68 L36 74 M52 68 L52 74 M68 68 L68 74 M80 68 L80 74"/>
  </svg>`,
  'backpack': `<svg viewBox="0 0 100 100" class="prod-svg-icon" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="26" y="28" width="48" height="56" rx="16"/>
    <path d="M38 28 V20 C38 16, 42 14, 50 14 C58 14, 62 16, 62 20 V28"/>
    <rect x="34" y="52" width="32" height="24" rx="6"/>
    <path d="M44 40 H56"/>
  </svg>`,
  'shorts': `<svg viewBox="0 0 100 100" class="prod-svg-icon" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M28 24 H72 L76 74 L54 74 L50 48 L46 74 L24 74 Z"/>
    <path d="M28 32 H72"/>
    <path d="M46 24 V32 M54 24 V32"/>
  </svg>`,
  'sneakers': `<svg viewBox="0 0 100 100" class="prod-svg-icon" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 66 C14 60, 20 54, 28 54 L44 48 C50 42, 60 34, 72 34 C82 34, 88 40, 88 48 C88 58, 84 66, 78 66 Z"/>
    <path d="M14 66 H82 V74 H14 Z"/>
    <path d="M38 50 L46 42 M48 52 L56 44 M58 54 L66 46"/>
  </svg>`
};

class GoatDataService {
  constructor() {
    this.initStore();
  }

  initStore() {
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!storedProducts) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }

    const storedOwners = localStorage.getItem(STORAGE_KEYS.OWNER_ACCOUNTS);
    if (!storedOwners) {
      const defaultOwners = [
        {
          name: 'Store Owner',
          email: 'owner@goat.com',
          password: 'owner123',
          storeName: 'GOAT Store',
          pin: 'GOAT-2026',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.OWNER_ACCOUNTS, JSON.stringify(defaultOwners));
    }

    const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (!storedCart) {
      const p1 = this.getProductById('real-madrid-2026-home-shirt') || {};
      const p2 = this.getProductById('training-shorts-navy') || {};
      const initialCart = [
        {
          id: 'real-madrid-2026-home-shirt',
          title: 'Real Madrid 2026 Home Shirt',
          size: 'M',
          color: 'White',
          unitPrice: 660.00,
          qty: 1,
          imageUrl: p1.imageUrl || '',
          iconType: p1.iconType || 'jersey-v'
        },
        {
          id: 'training-shorts-navy',
          title: 'Training Shorts — Navy',
          size: 'M',
          color: 'Navy',
          unitPrice: 380.00,
          qty: 1,
          imageUrl: p2.imageUrl || '',
          iconType: p2.iconType || 'shorts'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(initialCart));
    }
  }

  getProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
    } catch (e) {
      console.error('Error loading products:', e);
      return DEFAULT_PRODUCTS;
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  saveProduct(productData) {
    const products = this.getProducts();
    const stock = parseInt(productData.stock, 10) || 0;
    
    let status = 'Live';
    if (stock === 0) {
      status = 'Out of stock';
    } else if (stock <= 5) {
      status = 'Low stock';
    }

    const cleanProduct = {
      ...productData,
      price: parseFloat(productData.price) || 0,
      stock: stock,
      status: productData.status || status,
      sizes: Array.isArray(productData.sizes) ? productData.sizes : ['M'],
      badge: productData.badge || '',
      iconType: productData.iconType || 'shirt',
      imageUrl: productData.imageUrl || ''
    };

    if (cleanProduct.id) {
      const index = products.findIndex(p => p.id === cleanProduct.id);
      if (index !== -1) {
        products[index] = { ...products[index], ...cleanProduct };
      } else {
        products.push(cleanProduct);
      }
    } else {
      cleanProduct.id = 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
      products.unshift(cleanProduct);
    }

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    try {
      const storedCartStr = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCartStr) {
        let cartItems = JSON.parse(storedCartStr);
        let cartModified = false;
        cartItems.forEach(item => {
          if (item.id === cleanProduct.id) {
            item.title = cleanProduct.name;
            item.imageUrl = cleanProduct.imageUrl || '';
            item.iconType = cleanProduct.iconType || 'shirt';
            item.unitPrice = cleanProduct.price;
            cartModified = true;
          }
        });
        if (cartModified) {
          localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
          this.dispatchUpdate('cart_updated', cartItems);
        }
      }
    } catch (err) {
      console.warn('Error syncing cart with updated product:', err);
    }

    this.dispatchUpdate('products_updated', products);
    return cleanProduct;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.dispatchUpdate('products_updated', products);
    return true;
  }

  getStats() {
    const products = this.getProducts();
    const total = products.length;
    let lowStock = 0;
    let outOfStock = 0;

    products.forEach(p => {
      const stock = parseInt(p.stock, 10) || 0;
      if (stock === 0 || p.status === 'Out of stock') {
        outOfStock++;
      } else if (stock <= 5 || p.status === 'Low stock') {
        lowStock++;
      }
    });

    return { total, lowStock, outOfStock };
  }

  getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      let cart = data ? JSON.parse(data) : [];
      if (!Array.isArray(cart)) return [];

      let changed = false;
      const products = this.getProducts();
      cart.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (prod) {
          if (!item.imageUrl && prod.imageUrl) {
            item.imageUrl = prod.imageUrl;
            changed = true;
          }
          if (!item.iconType && prod.iconType) {
            item.iconType = prod.iconType;
            changed = true;
          }
        }
      });

      if (changed) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      }
      return cart;
    } catch (e) {
      return [];
    }
  }

  addToCart(product, size = 'M', qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(i => i.id === product.id && i.size === size);
    
    const prodImg = product.imageUrl || '';
    const prodIcon = product.iconType || 'shirt';

    if (existing) {
      existing.qty += qty;
      if (prodImg && !existing.imageUrl) {
        existing.imageUrl = prodImg;
      }
      if (prodIcon && !existing.iconType) {
        existing.iconType = prodIcon;
      }
    } else {
      cart.push({
        id: product.id,
        title: product.name,
        size: size,
        color: 'Default',
        unitPrice: parseFloat(product.price),
        qty: qty,
        imageUrl: prodImg,
        iconType: prodIcon
      });
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.dispatchUpdate('cart_updated', cart);
    return cart;
  }

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  }

  getOwnerAccounts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OWNER_ACCOUNTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  registerOwner(ownerData) {
    const owners = this.getOwnerAccounts();
    const existing = owners.find(o => o.email.toLowerCase() === ownerData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'This email is already registered as an owner.' };
    }

    const newOwner = {
      name: ownerData.name,
      email: ownerData.email.toLowerCase(),
      password: ownerData.password,
      storeName: ownerData.storeName || 'GOAT Store',
      pin: ownerData.pin || 'GOAT-2026',
      createdAt: new Date().toISOString()
    };

    owners.push(newOwner);
    localStorage.setItem(STORAGE_KEYS.OWNER_ACCOUNTS, JSON.stringify(owners));
    this.setOwnerSession(newOwner);
    return { success: true, owner: newOwner };
  }

  loginOwner(identifier, password) {
    const creds = (typeof window !== 'undefined' && window.OWNER_CREDENTIALS) ? window.OWNER_CREDENTIALS : null;
    if (creds) {
      const match = (
        (creds.username && identifier.toLowerCase() === creds.username.toLowerCase()) ||
        (creds.email && identifier.toLowerCase() === creds.email.toLowerCase())
      );
      if (match && password === creds.password) {
        const ownerObj = {
          name: creds.displayName || 'Store Owner',
          email: creds.email || 'owner@goat.com',
          storeName: creds.storeName || 'GOAT Store'
        };
        this.setOwnerSession(ownerObj);
        return { success: true, owner: ownerObj };
      }
    }

    const owners = this.getOwnerAccounts();
    const found = owners.find(o => 
      ((o.email && o.email.toLowerCase() === identifier.toLowerCase()) || 
       (o.name && o.name.toLowerCase() === identifier.toLowerCase())) && 
      o.password === password
    );

    if (found) {
      this.setOwnerSession(found);
      return { success: true, owner: found };
    }
    return { success: false, message: 'Invalid username/email or password.' };
  }

  setOwnerSession(owner) {
    const sessionData = {
      name: owner.name,
      email: owner.email,
      storeName: owner.storeName,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.OWNER_AUTH, JSON.stringify(sessionData));
  }

  getOwnerSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OWNER_AUTH);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  logoutOwner() {
    localStorage.removeItem(STORAGE_KEYS.OWNER_AUTH);
  }

  normalizeImageUrl(url) {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      return url;
    }
    const isSubfolder = /(cart|prodect|pyment|receipt|Account|owner|login)\//i.test(window.location.pathname);
    if (isSubfolder) {
      if (url.startsWith('./img/')) return '.' + url;
      if (url.startsWith('img/')) return '../' + url;
      if (url.startsWith('./design/')) return '.' + url;
      if (url.startsWith('design/')) return '../' + url;
      if (url.startsWith('./icon/')) return '.' + url;
      if (url.startsWith('icon/')) return '../' + url;
    }
    return url;
  }

  renderIcon(iconType) {
    return PRODUCT_SVGS[iconType] || PRODUCT_SVGS['shirt'];
  }

  formatPrice(price) {
    return `LE ${Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  dispatchUpdate(eventType, detail) {
    window.dispatchEvent(new CustomEvent(eventType, { detail }));
    window.dispatchEvent(new Event('goat_store_sync'));
  }
}

window.GoatDB = new GoatDataService();
