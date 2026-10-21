const USER_CREDENTIALS = {
  username: "user",

  email: "user@goat.com",

  password: "user",

  displayName: "Mohamed Ali",

  phone: "+20 100 123 4567",

  preferredSize: "L - Men"
};

if (typeof window !== 'undefined') {
  window.USER_CREDENTIALS = USER_CREDENTIALS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = USER_CREDENTIALS;
}
