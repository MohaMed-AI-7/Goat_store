function switchTab(param1, param2) {
  let mode = 'login';
  let clickedBtn = null;

  if (typeof param1 === 'string') {
    mode = param1;
  } else if (param1 && typeof param2 === 'string') {
    clickedBtn = param1;
    mode = param2;
  }

  const container = document.querySelector('.toggle-container');
  const slider = container ? container.querySelector('.toggle-slider') : null;
  const buttons = container ? container.querySelectorAll('.toggle-btn') : [];

  buttons.forEach(btn => btn.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  } else {
    buttons.forEach(btn => {
      if (btn.textContent.trim().toLowerCase().includes(mode)) {
        btn.classList.add('active');
      }
    });
  }

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const quickBar = document.querySelector('.credentials-quick-bar');
  const alertBox = document.getElementById('loginAlert');
  if (alertBox) {
    alertBox.className = 'login-alert-box';
    alertBox.innerHTML = '';
  }

  if (mode === 'register') {
    if (slider) slider.style.transform = 'translateX(100%)';
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
    if (quickBar) quickBar.style.display = 'none';
    const regName = document.getElementById('reg-name');
    if (regName) regName.focus();
  } else {
    if (slider) slider.style.transform = 'translateX(0)';
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
    if (quickBar) quickBar.style.display = 'flex';
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const alertBox = document.getElementById('loginAlert');
  const loginIdentifier = document.getElementById('email');
  const loginPassword = document.getElementById('password');
  const regName = document.getElementById('reg-name');
  const regEmail = document.getElementById('reg-email');
  const regPassword = document.getElementById('reg-password');
  const forgetLink = document.querySelector('.forget-link');
  const btnFillUser = document.getElementById('btnFillUser');
  const btnFillOwner = document.getElementById('btnFillOwner');

  function showAlert(message, type = 'success') {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `login-alert-box ${type}`;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const lanternButtons = document.querySelectorAll('.btn_login, .toggle-container');
  function updateLanternPosition(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.style.setProperty('--x', `${x}px`);
    this.style.setProperty('--y', `${y}px`);
  }

  lanternButtons.forEach(btn => {
    btn.addEventListener('mousemove', updateLanternPosition);
  });

  const eyeButtons = document.querySelectorAll('.btn-toggle-eye, .btn-toggle-password');
  eyeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      if (isPassword) {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`;
      } else {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
      }
    });
  });

  if (btnFillUser) {
    btnFillUser.addEventListener('click', () => {
      const uCreds = window.USER_CREDENTIALS || {
        email: "user@goat.com",
        password: "user"
      };
      if (loginIdentifier) loginIdentifier.value = uCreds.email || "user@goat.com";
      if (loginPassword) loginPassword.value = uCreds.password || "user";
      showAlert('تمت تعبئة بيانات حساب العميل (user@goat.com / user). اضغط Login للدخول!', 'success');
    });
  }

  if (btnFillOwner) {
    btnFillOwner.addEventListener('click', () => {
      const oCreds = window.OWNER_CREDENTIALS || {
        email: "owner@goat.com",
        password: "owner"
      };
      if (loginIdentifier) loginIdentifier.value = oCreds.email || "owner@goat.com";
      if (loginPassword) loginPassword.value = oCreds.password || "owner";
      showAlert('تمت تعبئة بيانات مالك المتجر (owner@goat.com / owner). اضغط Login للدخول!', 'success');
    });
  }

  if (forgetLink) {
    forgetLink.addEventListener('click', (e) => {
      e.preventDefault();
      const uCreds = window.USER_CREDENTIALS || { email: 'user@goat.com', password: 'user' };
      const oCreds = window.OWNER_CREDENTIALS || { email: 'owner@goat.com', password: 'owner' };
      showAlert(`بيانات الدخول الافتراضية:\n• المستخدم: ${uCreds.email} | كلمة المرور: ${uCreds.password}\n• المالك: ${oCreds.email} | كلمة المرور: ${oCreds.password}`, 'success');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const enteredUser = loginIdentifier ? loginIdentifier.value.trim().toLowerCase() : '';
      const enteredPass = loginPassword ? loginPassword.value : '';

      if (!enteredUser || !enteredPass) {
        showAlert('برجاء كتابة اسم المستخدم أو البريد الإلكتروني وكلمة المرور.', 'error');
        return;
      }

      const ownerCreds = window.OWNER_CREDENTIALS || {
        username: "owner",
        email: "owner@goat.com",
        password: "owner",
        displayName: "Store Owner",
        storeName: "GOAT Store"
      };

      const isOwnerUsername = ownerCreds.username && enteredUser === ownerCreds.username.toLowerCase();
      const isOwnerEmail = ownerCreds.email && enteredUser === ownerCreds.email.toLowerCase();
      const isOwnerPass = enteredPass === ownerCreds.password;

      let isDbOwner = false;
      if (window.GoatDB && typeof window.GoatDB.loginOwner === 'function') {
        const dbRes = window.GoatDB.loginOwner(enteredUser, enteredPass);
        if (dbRes && dbRes.success) isDbOwner = true;
      }

      if ((isOwnerUsername || isOwnerEmail || isDbOwner) && isOwnerPass) {
        const ownerSession = {
          name: ownerCreds.displayName || 'Store Owner',
          email: ownerCreds.email || 'owner@goat.com',
          storeName: ownerCreds.storeName || 'GOAT Store',
          loggedInAt: new Date().toISOString()
        };

        localStorage.setItem('goat_owner_auth', JSON.stringify(ownerSession));
        showAlert(`مرحباً بك يا مالك المتجر (${ownerCreds.displayName || 'Owner'})! جاري تحويلك للوحة التحكم...`, 'success');

        setTimeout(() => {
          window.location.href = '../owner/owner.html';
        }, 700);
        return;
      }

      const userCreds = window.USER_CREDENTIALS || {
        username: "user",
        email: "user@goat.com",
        password: "user",
        displayName: "Mohamed Ali",
        phone: "+20 100 123 4567",
        preferredSize: "L - Men"
      };

      const isDefaultUserMatch = (
        (userCreds.username && enteredUser === userCreds.username.toLowerCase()) ||
        (userCreds.email && enteredUser === userCreds.email.toLowerCase())
      );
      const isDefaultUserPass = (enteredPass === userCreds.password || enteredPass === 'user123');

      let matchedRegisteredUser = null;
      try {
        const regList = JSON.parse(localStorage.getItem('goat_registered_users') || '[]');
        if (Array.isArray(regList)) {
          matchedRegisteredUser = regList.find(u => 
            ((u.email && u.email.toLowerCase() === enteredUser) || 
             (u.name && u.name.toLowerCase() === enteredUser)) && 
            u.password === enteredPass
          );
        }
      } catch (err) {
        console.error('Error checking registered users', err);
      }

      if (isDefaultUserMatch && !isDefaultUserPass) {
        showAlert('كلمة المرور الخاصة بحساب المستخدم غير صحيحة!', 'error');
        return;
      }

      if ((isDefaultUserMatch && isDefaultUserPass) || matchedRegisteredUser) {
        const activeUser = matchedRegisteredUser || {
          name: userCreds.displayName || userCreds.username,
          email: userCreds.email,
          phone: userCreds.phone || '+20 100 123 4567',
          preferredSize: userCreds.preferredSize || 'L - Men'
        };

        const userSession = {
          name: activeUser.name,
          email: activeUser.email,
          loggedInAt: new Date().toISOString()
        };
        localStorage.setItem('goat_user_session', JSON.stringify(userSession));

        const profileData = {
          fullName: activeUser.name,
          email: activeUser.email,
          phone: activeUser.phone || '+20 100 123 4567',
          preferredSize: activeUser.preferredSize || 'L - Men'
        };
        localStorage.setItem('goat_user_profile_data', JSON.stringify(profileData));

        showAlert(`مرحباً بك (${activeUser.name})! تم تسجيل الدخول بنجاح...`, 'success');
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 650);
        return;
      }

      showAlert('بيانات الدخول غير صحيحة! يرجى التأكد من اسم المستخدم/البريد وكلمة المرور.', 'error');
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = regName ? regName.value.trim() : '';
      const emailVal = regEmail ? regEmail.value.trim().toLowerCase() : '';
      const passVal = regPassword ? regPassword.value : '';

      if (!nameVal || !emailVal || !passVal) {
        showAlert('برجاء استكمال جميع الحقول المطلوبة.', 'error');
        return;
      }

      const userCreds = window.USER_CREDENTIALS || { email: "user@goat.com" };
      if (emailVal === userCreds.email.toLowerCase()) {
        showAlert('هذا البريد الإلكتروني مسجل بالفعل كحساب مستخدم رسمي! يمكنك تسجيل الدخول به مباشرة.', 'error');
        return;
      }

      let regUsers = [];
      try {
        regUsers = JSON.parse(localStorage.getItem('goat_registered_users') || '[]');
        if (!Array.isArray(regUsers)) regUsers = [];
      } catch (err) {
        regUsers = [];
      }

      if (regUsers.some(u => u.email.toLowerCase() === emailVal)) {
        showAlert('هذا البريد الإلكتروني مسجل بالفعل! يمكنك تسجيل الدخول به.', 'error');
        return;
      }

      const newUser = {
        name: nameVal,
        email: emailVal,
        password: passVal,
        phone: '+20 100 000 0000',
        preferredSize: 'L - Men',
        createdAt: new Date().toISOString()
      };
      regUsers.push(newUser);
      localStorage.setItem('goat_registered_users', JSON.stringify(regUsers));

      const userSession = {
        name: nameVal,
        email: emailVal,
        loggedInAt: new Date().toISOString()
      };
      localStorage.setItem('goat_user_session', JSON.stringify(userSession));

      const profileData = {
        fullName: nameVal,
        email: emailVal,
        phone: '+20 100 000 0000',
        preferredSize: 'L - Men'
      };
      localStorage.setItem('goat_user_profile_data', JSON.stringify(profileData));

      showAlert(`تم إنشاء الحساب بنجاح يا (${nameVal})! جاري نقلك لصفحة الحساب...`, 'success');
      setTimeout(() => {
        window.location.href = '../Account/account.html';
      }, 700);
    });
  }
});
