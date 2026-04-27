// Authentication System

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isLoggedIn = false;
    
    this.init();
  }
  
  init() {
    // Check if user is logged in
    this.loadUserSession();
    
    // Setup UI
    this.setupAuthUI();
  }
  
  loadUserSession() {
    const savedUser = loadData('currentUser', null);
    
    if (savedUser) {
      this.currentUser = savedUser;
      this.isLoggedIn = true;
      this.updateUIForLoggedIn();
    } else {
      this.showLoginPrompt();
    }
  }
  
  setupAuthUI() {
    // Add login button to header if not logged in
    if (!this.isLoggedIn) {
      this.addLoginButton();
    } else {
      this.addUserMenu();
    }
  }
  
  addLoginButton() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const loginBtn = document.createElement('button');
    loginBtn.id = 'login-btn';
    loginBtn.textContent = '🔐 Đăng nhập';
    loginBtn.style.cssText = `
      background: rgba(255,255,255,0.2);
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
    `;
    loginBtn.addEventListener('click', () => this.showLoginDialog());
    
    // Replace leaves badge temporarily
    const leavesBadge = header.querySelector('.leaves-badge');
    if (leavesBadge) {
      header.insertBefore(loginBtn, leavesBadge);
    }
  }
  
  addUserMenu() {
    const headerUser = document.querySelector('.header-user');
    if (!headerUser) return;
    
    // Add logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = '🚪';
    logoutBtn.title = 'Đăng xuất';
    logoutBtn.style.cssText = `
      background: rgba(255,255,255,0.2);
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      margin-left: 8px;
    `;
    logoutBtn.addEventListener('click', () => this.logout());
    
    headerUser.appendChild(logoutBtn);
  }
  
  showLoginPrompt() {
    // Show on first visit
    const hasSeenPrompt = loadData('hasSeenLoginPrompt', false);
    
    if (!hasSeenPrompt) {
      setTimeout(() => {
        showToast('💡 Đăng nhập để lưu tiến độ và upload file!');
        saveData('hasSeenLoginPrompt', true);
      }, 3000);
    }
  }
  
  showLoginDialog() {
    const dialog = document.createElement('div');
    dialog.id = 'auth-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    `;
    
    dialog.innerHTML = `
      <div style="background:white;padding:30px;border-radius:16px;max-width:400px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">
        <h2 style="margin:0 0 10px 0;color:#2e7d32;text-align:center;">🍀 Study Garden</h2>
        <p style="text-align:center;color:#666;font-size:13px;margin-bottom:20px;">Đăng nhập để lưu tiến độ</p>
        
        <div id="login-tabs" style="display:flex;gap:8px;margin-bottom:20px;">
          <button class="auth-tab active" data-tab="login">Đăng nhập</button>
          <button class="auth-tab" data-tab="register">Đăng ký</button>
        </div>
        
        <div id="login-form">
          <input type="email" id="login-email" placeholder="Email" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;margin-bottom:12px;font-size:14px;">
          <input type="password" id="login-password" placeholder="Mật khẩu" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;margin-bottom:12px;font-size:14px;">
          <button id="login-submit-btn" style="width:100%;padding:12px;background:#4a7c59;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:12px;">🔐 Đăng nhập</button>
          <div style="text-align:center;font-size:12px;color:#999;">
            <a href="#" id="forgot-password" style="color:#4a7c59;">Quên mật khẩu?</a>
          </div>
        </div>
        
        <div id="register-form" style="display:none;">
          <input type="text" id="register-name" placeholder="Tên của bạn" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;margin-bottom:12px;font-size:14px;">
          <input type="email" id="register-email" placeholder="Email" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;margin-bottom:12px;font-size:14px;">
          <input type="password" id="register-password" placeholder="Mật khẩu (tối thiểu 6 ký tự)" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;margin-bottom:12px;font-size:14px;">
          <button id="register-submit-btn" style="width:100%;padding:12px;background:#4a7c59;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:12px;">✨ Đăng ký</button>
        </div>
        
        <div style="text-align:center;margin-top:20px;">
          <button id="guest-continue" style="background:none;border:none;color:#999;font-size:13px;cursor:pointer;text-decoration:underline;">Tiếp tục với tư cách khách</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabName = tab.dataset.tab;
        document.getElementById('login-form').style.display = tabName === 'login' ? 'block' : 'none';
        document.getElementById('register-form').style.display = tabName === 'register' ? 'block' : 'none';
      });
    });
    
    // Login submit
    document.getElementById('login-submit-btn').addEventListener('click', () => {
      this.handleLogin();
    });
    
    // Register submit
    document.getElementById('register-submit-btn').addEventListener('click', () => {
      this.handleRegister();
    });
    
    // Guest continue
    document.getElementById('guest-continue').addEventListener('click', () => {
      dialog.remove();
      showToast('👤 Tiếp tục với tư cách khách');
    });
    
    // Forgot password
    document.getElementById('forgot-password').addEventListener('click', (e) => {
      e.preventDefault();
      showToast('📧 Tính năng đang phát triển!');
    });
    
    // Close on outside click
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.remove();
      }
    });
    
    // Enter key to submit
    dialog.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const activeTab = document.querySelector('.auth-tab.active').dataset.tab;
        if (activeTab === 'login') {
          this.handleLogin();
        } else {
          this.handleRegister();
        }
      }
    });
  }
  
  async handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
      showToast('⚠️ Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    if (!this.validateEmail(email)) {
      showToast('⚠️ Email không hợp lệ!');
      return;
    }
    
    // Show loading
    showToast('🔄 Đang đăng nhập...');
    
    // Call API
    const result = await API.login(email, password);
    
    if (result.success) {
      this.login(result.user);
    } else {
      showToast('❌ ' + result.message);
    }
  }
  
  async handleRegister() {
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    
    if (!name || !email || !password) {
      showToast('⚠️ Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    if (!this.validateEmail(email)) {
      showToast('⚠️ Email không hợp lệ!');
      return;
    }
    
    if (password.length < 6) {
      showToast('⚠️ Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    
    // Show loading
    showToast('🔄 Đang đăng ký...');
    
    // Call API
    const result = await API.register(email, password, name);
    
    if (result.success) {
      this.login(result.user);
    } else {
      showToast('❌ ' + result.message);
    }
  }
  
  login(user) {
    this.currentUser = {
      name: user.name,
      email: user.email,
      leaves: user.leaves || 0,
      uploadedFiles: user.uploadedFiles || []
    };
    this.isLoggedIn = true;
    
    saveData('currentUser', this.currentUser);
    
    // Close dialog
    const dialog = document.getElementById('auth-dialog');
    if (dialog) dialog.remove();
    
    // Update UI
    this.updateUIForLoggedIn();
    
    showToast(`✅ Chào mừng ${user.name}!`);
    
    // Sync data
    this.syncUserData();
  }
  
  logout() {
    const confirm = window.confirm('Bạn có chắc muốn đăng xuất?');
    if (!confirm) return;
    
    // Save current data to user
    this.saveUserData();
    
    // Clear session
    this.currentUser = null;
    this.isLoggedIn = false;
    saveData('currentUser', null);
    
    showToast('👋 Đã đăng xuất!');
    
    // Reload page
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  
  updateUIForLoggedIn() {
    // Update username in header
    const usernameEl = document.getElementById('username');
    if (usernameEl && this.currentUser) {
      usernameEl.textContent = this.currentUser.name;
    }
    
    // Update leaves
    if (this.currentUser && window.appState) {
      window.appState.leaves = this.currentUser.leaves;
      updateLeavesDisplay(this.currentUser.leaves);
    }
    
    // Remove login button, add user menu
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) loginBtn.remove();
    
    this.addUserMenu();
  }
  
  syncUserData() {
    if (!this.isLoggedIn || !this.currentUser) return;
    
    // Load user's data
    const users = loadData('users', {});
    const userData = users[this.currentUser.email];
    
    if (userData) {
      // Sync leaves
      if (window.appState) {
        window.appState.leaves = userData.leaves || 0;
        updateLeavesDisplay(window.appState.leaves);
      }
      
      // Sync uploaded files
      this.currentUser.uploadedFiles = userData.uploadedFiles || [];
    }
  }
  
  saveUserData() {
    if (!this.isLoggedIn || !this.currentUser) return;
    
    const users = loadData('users', {});
    const userData = users[this.currentUser.email];
    
    if (userData) {
      // Save current leaves
      if (window.appState) {
        userData.leaves = window.appState.leaves;
      }
      
      // Save uploaded files
      userData.uploadedFiles = this.currentUser.uploadedFiles;
      
      users[this.currentUser.email] = userData;
      saveData('users', users);
    }
  }
  
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  hashPassword(password) {
    // Simple hash (in production, use bcrypt or similar)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }
  
  isUserLoggedIn() {
    return this.isLoggedIn;
  }
  
  getCurrentUser() {
    return this.currentUser;
  }
  
  addUploadedFile(fileData) {
    if (!this.isLoggedIn || !this.currentUser) {
      showToast('⚠️ Vui lòng đăng nhập để lưu file!');
      return false;
    }
    
    this.currentUser.uploadedFiles.push(fileData);
    this.saveUserData();
    return true;
  }
  
  getUploadedFiles() {
    if (!this.isLoggedIn || !this.currentUser) return [];
    return this.currentUser.uploadedFiles;
  }
}

// Initialize
let authManager = null;

function initAuth() {
  authManager = new AuthManager();
  window.authManager = authManager;
}

// Auto-save on page unload
window.addEventListener('beforeunload', () => {
  if (authManager && authManager.isLoggedIn) {
    authManager.saveUserData();
  }
});

// Export
window.initAuth = initAuth;
window.AuthManager = AuthManager;
