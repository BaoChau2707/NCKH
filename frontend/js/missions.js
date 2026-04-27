// Missions management

class MissionsManager {
  constructor() {
    this.missions = {
      1: { completed: false, progress: 0, target: 15, reward: 10, type: 'study' },
      2: { completed: false, progress: 0, target: 30, reward: 20, type: 'study' },
      3: { completed: false, progress: 0, target: 15, reward: 10, type: 'group' },
      4: { completed: false, progress: 0, target: 30, reward: 20, type: 'group' },
      5: { completed: false, progress: 0, target: 4, reward: 40, type: 'all' }
    };
    
    this.dailyLeafLimit = 100;
    this.todayLeaves = 0;
    this.lastResetDate = null;
    
    this.init();
  }
  
  init() {
    // Check if need to reset daily missions
    this.checkDailyReset();
    
    // Load saved missions
    const savedMissions = loadData('missions', null);
    if (savedMissions) {
      this.missions = savedMissions;
    }
    
    // Load today's leaves count
    this.todayLeaves = loadData('todayLeaves', 0);
    this.lastResetDate = loadData('lastResetDate', null);
    
    this.updateAllProgressBars();
    this.updateDailyLeafDisplay();
  }
  
  checkDailyReset() {
    const today = new Date().toDateString();
    const lastReset = loadData('lastResetDate', null);
    
    if (lastReset !== today) {
      // New day - reset missions
      this.resetDailyMissions();
      saveData('lastResetDate', today);
      this.lastResetDate = today;
    }
  }
  
  checkStudyProgress(minutes) {
    // Mission 1: Study 15 minutes
    if (!this.missions[1].completed && minutes >= 15) {
      this.completeMission(1);
    }
    
    // Mission 2: Study 30 minutes
    if (!this.missions[2].completed && minutes >= 30) {
      this.completeMission(2);
    }
    
    // Update progress bars
    this.updateProgressBar(1, Math.min(100, (minutes / 15) * 100));
    this.updateProgressBar(2, Math.min(100, (minutes / 30) * 100));
    
    // Save progress
    this.missions[1].progress = Math.min(100, (minutes / 15) * 100);
    this.missions[2].progress = Math.min(100, (minutes / 30) * 100);
    saveData('missions', this.missions);
    
    this.checkAllMissionsComplete();
  }
  
  checkGroupProgress(minutes) {
    // Mission 3: Group Study 15 minutes
    if (!this.missions[3].completed && minutes >= 15) {
      this.completeMission(3);
    }
    
    // Mission 4: Group Study 30 minutes
    if (!this.missions[4].completed && minutes >= 30) {
      this.completeMission(4);
    }
    
    // Update progress bars
    this.updateProgressBar(3, Math.min(100, (minutes / 15) * 100));
    this.updateProgressBar(4, Math.min(100, (minutes / 30) * 100));
    
    // Save progress
    this.missions[3].progress = Math.min(100, (minutes / 15) * 100);
    this.missions[4].progress = Math.min(100, (minutes / 30) * 100);
    saveData('missions', this.missions);
    
    this.checkAllMissionsComplete();
  }
  
  completeMission(missionId) {
    if (this.missions[missionId].completed) return;
    
    // Check daily limit
    const reward = this.missions[missionId].reward;
    if (this.todayLeaves + reward > this.dailyLeafLimit) {
      showToast(`⚠️ Đã đạt giới hạn ${this.dailyLeafLimit} lá/ngày!`);
      return;
    }
    
    this.missions[missionId].completed = true;
    this.missions[missionId].progress = 100;
    
    // Update progress bar
    this.updateProgressBar(missionId, 100);
    
    // Add reward
    if (window.appState) {
      window.appState.leaves = addLeaves(reward, window.appState.leaves);
      updateLeavesDisplay(window.appState.leaves);
      saveData('leaves', window.appState.leaves);
      
      // Track daily leaves
      this.todayLeaves += reward;
      saveData('todayLeaves', this.todayLeaves);
      this.updateDailyLeafDisplay();
    }
    
    // Save missions
    saveData('missions', this.missions);
    
    // Show notification with animation
    this.showMissionCompleteAnimation(missionId, reward);
  }
  
  showMissionCompleteAnimation(missionId, reward) {
    showToast(`🎉 Hoàn thành Task ${missionId}! +${reward} 🍃`);
    
    // Add visual feedback to mission card
    const missionCard = document.querySelector(`[data-mission="${missionId}"]`);
    if (missionCard) {
      missionCard.style.animation = 'pulse 0.5s ease';
      setTimeout(() => {
        missionCard.style.animation = '';
      }, 500);
    }
  }
  
  checkAllMissionsComplete() {
    const mainMissionsComplete = [1, 2, 3, 4].every(id => this.missions[id].completed);
    
    if (mainMissionsComplete && !this.missions[5].completed) {
      this.completeMission(5);
    }
    
    // Update mission 5 progress
    const completedCount = [1, 2, 3, 4].filter(id => this.missions[id].completed).length;
    this.missions[5].progress = (completedCount / 4) * 100;
    this.updateProgressBar(5, this.missions[5].progress);
    saveData('missions', this.missions);
  }
  
  updateProgressBar(missionId, percentage) {
    const bar = document.getElementById(`m${missionId}-bar`);
    if (bar) {
      bar.style.width = percentage + '%';
    }
  }
  
  updateAllProgressBars() {
    for (let id in this.missions) {
      const mission = this.missions[id];
      this.updateProgressBar(id, mission.progress);
    }
  }
  
  updateDailyLeafDisplay() {
    const display = document.getElementById('leaves-display');
    if (display) {
      const remaining = this.dailyLeafLimit - this.todayLeaves;
      display.textContent = window.appState ? window.appState.leaves : 0;
      
      // Update subtitle
      const subtitle = document.querySelector('.leaves-sub');
      if (subtitle) {
        subtitle.textContent = `Lá cây hiện có (Còn ${remaining}/${this.dailyLeafLimit} lá hôm nay)`;
      }
    }
  }
  
  resetDailyMissions() {
    // Reset all missions
    for (let id in this.missions) {
      this.missions[id].completed = false;
      this.missions[id].progress = 0;
    }
    
    // Reset daily leaves counter
    this.todayLeaves = 0;
    saveData('todayLeaves', 0);
    
    this.updateAllProgressBars();
    this.updateDailyLeafDisplay();
    saveData('missions', this.missions);
    
    console.log('🔄 Daily missions reset!');
  }
  
  getMissionStats() {
    const completed = Object.values(this.missions).filter(m => m.completed).length;
    const total = Object.keys(this.missions).length;
    return {
      completed,
      total,
      percentage: (completed / total) * 100,
      todayLeaves: this.todayLeaves,
      remainingLeaves: this.dailyLeafLimit - this.todayLeaves
    };
  }
}

// Initialize
let missionsManager = null;

function initMissions() {
  missionsManager = new MissionsManager();
  window.missionsManager = missionsManager;
}

// Export
window.initMissions = initMissions;
window.MissionsManager = MissionsManager;
