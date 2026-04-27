// Timer management for Study Alone

class Timer {
  constructor() {
    this.running = false;
    this.seconds = 0;
    this.interval = null;
    this.studyMinutes = 0;
    this.mode = 'countup'; // 'countup' or 'countdown'
    this.targetSeconds = 0;
    this.audioPlayer = null;
    this.timerEndSound = null;
    
    // DOM elements
    this.display = document.getElementById('timer');
    this.startBtn = document.getElementById('start-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.timerLabel = document.getElementById('timer-label');
    
    this.init();
  }
  
  init() {
    // Initialize audio
    this.audioPlayer = document.getElementById('audio-player');
    this.timerEndSound = document.getElementById('timer-end-sound');
    
    // Event listeners
    this.startBtn.addEventListener('click', () => this.toggle());
    this.resetBtn.addEventListener('click', () => this.reset());
    
    // Mode tabs
    const modeTabs = document.querySelectorAll('.mode-tab');
    modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.mode = tab.dataset.mode;
        this.switchMode(this.mode);
      });
    });
    
    // Preset buttons
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const minutes = parseInt(btn.dataset.minutes);
        this.setCountdownTime(0, minutes, 0);
      });
    });
    
    // Custom time inputs
    const hoursInput = document.getElementById('hours-input');
    const minutesInput = document.getElementById('minutes-input');
    const secondsInput = document.getElementById('seconds-input');
    
    [hoursInput, minutesInput, secondsInput].forEach(input => {
      input.addEventListener('change', () => {
        const h = parseInt(hoursInput.value) || 0;
        const m = parseInt(minutesInput.value) || 0;
        const s = parseInt(secondsInput.value) || 0;
        this.setCountdownTime(h, m, s);
      });
    });
    
    // Load saved state
    const savedTime = loadData('timerSeconds', 0);
    const savedMode = loadData('timerMode', 'countup');
    
    if (savedTime > 0) {
      this.seconds = savedTime;
      this.updateDisplay();
    }
    
    this.mode = savedMode;
    this.switchMode(this.mode);
  }
  
  switchMode(mode) {
    const countdownSettings = document.getElementById('countdown-settings');
    
    if (mode === 'countdown') {
      countdownSettings.style.display = 'block';
      this.timerLabel.textContent = 'Countdown Timer';
      
      // Set default countdown time if not set
      if (this.targetSeconds === 0) {
        this.setCountdownTime(0, 25, 0);
      }
    } else {
      countdownSettings.style.display = 'none';
      this.timerLabel.textContent = 'Study Time';
      this.targetSeconds = 0;
    }
    
    this.reset();
    saveData('timerMode', mode);
  }
  
  setCountdownTime(hours, minutes, seconds) {
    this.targetSeconds = hours * 3600 + minutes * 60 + seconds;
    this.seconds = this.targetSeconds;
    this.updateDisplay();
    
    // Update inputs
    document.getElementById('hours-input').value = hours;
    document.getElementById('minutes-input').value = minutes;
    document.getElementById('seconds-input').value = seconds;
  }
  
  toggle() {
    if (!this.running) {
      this.start();
    } else {
      this.pause();
    }
  }
  
  start() {
    // Validate countdown mode
    if (this.mode === 'countdown' && this.seconds <= 0) {
      showToast('⚠️ Vui lòng đặt thời gian đếm ngược!');
      return;
    }
    
    this.running = true;
    this.startBtn.textContent = '⏸ PAUSE';
    
    this.interval = setInterval(() => {
      if (this.mode === 'countup') {
        this.seconds++;
        this.studyMinutes = Math.floor(this.seconds / 60);
      } else {
        this.seconds--;
        this.studyMinutes = Math.floor((this.targetSeconds - this.seconds) / 60);
        
        // Check if countdown finished
        if (this.seconds <= 0) {
          this.onCountdownEnd();
          return;
        }
      }
      
      this.updateDisplay();
      
      // Save progress
      saveData('timerSeconds', this.seconds);
      
      // Check missions
      if (window.missionsManager) {
        window.missionsManager.checkStudyProgress(this.studyMinutes);
      }
    }, 1000);
  }
  
  pause() {
    this.running = false;
    this.startBtn.textContent = '▶ RESUME';
    clearInterval(this.interval);
  }
  
  reset() {
    this.running = false;
    clearInterval(this.interval);
    
    if (this.mode === 'countdown') {
      this.seconds = this.targetSeconds;
    } else {
      this.seconds = 0;
    }
    
    this.studyMinutes = 0;
    this.startBtn.textContent = '▶ START STUDYING';
    this.updateDisplay();
    saveData('timerSeconds', 0);
  }
  
  onCountdownEnd() {
    this.running = false;
    clearInterval(this.interval);
    this.seconds = 0;
    this.updateDisplay();
    this.startBtn.textContent = '▶ START STUDYING';
    
    // Play end sound
    if (this.timerEndSound) {
      this.timerEndSound.play().catch(e => console.log('Cannot play sound:', e));
    }
    
    // Show notification
    showToast('⏰ Hết giờ! Bạn đã hoàn thành phiên học!');
    
    // Add leaves based on study time
    const studiedMinutes = Math.floor(this.targetSeconds / 60);
    if (window.missionsManager) {
      window.missionsManager.checkStudyProgress(studiedMinutes);
    }
  }
  
  updateDisplay() {
    this.display.textContent = formatTime(this.seconds);
    
    // Change color when countdown is low
    if (this.mode === 'countdown' && this.seconds <= 60 && this.seconds > 0) {
      this.display.style.color = '#ff6b6b';
    } else {
      this.display.style.color = '#f5f0e8';
    }
  }
  
  getStudyMinutes() {
    return this.studyMinutes;
  }
}

// Initialize timer when DOM is ready
let timerInstance = null;

function initTimer() {
  timerInstance = new Timer();
  window.timer = timerInstance;
}

// Export
window.initTimer = initTimer;
window.Timer = Timer;
