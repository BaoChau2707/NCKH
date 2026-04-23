// Missions management

class MissionsManager {
  constructor() {
    this.missions = {
      1: { completed: false, progress: 0, target: 15, reward: 10 },  // Study 15 min
      2: { completed: false, progress: 0, target: 30, reward: 20 },  // Study 30 min
      3: { completed: false, progress: 0, target: 15, reward: 10 },  // Group 15 min
      4: { completed: false, progress: 0, target: 30, reward: 20 },  // Group 30 min
      5: { completed: false, progress: 0, target: 4, reward: 40 }    // Complete all
    };
    
    this.init();
  }
  
  init() {
    // Load saved missions
    const savedMissions = loadData('missions', null);
    if (savedMissions) {
      this.missions = savedMissions;
      this.updateAllProgressBars();
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
    
    // Check if all missions completed
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
    
    // Check if all missions completed
    this.checkAllMissionsComplete();
  }
  
  completeMission(missionId) {
    if (this.missions[missionId].completed) return;
    
    this.missions[missionId].completed = true;
    this.missions[missionId].progress = 100;
    
    // Update progress bar
    this.updateProgressBar(missionId, 100);
    
    // Add reward
    const reward = this.missions[missionId].reward;
    if (window.appState) {
      window.appState.leaves = addLeaves(reward, window.appState.leaves);
      updateLeavesDisplay(window.appState.leaves);
      saveData('leaves', window.appState.leaves);
    }
    
    // Save missions
    saveData('missions', this.missions);
    
    // Show notification
    showToast(`🎉 Hoàn thành Task ${missionId}! +${reward} lá cây`);
  }
  
  checkAllMissionsComplete() {
    // Check if missions 1-4 are all completed
    const mainMissionsComplete = [1, 2, 3, 4].every(id => this.missions[id].completed);
    
    if (mainMissionsComplete && !this.missions[5].completed) {
      this.completeMission(5);
    }
    
    // Update mission 5 progress
    const completedCount = [1, 2, 3, 4].filter(id => this.missions[id].completed).length;
    this.updateProgressBar(5, (completedCount / 4) * 100);
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
  
  resetDailyMissions() {
    // Reset all missions (called at midnight or manually)
    for (let id in this.missions) {
      this.missions[id].completed = false;
      this.missions[id].progress = 0;
    }
    this.updateAllProgressBars();
    saveData('missions', this.missions);
    showToast('🔄 Nhiệm vụ đã được làm mới!');
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
