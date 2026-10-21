document.addEventListener('DOMContentLoaded', () => {
  const tabBtnLogin = document.getElementById('tabBtnLogin');
  const tabBtnRegister = document.getElementById('tabBtnRegister');
  const ownerLoginForm = document.getElementById('ownerLoginForm');
  const ownerRegisterForm = document.getElementById('ownerRegisterForm');
  const alertMsg = document.getElementById('alertMsg');
  const btnFillDemo = document.getElementById('btnFillDemo');

  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');

  const regName = document.getElementById('regName');
  const regEmail = document.getElementById('regEmail');
  const regStoreName = document.getElementById('regStoreName');
  const regPassword = document.getElementById('regPassword');
  const regPin = document.getElementById('regPin');

  function showAlert(msg, type = 'error') {
    alertMsg.textContent = msg;
    alertMsg.className = `alert-msg ${type}`;
    alertMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearAlert() {
    alertMsg.className = 'alert-msg';
    alertMsg.textContent = '';
  }

  function switchTab(mode) {
    clearAlert();
    if (mode === 'register') {
      tabBtnRegister.classList.add('active');
      tabBtnLogin.classList.remove('active');
      ownerRegisterForm.classList.add('active');
      ownerLoginForm.classList.remove('active');
      regName.focus();
    } else {
      tabBtnLogin.classList.add('active');
      tabBtnRegister.classList.remove('active');
      ownerLoginForm.classList.add('active');
      ownerRegisterForm.classList.remove('active');
      loginEmail.focus();
    }
  }

  tabBtnLogin.addEventListener('click', () => switchTab('login'));
  tabBtnRegister.addEventListener('click', () => switchTab('register'));

  if (btnFillDemo) {
    btnFillDemo.addEventListener('click', () => {
      const creds = window.OWNER_CREDENTIALS || { username: 'owner', password: 'owner' };
      loginEmail.value = creds.username;
      loginPassword.value = creds.password;
      showAlert(`Owner credentials autofilled (${creds.username} / ${creds.password})! Click "Sign In" below.`, 'success');
    });
  }

  ownerLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAlert();

    const entered = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!entered || !password) {
      showAlert('Please enter both username/email and password.');
      return;
    }

    const creds = window.OWNER_CREDENTIALS;
    if (creds) {
      const matchUser = (
        entered.toLowerCase() === creds.username.toLowerCase() ||
        entered.toLowerCase() === creds.email.toLowerCase()
      );
      if (matchUser && password === creds.password) {
        const ownerObj = {
          name: creds.displayName || 'Store Owner',
          email: creds.email || 'owner@goat.com',
          storeName: creds.storeName || 'GOAT Store'
        };
        GoatDB.setOwnerSession(ownerObj);
        showAlert(`Welcome back, ${ownerObj.name}! Redirecting to dashboard...`, 'success');
        setTimeout(() => {
          window.location.href = './owner.html';
        }, 700);
        return;
      }
    }

    const res = GoatDB.loginOwner(entered, password);
    if (res.success) {
      showAlert(`Welcome back, ${res.owner.name}! Redirecting to dashboard...`, 'success');
      setTimeout(() => {
        window.location.href = './owner.html';
      }, 700);
    } else {
      showAlert(res.message || 'Invalid username/email or password. You can click the demo box above.');
    }
  });

  ownerRegisterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAlert();

    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const storeName = regStoreName.value.trim();
    const password = regPassword.value;
    const pin = regPin.value.trim();

    if (!name || !email || !password) {
      showAlert('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      showAlert('Password must be at least 6 characters long.');
      return;
    }

    if (!pin) {
      showAlert('Please provide the Store Admin PIN.');
      return;
    }

    const res = GoatDB.registerOwner({
      name,
      email,
      storeName,
      password,
      pin
    });

    if (res.success) {
      showAlert(`Owner account registered successfully! Entering dashboard...`, 'success');
      setTimeout(() => {
        window.location.href = './owner.html';
      }, 800);
    } else {
      showAlert(res.message || 'Registration failed. Email might already be taken.');
    }
  });
});
