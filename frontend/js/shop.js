// Shop management

class ShopManager {
  constructor() {
    this.inventory = [];
    this.groupSlots = 3; // Default slots
    this.timeCards = 0;
    this.titles = [];
    
    this.leavesItems = [
      {
        id: 'group-slot',
        icon: '👥',
        name: '+1 Slot in Group Study',
        price: 300,
        type: 'leaves',
        category: 'upgrade'
      },
      {
        id: 'time-card',
        icon: '⏱️',
        name: 'Multiple-Choice Time Card (+5 phút)',
        price: 100,
        type: 'leaves',
        category: 'consumable'
      },
      {
        id: 'title-diligent',
        icon: '🏅',
        name: 'Diligent Learner (Danh hiệu vĩnh viễn)',
        price: 1000,
        type: 'leaves',
        category: 'title'
      }
    ];
    
    this.moneyItems = [
      {
        id: 'group-slot-money',
        icon: '👫',
        name: '+1 Slot in Group Study',
        price: 10000,
        type: 'vnd',
        category: 'upgrade'
      },
      {
        id: 'time-card-pack',
        icon: '⏳',
        name: '+5 phút trả lời (x5)',
        price: 10000,
        type: 'vnd',
        category: 'consumable'
      },
      {
        id: 'title-tycoon',
        icon: '👑',
        name: 'Title: Tycoon',
        price: 500000,
        type: 'vnd',
        category: 'title'
      },
      {
        id: 'title-tycoon-pro',
        icon: '💎',
        name: 'Title: Tycoon Pro Max',
        price: 999999,
        type: 'vnd',
        category: 'title'
      }
    ];
    
    this.init();
  }
  
  init() {
    // Load inventory
    this.inventory = loadData('inventory', []);
    this.groupSlots = loadData('groupSlots', 3);
    this.timeCards = loadData('timeCards', 0);
    this.titles = loadData('titles', []);
    
    this.renderShop();
    this.updateInventoryDisplay();
  }
  
  renderShop() {
    // Render leaves items
    const leavesGrid = document.getElementById('shop-leaves');
    leavesGrid.innerHTML = '';
    
    this.leavesItems.forEach(item => {
      const itemEl = this.createShopItem(item);
      leavesGrid.appendChild(itemEl);
    });
    
    // Render money items
    const moneyGrid = document.getElementById('shop-money');
    moneyGrid.innerHTML = '';
    
    this.moneyItems.forEach(item => {
      const itemEl = this.createShopItem(item);
      moneyGrid.appendChild(itemEl);
    });
  }
  
  createShopItem(item) {
    const div = document.createElement('div');
    div.className = 'shop-item';
    
    // Check if already owned (for non-consumables)
    const isOwned = this.isItemOwned(item);
    if (isOwned && item.category !== 'consumable') {
      div.classList.add('owned');
      div.style.opacity = '0.6';
    }
    
    div.addEventListener('click', () => {
      if (isOwned && item.category !== 'consumable') {
        showToast('✅ Bạn đã sở hữu item này!');
      } else {
        this.buyItem(item);
      }
    });
    
    const icon = document.createElement('div');
    icon.className = 'shop-icon';
    icon.textContent = item.icon;
    
    const name = document.createElement('div');
    name.className = 'shop-name';
    name.textContent = item.name;
    
    const price = document.createElement('div');
    price.className = item.type === 'leaves' ? 'shop-price' : 'shop-price premium';
    price.textContent = item.type === 'leaves' 
      ? `${item.price} 🍃` 
      : `${item.price.toLocaleString('vi-VN')} đ`;
    
    // Add owned badge
    if (isOwned && item.category !== 'consumable') {
      const badge = document.createElement('div');
      badge.className = 'owned-badge';
      badge.textContent = '✓ Đã sở hữu';
      badge.style.cssText = 'position:absolute;top:8px;right:8px;background:#4caf50;color:white;padding:2px 8px;border-radius:10px;font-size:10px;';
      div.style.position = 'relative';
      div.appendChild(badge);
    }
    
    div.appendChild(icon);
    div.appendChild(name);
    div.appendChild(price);
    
    return div;
  }
  
  isItemOwned(item) {
    return this.inventory.some(i => i.id === item.id);
  }
  
  buyItem(item) {
    if (item.type === 'leaves') {
      this.buyWithLeaves(item);
    } else {
      this.buyWithMoney(item);
    }
  }
  
