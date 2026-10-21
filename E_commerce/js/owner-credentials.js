const OWNER_CREDENTIALS = {
  username: "owner",

  email: "owner@goat.com",

  password: "owner",

  displayName: "Store Owner",

  storeName: "GOAT Store",

  adminPin: "GOAT-2026"
};

if (typeof window !== 'undefined') {
  window.OWNER_CREDENTIALS = OWNER_CREDENTIALS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = OWNER_CREDENTIALS;
}
