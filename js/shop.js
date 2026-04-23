// Shop management

class ShopManager {
  constructor() {
    this.leavesItems = [
      {
        id: 'group-slot',
        icon: '👥',
        name: '+1 Slot in Group Study',
        price: 300,
        type: 'leaves'
      },
      {
        id: 'time-card',
        icon: '⏱️',
        name: 'Multiple-Choice Time Card (+5 phút)',
        price: 100,
        type: 'leaves'
      },
      {
        id: 'title-diligent',
        icon: '🏅',
        name: 'Diligent Learner (Danh hiệu vĩnh viễn)',
        price: 1000,
        type: 'leaves'
      }
    ];
    
    this.moneyItems = [
      {
        id: 'group-slot-money',
        icon: '👫',
        name: '+1 Slot in Group Study',
        price: 10000,
        type: 'vnd'
      },
      {
        id: 'time-card-pack',
        icon: '⏳',
        name: '+5 phút trả lời (x5)',
        price: 10000,
        type: 'vnd'
      },
      {
        id: 'title-tycoon',
        icon: '👑',
        name: 'Title: Tycoon',
        price: 500000,
        type: 'vnd'
      },
      {
        id: 'title-tycoon-pro',
        icon: '💎',
        name: 'Title: Tycoon Pro Max',
        price: 999999,
        type: 'vnd'
      }
    ];
    
    this.init();
  }
  
  init() {
    this.renderShop();
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
    div.addEventListener('click', () => this.buyItem(item));
    
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
    
    div.appendChild(icon);
    div.appendChild(name);
    div.appendChild(price);
    
    return div;
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
    
    if (window.appState.leaves >= item.price) {
      // Deduct leaves
      window.appState.leaves -= item.price;
      updateLeavesDisplay(window.appState.leaves);
      saveData('leaves', window.appState.leaves);
      
      // Add item to inventory
      this.addToInventory(item);
      
      showToast(`✅ Đã đổi: ${item.name}`);
    } else {
      showToast(`❌ Không đủ lá cây! Cần ${item.price} 🍃`);
    }
  }
  
  buyWithMoney(item) {
    // In a real app, this would integrate with payment gateway
    showToast(`💳 Chuyển đến trang thanh toán: ${item.name}`);
    
    // Simulate payment process
    setTimeout(() => {
      const confirm = window.confirm(
        `Xác nhận mua "${item.name}" với giá ${item.price.toLocaleString('vi-VN')} đ?`
      );
      
      if (confirm) {
        this.addToInventory(item);
        showToast(`✅ Đã mua thành công: ${item.name}`);
      }
    }, 500);
  }
  
  addToInventory(item) {
    // Load current inventory
    let inventory = loadData('inventory', []);
    
    // Add item
    inventory.push({
      id: item.id,
      name: item.name,
      purchasedAt: new Date().toISOString()
    });
    
    // Save inventory
    saveData('inventory', inventory);
    
    // Apply item effects
    this.applyItemEffect(item);
  }
  
  applyItemEffect(item) {
    // Apply special effects based on item type
    switch(item.id) {
      case 'group-slot':
      case 'group-slot-money':
        showToast('🎉 Đã tăng slot Group Study!');
        break;
      case 'time-card':
      case 'time-card-pack':
        showToast('⏱️ Đã thêm thời gian trả lời!');
        break;
      case 'title-diligent':
      case 'title-tycoon':
      case 'title-tycoon-pro':
        showToast('👑 Đã nhận danh hiệu mới!');
        break;
    }
  }
  
  getInventory() {
    return loadData('inventory', []);
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