  buyWithLeaves(item) {
    if (!window.appState) return;
    
    // Check if already owned (non-consumable)
    if (item.category !== 'consumable' && this.isItemOwned(item)) {
      showToast('✅ Bạn đã sở hữu item này!');
      return;
    }
    
    if (window.appState.leaves >= item.price) {
      // Deduct leaves
      window.appState.leaves -= item.price;
      updateLeavesDisplay(window.appState.leaves);
      saveData('leaves', window.appState.leaves);
      
      // Add item to inventory
      this.addToInventory(item);
      
      // Re-render shop to show owned status
      this.renderShop();
      
      showToast(`✅ Đã mua: ${item.name}`);
    } else {
      const needed = item.price - window.appState.leaves;
      showToast(`❌ Không đủ lá cây! Cần thêm ${needed} 🍃`);
    }
  }
  
  buyWithMoney(item) {
    // Simulate payment confirmation
    const confirmed = confirm(
      `💳 Xác nhận mua "${item.name}"\n\n` +
      `Giá: ${item.price.toLocaleString('vi-VN')} đ\n\n` +
      `Trong phiên bản demo, item sẽ được thêm miễn phí.\n` +
      `Phiên bản thật sẽ tích hợp cổng thanh toán.`
    );
    
    if (confirmed) {
      // Check if already owned (non-consumable)
      if (item.category !== 'consumable' && this.isItemOwned(item)) {
        showToast('✅ Bạn đã sở hữu item này!');
        return;
      }
      
      this.addToInventory(item);
      this.renderShop();
      showToast(`✅ Đã mua thành công: ${item.name}`);
    }
  }
  
  addToInventory(item) {
    // Add item
    const inventoryItem = {
      id: item.id,
      name: item.name,
      category: item.category,
      purchasedAt: new Date().toISOString()
    };
    
    this.inventory.push(inventoryItem);
    saveData('inventory', this.inventory);
    
    // Apply item effects
    this.applyItemEffect(item);
  }
  
  applyItemEffect(item) {
    switch(item.category) {
      case 'upgrade':
        if (item.id.includes('group-slot')) {
          this.groupSlots++;
          saveData('groupSlots', this.groupSlots);
          showToast(`🎉 Tăng slot Group Study lên ${this.groupSlots}!`);
          this.updateGroupSlotsDisplay();
        }
        break;
        
      case 'consumable':
        if (item.id.includes('time-card')) {
          const amount = item.id.includes('pack') ? 5 : 1;
          this.timeCards += amount;
          saveData('timeCards', this.timeCards);
          showToast(`⏱️ Đã thêm ${amount} Time Card! (Tổng: ${this.timeCards})`);
        }
        break;
        
      case 'title':
        if (!this.titles.includes(item.id)) {
          this.titles.push(item.id);
          saveData('titles', this.titles);
          showToast(`👑 Đã nhận danh hiệu: ${item.name}!`);
          this.updateTitleDisplay();
        }
        break;
    }
  }
  
  updateGroupSlotsDisplay() {
    // Update group study info
    const infoBox = document.querySelector('#page-group .info-box');
    if (infoBox) {
      infoBox.innerHTML = `
        👥 Group Study tối đa <b>${this.groupSlots} thành viên</b><br>
        📺 Có thể chia sẻ màn hình cho nhau<br>
        🍃 Tăng slot bằng cách đổi 300 lá cây
      `;
    }
  }
  
  updateTitleDisplay() {
    // Update user title in header
    const username = document.getElementById('username');
    if (username && this.titles.length > 0) {
      const titleNames = {
        'title-diligent': '🏅',
        'title-tycoon': '👑',
        'title-tycoon-pro': '💎'
      };
      const latestTitle = this.titles[this.titles.length - 1];
      const titleIcon = titleNames[latestTitle] || '';
      username.textContent = `${titleIcon} An`;
    }
  }
  
  updateInventoryDisplay() {
    this.updateGroupSlotsDisplay();
    this.updateTitleDisplay();
  }
  
  getInventory() {
    return this.inventory;
  }
  
  getInventoryStats() {
    return {
      totalItems: this.inventory.length,
      groupSlots: this.groupSlots,
      timeCards: this.timeCards,
      titles: this.titles.length
    };
  }
  
  useTimeCard() {
    if (this.timeCards > 0) {
      this.timeCards--;
      saveData('timeCards', this.timeCards);
      showToast(`⏱️ Đã sử dụng Time Card! (Còn ${this.timeCards})`);
      return true;
    } else {
      showToast('❌ Không có Time Card! Mua tại Shop.');
      return false;
    }
  }
}

// Initialize
let shopManager = null;

function initShop() {
  shopManager = new ShopManager();
  window.shopManager = shopManager;
}

// Export
window.initShop = initShop;
window.ShopManager = ShopManager;
