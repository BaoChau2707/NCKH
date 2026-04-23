// Utility functions

// Toast notification
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// Update leaves display
function updateLeavesDisplay(leaves) {
  document.getElementById('total-leaves').textContent = leaves;
  document.getElementById('leaves-display').textContent = leaves;
}

// Add leaves with max limit
function addLeaves(amount, currentLeaves, maxLeaves = 100) {
  return Math.min(maxLeaves, currentLeaves + amount);
}

// Format time (seconds to HH:MM:SS)
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return String(h).padStart(2, '0') + ':' + 
         String(m).padStart(2, '0') + ':' + 
         String(s).padStart(2, '0');
}

// Save data to localStorage
function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

// Load data from localStorage
function loadData(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return defaultValue;
  }
}

// Export functions to global scope
window.showToast = showToast;
window.updateLeavesDisplay = updateLeavesDisplay;
window.addLeaves = addLeaves;
window.formatTime = formatTime;
window.saveData = saveData;
window.loadData = loadData;
