// Main application logic

class App {
  constructor() {
    this.currentTab = 'alone';
    this.leaves = 0;
    this.musicVolume = 50;
    this.selectedMusic = 'lofi';
    this.micOn = false;
    this.camOn = false;
    
    this.init();
  }
  
  init() {
    // Load saved data
    this.loadAppState();
    
    // Initialize auth system FIRST
    initAuth();
    
    // Initialize all modules
    initTimer();
    initQuiz();
    initMissions();
    initShop();
    initGroupStudy();
    
    // Setup navigation
    this.setupNavigation();
    
    // Setup music controls
    this.setupMusicControls();
    
    // Update displays
    updateLeavesDisplay(this.leaves);
    
    // Make app state globally accessible
    window.appState = this;
  }
  
  loadAppState() {
    this.leaves = loadData('leaves', 0);
    this.musicVolume = loadData('musicVolume', 50);
    this.selectedMusic = loadData('selectedMusic', 'lofi');
  }
  
  setupNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }
  
  switchTab(tabName) {
    // Update current tab
    this.currentTab = tabName;
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`page-${tabName}`);
    if (selectedPage) {
      selectedPage.classList.add('active');
    }
    
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }
  }
  
  setupMusicControls() {
    // Music select
    const musicSelect = document.getElementById('music-select');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const audioPlayer = document.getElementById('audio-player');
    
    // Set initial values
    musicSelect.value = this.selectedMusic;
    
    // Music sources mapping - Using free online audio for demo
    // Replace with your local files in production
    const musicSources = {
      'lofi': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      'rain': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      'cafe': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      'piano': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      'none': ''
    };
    
    // Music names
    const musicNames = {
      'lofi': '🎵 Lo-fi Beats',
      'rain': '🌊 Rain & Nature',
      'cafe': '🔔 Cafe Ambience',
      'piano': '🎹 Classical Piano',
      'none': '❌ No Music'
    };
    
    // Update play/pause button state
    const updatePlayPauseBtn = () => {
      if (audioPlayer.paused || this.selectedMusic === 'none') {
        playPauseBtn.textContent = '▶️ Play';
        playPauseBtn.classList.remove('playing');
      } else {
        playPauseBtn.textContent = '⏸️ Pause';
        playPauseBtn.classList.add('playing');
      }
    };
    
    // Play/Pause button
    playPauseBtn.addEventListener('click', () => {
      if (this.selectedMusic === 'none') {
        showToast('⚠️ Vui lòng chọn nhạc trước!');
        return;
      }
      
      if (audioPlayer.paused) {
        // Load source if not loaded
        if (!audioPlayer.src || audioPlayer.src === '') {
          audioPlayer.src = musicSources[this.selectedMusic];
          audioPlayer.volume = this.musicVolume / 100;
        }
        
        audioPlayer.play()
          .then(() => {
            updatePlayPauseBtn();
            showToast(`🎵 Đang phát: ${musicNames[this.selectedMusic]}`);
          })
          .catch(e => {
            console.error('Cannot play audio:', e);
            showToast('❌ Không thể phát nhạc. Vui lòng thử lại!');
          });
      } else {
        audioPlayer.pause();
        updatePlayPauseBtn();
        showToast('⏸️ Đã tạm dừng nhạc');
      }
    });
    
    // Music select change
    musicSelect.addEventListener('change', (e) => {
      this.selectedMusic = e.target.value;
      saveData('selectedMusic', this.selectedMusic);
      
      // Stop current music
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      
      // Load new music source
      if (this.selectedMusic !== 'none') {
        audioPlayer.src = musicSources[this.selectedMusic];
        audioPlayer.volume = this.musicVolume / 100;
        
        // Auto play new music
        audioPlayer.play()
          .then(() => {
            updatePlayPauseBtn();
            showToast(`🎵 Đang phát: ${musicNames[this.selectedMusic]}`);
          })
          .catch(e => {
            console.log('Audio autoplay blocked:', e);
            updatePlayPauseBtn();
            showToast('🎵 Click nút Play để phát nhạc');
          });
      } else {
        audioPlayer.src = '';
        updatePlayPauseBtn();
        showToast('❌ Đã tắt nhạc');
      }
    });
    
    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    const volVal = document.getElementById('vol-val');
    
    volumeSlider.value = this.musicVolume;
    volVal.textContent = this.musicVolume + '%';
    
    volumeSlider.addEventListener('input', (e) => {
      this.musicVolume = parseInt(e.target.value);
      volVal.textContent = this.musicVolume + '%';
      audioPlayer.volume = this.musicVolume / 100;
      saveData('musicVolume', this.musicVolume);
    });
    
    // Audio events
    audioPlayer.addEventListener('ended', () => {
      updatePlayPauseBtn();
    });
    
    audioPlayer.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      showToast('❌ Lỗi tải nhạc. Kiểm tra file audio!');
      updatePlayPauseBtn();
    });
    
    // Initial button state
    updatePlayPauseBtn();
    
    // Store audio player reference
    this.audioPlayer = audioPlayer;
  }
  
  setupGroupControls() {
    // Group controls are now handled by GroupStudyManager
    // Keep invite button handler for backward compatibility
    const inviteBtn = document.getElementById('invite-btn');
    if (inviteBtn) {
      inviteBtn.addEventListener('click', () => {
        if (window.groupStudyManager) {
          window.groupStudyManager.inviteMember();
        }
      });
    }
  }
  
  addLeaves(amount) {
    this.leaves = addLeaves(amount, this.leaves);
    updateLeavesDisplay(this.leaves);
    saveData('leaves', this.leaves);
  }
  
  getCurrentTab() {
    return this.currentTab;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  window.app = app;
  
  console.log('🍀 Study Garden initialized!');
});

// Export
window.App = App;
