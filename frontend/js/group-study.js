// Group Study with WebRTC

const API_BASE_URL = 'http://localhost:8000/api';

class GroupStudyManager {
  constructor() {
    this.localStream = null;
    this.peerConnections = {};
    this.roomId = null;
    this.userId = this.generateUserId();
    this.userName = this.loadUserName();
    this.micEnabled = false;
    this.cameraEnabled = false;
    this.screenSharing = false;
    this.members = [];
    this.studyTimer = null;
    this.studySeconds = 0;
    
    // PeerJS for real connections
    this.peer = null;
    this.peerId = null;
    this.calls = {};
    this.peers = {}; // Track all peers in room
    this.maxPeers = 2; // Maximum 3 people total (including self)
    
    // WebRTC configuration
    this.rtcConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    };
    
    // Simple signaling via localStorage (for same browser tabs)
    // For real multi-device, need Socket.IO server
    this.useLocalSignaling = true;
    
    this.init();
  }
  
  init() {
    this.setupUI();
    this.setupEventListeners();
    this.initPeerJS();
    this.loadRoomState();
    this.setupSignaling();
  }
  
  setupSignaling() {
    console.log('📡 Using localStorage signaling (same-browser only)');
    
    // Periodic status log
    setInterval(() => {
      if (this.roomId && this.peerId) {
        const peerCount = Object.keys(this.peers).length;
        console.log('📡 Room active:', this.roomId.substring(0, 8), '| Peers:', peerCount);
      }
    }, 30000); // Every 30 seconds
  }
  
  handleRoomUpdate(data) {
    if (!data) return;
    
    try {
      const roomData = JSON.parse(data);
      const peers = roomData.peers || [];
      
      // Connect to new peers
      peers.forEach(peerInfo => {
        if (peerInfo.peerId !== this.peerId && !this.peers[peerInfo.peerId]) {
          console.log('New peer detected:', peerInfo.peerId);
          this.connectToPeer(peerInfo.peerId);
        }
      });
    } catch (e) {
      console.error('Error handling room update:', e);
    }
  }
  
  checkRoomUpdates() {
    const roomKey = 'room_' + this.roomId;
    const roomData = localStorage.getItem(roomKey);
    if (roomData) {
      this.handleRoomUpdate(roomData);
    }
  }
  
  joinRoom(roomId) {
    this.roomId = roomId;
    saveData('currentRoomId', roomId);
    
    console.log('🚪 Joining room:', roomId);
    console.log('👤 My peer ID:', this.peerId);
    console.log('📡 Using API signaling (cross-device enabled)');
    
    this.joinRoomWithAPI(roomId);
    
    showToast('🔗 Đã tham gia phòng: ' + roomId.substring(0, 8));
  }
  
  async joinRoomWithAPI(roomId) {
    try {
      // Join room via API
      const response = await fetch(`${API_BASE_URL}/signaling/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          peerId: this.peerId,
          userName: this.userName
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Joined room via API. Other peers:', data.peers.length);
        
        // Connect to existing peers
        data.peers.forEach(peerInfo => {
          if (!this.peers[peerInfo.peerId]) {
            console.log('🔗 Connecting to existing peer:', peerInfo.peerId, peerInfo.userName);
            setTimeout(() => {
              if (this.localStream && !this.peers[peerInfo.peerId]) {
                this.connectToPeer(peerInfo.peerId);
              }
            }, 1500);
          }
        });
        
        // Start polling for new peers
        this.startPeerPolling();
        
        // Start heartbeat
        this.startHeartbeat();
      }
    } catch (error) {
      console.error('Join room error:', error);
      showToast('❌ Không thể tham gia phòng!');
    }
  }
  
  startPeerPolling() {
    // Poll for new peers every 3 seconds
    if (this.peerPollingInterval) {
      clearInterval(this.peerPollingInterval);
    }
    
    this.peerPollingInterval = setInterval(async () => {
      if (!this.roomId || !this.peerId) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/signaling/peers/${this.roomId}`);
        const data = await response.json();
        
        if (data.success) {
          // Connect to new peers
          data.peers.forEach(peerInfo => {
            if (peerInfo.peerId !== this.peerId && !this.peers[peerInfo.peerId]) {
              console.log('🔗 New peer detected:', peerInfo.peerId, peerInfo.userName);
              if (this.localStream) {
                this.connectToPeer(peerInfo.peerId);
              }
            }
          });
        }
      } catch (error) {
        console.error('Peer polling error:', error);
      }
    }, 3000);
  }
  
  startHeartbeat() {
    // Send heartbeat every 10 seconds
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.heartbeatInterval = setInterval(async () => {
      if (!this.roomId || !this.peerId) return;
      
      try {
        await fetch(`${API_BASE_URL}/signaling/heartbeat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: this.roomId,
            peerId: this.peerId
          })
        });
      } catch (error) {
        console.error('Heartbeat error:', error);
      }
    }, 10000);
  }
  
  
  // Legacy localStorage method (kept as fallback)
  joinRoomWithLocalStorage(roomId) {
    // Fallback to localStorage (same-browser only)
    const roomData = loadData('room_' + roomId, { peers: [] });
    
    // Add self if not already in
    if (!roomData.peers.find(p => p.peerId === this.peerId)) {
      roomData.peers.push({
        peerId: this.peerId,
        userName: this.userName,
        timestamp: Date.now()
      });
    }
    
    // Clean old peers (>60 seconds)
    const now = Date.now();
    roomData.peers = roomData.peers.filter(p => now - p.timestamp < 60000);
    
    saveData('room_' + roomId, roomData);
    
    console.log('📋 Room peers:', roomData.peers.map(p => p.peerId));
    
    // Try to connect to existing peers
    roomData.peers.forEach(peerInfo => {
      if (peerInfo.peerId !== this.peerId) {
        console.log('🔗 Attempting to connect to:', peerInfo.peerId);
        setTimeout(() => {
          if (this.localStream) {
            this.connectToPeer(peerInfo.peerId);
          } else {
            console.warn('⚠️ No local stream yet, waiting...');
          }
        }, 1000);
      }
    });
    
    // Keep updating presence
    this.presenceInterval = setInterval(() => {
      const currentRoom = loadData('room_' + this.roomId, { peers: [] });
      const myPeer = currentRoom.peers.find(p => p.peerId === this.peerId);
      
      if (myPeer) {
        myPeer.timestamp = Date.now();
      } else {
        currentRoom.peers.push({
          peerId: this.peerId,
          userName: this.userName,
          timestamp: Date.now()
        });
      }
      
      // Clean old peers
      const now = Date.now();
      currentRoom.peers = currentRoom.peers.filter(p => now - p.timestamp < 60000);
      
      saveData('room_' + this.roomId, currentRoom);
    }, 10000);
  }
  
  updateRoomPeers() {
    if (!this.roomId || !this.peerId) return;
    
    const roomKey = 'room_' + this.roomId;
    let roomData = { peers: [] };
    
    try {
      const existing = localStorage.getItem(roomKey);
      if (existing) {
        roomData = JSON.parse(existing);
      }
    } catch (e) {
      console.error('Error reading room data:', e);
    }
    
    // Add/update self
    const selfIndex = roomData.peers.findIndex(p => p.peerId === this.peerId);
    const selfData = {
      peerId: this.peerId,
      userName: this.userName,
      timestamp: Date.now()
    };
    
    if (selfIndex >= 0) {
      roomData.peers[selfIndex] = selfData;
    } else {
      roomData.peers.push(selfData);
    }
    
    // Remove stale peers (older than 30 seconds)
    const now = Date.now();
    roomData.peers = roomData.peers.filter(p => now - p.timestamp < 30000);
    
    // Limit to max peers
    if (roomData.peers.length > this.maxPeers + 1) {
      showToast('⚠️ Phòng đã đầy! Tối đa ' + (this.maxPeers + 1) + ' người');
      return;
    }
    
    localStorage.setItem(roomKey, JSON.stringify(roomData));
    
    // Trigger storage event manually for same tab
    window.dispatchEvent(new StorageEvent('storage', {
      key: roomKey,
      newValue: JSON.stringify(roomData)
    }));
  }
  
  connectToPeer(remotePeerId) {
    if (!this.localStream) {
      console.warn('No local stream, cannot connect');
      return;
    }
    
    if (this.peers[remotePeerId]) {
      console.log('Already connected to:', remotePeerId);
      return;
    }
    
    console.log('Connecting to peer:', remotePeerId);
    this.callPeer(remotePeerId);
  }
  
  initPeerJS() {
    // Check if PeerJS is loaded
    if (typeof Peer === 'undefined') {
      console.warn('PeerJS not loaded. Group call will not work.');
      showToast('❌ PeerJS không tải được!');
      return;
    }
    
    try {
      // Initialize PeerJS with metadata
      this.peer = new Peer({
        config: this.rtcConfig,
        debug: 2 // Enable debug logs
      });
      
      this.peer.on('open', (id) => {
        console.log('✅ PeerJS connected! My ID:', id);
        this.peerId = id;
        showToast('✅ Đã kết nối PeerJS!');
        
        // Check if joining a room via URL
        const urlParams = new URLSearchParams(window.location.search);
        const roomId = urlParams.get('room');
        
        if (roomId) {
          this.joinRoom(roomId);
        }
      });
      
      this.peer.on('call', (call) => {
        console.log('📞 Incoming call from:', call.peer);
        
        if (!this.localStream) {
          console.warn('No local stream, rejecting call');
          showToast('⚠️ Vui lòng bật camera/mic để nhận cuộc gọi!');
          return;
        }
        
        // Answer the call with local stream
        console.log('📞 Answering call...');
        call.answer(this.localStream);
        
        call.on('stream', (remoteStream) => {
          console.log('📺 Received remote stream from:', call.peer);
          this.addRemoteStream(call.peer, remoteStream);
          this.peers[call.peer] = { call, stream: remoteStream };
          showToast('✅ Đã kết nối với thành viên mới!');
        });
        
        call.on('close', () => {
          console.log('📴 Call closed:', call.peer);
          this.removeRemoteStream(call.peer);
          delete this.peers[call.peer];
        });
        
        call.on('error', (err) => {
          console.error('Call error:', err);
          showToast('❌ Lỗi kết nối: ' + err.type);
        });
        
        this.calls[call.peer] = call;
      });
      
      this.peer.on('error', (err) => {
        console.error('PeerJS error:', err);
        if (err.type === 'peer-unavailable') {
          showToast('❌ Không tìm thấy thành viên! Họ có thể đã offline.');
        } else if (err.type === 'network') {
          showToast('❌ Lỗi mạng! Kiểm tra kết nối internet.');
        } else if (err.type === 'server-error') {
          showToast('❌ Lỗi server! Thử lại sau.');
        } else {
          showToast('❌ Lỗi: ' + err.type);
        }
      });
      
      this.peer.on('disconnected', () => {
        console.warn('⚠️ PeerJS disconnected');
        showToast('⚠️ Mất kết nối. Đang thử kết nối lại...');
        // Try to reconnect
        setTimeout(() => {
          if (this.peer && !this.peer.destroyed) {
            this.peer.reconnect();
          }
        }, 3000);
      });
      
      this.peer.on('close', () => {
        console.log('🔌 PeerJS connection closed');
      });
      
    } catch (error) {
      console.error('PeerJS init error:', error);
      showToast('❌ Không thể khởi tạo kết nối!');
    }
  }
  
  callPeer(remotePeerId) {
    if (!this.peer || !this.localStream) {
      console.warn('❌ Cannot call: peer or localStream not ready');
      showToast('⚠️ Vui lòng bật camera/mic trước!');
      return;
    }
    
    if (this.peers[remotePeerId]) {
      console.log('ℹ️ Already connected to:', remotePeerId);
      return;
    }
    
    console.log('📞 Calling peer:', remotePeerId);
    console.log('📡 Local stream tracks:', {
      video: this.localStream.getVideoTracks().length,
      audio: this.localStream.getAudioTracks().length
    });
    
    try {
      const call = this.peer.call(remotePeerId, this.localStream);
      
      if (!call) {
        console.error('❌ Failed to create call');
        showToast('❌ Không thể tạo cuộc gọi!');
        return;
      }
      
      console.log('✅ Call created, waiting for stream...');
      
      call.on('stream', (remoteStream) => {
        console.log('📺 Received remote stream from:', remotePeerId);
        console.log('📡 Remote stream tracks:', {
          video: remoteStream.getVideoTracks().length,
          audio: remoteStream.getAudioTracks().length
        });
        
        this.addRemoteStream(remotePeerId, remoteStream);
        this.peers[remotePeerId] = { call, stream: remoteStream };
        showToast('✅ Đã kết nối với thành viên!');
      });
      
      call.on('close', () => {
        console.log('📴 Call closed:', remotePeerId);
        this.removeRemoteStream(remotePeerId);
        delete this.peers[remotePeerId];
      });
      
      call.on('error', (err) => {
        console.error('❌ Call error:', err);
        showToast('❌ Không thể kết nối: ' + err.type);
      });
      
      this.calls[remotePeerId] = call;
      
    } catch (error) {
      console.error('❌ Call peer error:', error);
      showToast('❌ Lỗi khi gọi!');
    }
  }
  
  addRemoteStream(peerId, stream) {
    // Check if already added
    if (document.getElementById(`video-${peerId}`)) {
      const video = document.getElementById(`video-${peerId}`);
      video.srcObject = stream;
      return;
    }
    
    // Find and remove first placeholder
    const placeholder = document.querySelector('.placeholder');
    if (placeholder) {
      placeholder.remove();
    }
    
    // Add video element
    this.addVideoElement(peerId, 'Friend', false);
    
    // Set stream
    const video = document.getElementById(`video-${peerId}`);
    if (video) {
      video.srcObject = stream;
      video.play().catch(e => console.error('Play error:', e));
    }
    
    // Update status
    this.updateStatusIcon(peerId, true, true);
  }
  
  removeRemoteStream(peerId) {
    const videoCard = document.getElementById(`video-card-${peerId}`);
    if (videoCard) {
      videoCard.remove();
      
      // Add placeholder back if needed
      const groupGrid = document.getElementById('group-grid');
      const placeholders = groupGrid.querySelectorAll('.placeholder');
      const currentPeers = Object.keys(this.peers).length;
      
      // Ensure we have enough placeholders
      while (placeholders.length < this.maxPeers - currentPeers) {
        this.addPlaceholder(placeholders.length + 1);
      }
      
      showToast('👋 Thành viên đã rời phòng');
    }
  }
  
  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
  
  loadUserName() {
    // Load from localStorage or URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlName = urlParams.get('name');
    
    if (urlName) {
      saveData('userName', urlName);
      return urlName;
    }
    
    return loadData('userName', 'You');
  }
  
  setUserName(name) {
    this.userName = name;
    saveData('userName', name);
    
    // Update display
    const nameLabel = document.querySelector('#video-card-local .member-name');
    if (nameLabel) {
      nameLabel.textContent = name;
    }
    
    // Update header
    const usernameEl = document.getElementById('username');
    if (usernameEl) {
      const titleIcon = usernameEl.textContent.match(/[🏅👑💎]/)?.[0] || '';
      usernameEl.textContent = titleIcon ? `${titleIcon} ${name}` : name;
    }
    
    showToast(`✅ Đã đổi tên thành: ${name}`);
  }
  
  setupUI() {
    // Add video grid container
    const groupGrid = document.getElementById('group-grid');
    if (!groupGrid) return;
    
    // Clear existing content
    groupGrid.innerHTML = '';
    
    // Add local video
    this.addVideoElement('local', this.userName, true);
    
    // Add placeholders for remote users (2 slots for 3 people total)
    for (let i = 1; i <= this.maxPeers; i++) {
      this.addPlaceholder(i);
    }
    
    // Add invite button
    this.addInviteButton();
    
    // Add screen share button
    this.addScreenShareButton();
    
    // Add change name button
    this.addChangeNameButton();
  }
  
  addVideoElement(id, name, isLocal = false) {
    const groupGrid = document.getElementById('group-grid');
    
    const card = document.createElement('div');
    card.className = 'member-card video-card';
    card.id = `video-card-${id}`;
    
    if (isLocal) {
      const badge = document.createElement('div');
      badge.className = 'you-badge';
      badge.textContent = 'You';
      card.appendChild(badge);
    }
    
    const video = document.createElement('video');
    video.id = `video-${id}`;
    video.autoplay = true;
    video.playsInline = true;
    if (isLocal) video.muted = true;
    video.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:12px;background:#000;';
    
    const nameLabel = document.createElement('div');
    nameLabel.className = 'member-name';
    nameLabel.textContent = name;
    nameLabel.style.cssText = 'position:absolute;bottom:8px;left:8px;background:rgba(0,0,0,0.7);color:white;padding:4px 8px;border-radius:6px;font-size:12px;';
    
    const statusIcon = document.createElement('div');
    statusIcon.className = 'status-icon';
    statusIcon.id = `status-${id}`;
    statusIcon.style.cssText = 'position:absolute;top:8px;left:8px;';
    
    card.appendChild(video);
    card.appendChild(nameLabel);
    card.appendChild(statusIcon);
    
    groupGrid.appendChild(card);
  }
  
  addPlaceholder(index) {
    const groupGrid = document.getElementById('group-grid');
    
    const card = document.createElement('div');
    card.className = 'member-card placeholder';
    card.id = `placeholder-${index}`;
    card.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:150px;';
    
    const icon = document.createElement('div');
    icon.textContent = '👤';
    icon.style.fontSize = '40px';
    
    const text = document.createElement('div');
    text.textContent = 'Waiting...';
    text.style.cssText = 'font-size:13px;color:#999;margin-top:8px;';
    
    card.appendChild(icon);
    card.appendChild(text);
    
    groupGrid.appendChild(card);
  }
  
  addInviteButton() {
    const groupGrid = document.getElementById('group-grid');
    
    const card = document.createElement('div');
    card.className = 'member-card invite';
    card.style.cursor = 'pointer';
    
    const icon = document.createElement('div');
    icon.className = 'plus-icon';
    icon.textContent = '+';
    
    const text = document.createElement('div');
    text.textContent = 'Invite Member';
    text.style.cssText = 'font-size:13px;font-weight:600;';
    
    card.appendChild(icon);
    card.appendChild(text);
    
    card.addEventListener('click', () => this.inviteMember());
    
    groupGrid.appendChild(card);
  }
  
  addScreenShareButton() {
    const camRow = document.querySelector('.cam-row');
    if (!camRow) return;
    
    const btn = document.createElement('button');
    btn.className = 'cam-btn';
    btn.id = 'screen-btn';
    btn.innerHTML = '🖥️ Share Screen';
    btn.addEventListener('click', () => this.toggleScreenShare());
    
    camRow.appendChild(btn);
  }
  
  addChangeNameButton() {
    const camRow = document.querySelector('.cam-row');
    if (!camRow) return;
    
    const btn = document.createElement('button');
    btn.className = 'cam-btn';
    btn.id = 'name-btn';
    btn.innerHTML = '✏️ Đổi tên';
    btn.addEventListener('click', () => this.showChangeNameDialog());
    
    camRow.appendChild(btn);
    
    // Add mirror toggle button
    const mirrorBtn = document.createElement('button');
    mirrorBtn.className = 'cam-btn';
    mirrorBtn.id = 'mirror-btn';
    mirrorBtn.innerHTML = '🔄 Mirror';
    mirrorBtn.title = 'Lật camera (mirror)';
    
    const isMirrored = loadData('videoMirrored', false); // Default: NO mirror
    if (isMirrored) {
      mirrorBtn.classList.add('on');
    }
    this.updateVideoMirror(isMirrored);
    
    mirrorBtn.addEventListener('click', () => {
      const currentState = loadData('videoMirrored', true);
      const newState = !currentState;
      saveData('videoMirrored', newState);
      
      mirrorBtn.classList.toggle('on', newState);
      this.updateVideoMirror(newState);
      
      showToast(newState ? '🔄 Camera đã lật (mirror)' : '↔️ Camera không lật');
    });
    
    camRow.appendChild(mirrorBtn);
  }
  
  updateVideoMirror(mirrored) {
    const localVideo = document.getElementById('video-local');
    if (localVideo) {
      localVideo.style.transform = mirrored ? 'scaleX(-1)' : 'scaleX(1)';
    }
  }
  
  showChangeNameDialog() {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 1000;
      max-width: 400px;
      width: 90%;
    `;
    
    dialog.innerHTML = `
      <h3 style="margin:0 0 10px 0;color:#2e7d32;">✏️ Đổi tên hiển thị</h3>
      <p style="font-size:13px;color:#666;margin-bottom:10px;">Tên này sẽ hiển thị cho các thành viên khác</p>
      <input type="text" id="name-input" value="${this.userName}" placeholder="Nhập tên của bạn" maxlength="20" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;margin-bottom:10px;">
      <div style="display:flex;gap:8px;">
        <button id="save-name-btn" style="flex:1;padding:10px;background:#4a7c59;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;">💾 Lưu</button>
        <button id="cancel-name-btn" style="flex:1;padding:10px;background:#999;color:white;border:none;border-radius:6px;cursor:pointer;">Hủy</button>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Focus input
    const input = document.getElementById('name-input');
    input.focus();
    input.select();
    
    // Save button
    document.getElementById('save-name-btn').addEventListener('click', () => {
      const newName = input.value.trim();
      if (newName && newName.length > 0) {
        this.setUserName(newName);
        dialog.remove();
      } else {
        showToast('⚠️ Vui lòng nhập tên!');
      }
    });
    
    // Cancel button
    document.getElementById('cancel-name-btn').addEventListener('click', () => {
      dialog.remove();
    });
    
    // Enter key to save
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('save-name-btn').click();
      }
    });
    
    // Escape key to cancel
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape' && dialog.parentElement) {
        dialog.remove();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }
  
  setupEventListeners() {
    // Mic button
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
      micBtn.addEventListener('click', () => this.toggleMic());
    }
    
    // Camera button
    const camBtn = document.getElementById('cam-btn');
    if (camBtn) {
      camBtn.addEventListener('click', () => this.toggleCamera());
    }
  }
  
  async toggleMic() {
    try {
      if (!this.localStream) {
        await this.startLocalStream();
      }
      
      this.micEnabled = !this.micEnabled;
      
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = this.micEnabled;
      }
      
      const micBtn = document.getElementById('mic-btn');
      if (micBtn) {
        micBtn.classList.toggle('on', this.micEnabled);
        micBtn.textContent = this.micEnabled ? '🎤 Mic ON' : '🎤 Mic';
      }
      
      this.updateStatusIcon('local', this.micEnabled, this.cameraEnabled);
      
      showToast(this.micEnabled ? '🎤 Đã bật mic' : '🎤 Đã tắt mic');
    } catch (error) {
      console.error('Mic error:', error);
      showToast('❌ Không thể truy cập mic!');
    }
  }
  
  async toggleCamera() {
    try {
      if (!this.localStream) {
        await this.startLocalStream();
      }
      
      this.cameraEnabled = !this.cameraEnabled;
      
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = this.cameraEnabled;
      }
      
      const camBtn = document.getElementById('cam-btn');
      if (camBtn) {
        camBtn.classList.toggle('on', this.cameraEnabled);
        camBtn.textContent = this.cameraEnabled ? '📷 Cam ON' : '📷 Camera';
      }
      
      this.updateStatusIcon('local', this.micEnabled, this.cameraEnabled);
      
      showToast(this.cameraEnabled ? '📷 Đã bật camera' : '📷 Đã tắt camera');
    } catch (error) {
      console.error('Camera error:', error);
      showToast('❌ Không thể truy cập camera!');
    }
  }
  
  async toggleScreenShare() {
    try {
      if (this.screenSharing) {
        // Stop screen sharing
        this.stopScreenShare();
      } else {
        // Start screen sharing
        await this.startScreenShare();
      }
    } catch (error) {
      console.error('Screen share error:', error);
      showToast('❌ Không thể chia sẻ màn hình!');
    }
  }
  
  async startLocalStream() {
    try {
      console.log('🎥 Requesting camera/mic access...');
      
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      console.log('✅ Got local stream:', this.localStream.id);
      
      const localVideo = document.getElementById('video-local');
      if (localVideo) {
        localVideo.srcObject = this.localStream;
        console.log('✅ Local video element updated');
      }
      
      // Disable by default
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = false;
        console.log('🎤 Audio track disabled by default');
      });
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = false;
        console.log('📷 Video track disabled by default');
      });
      
      showToast('✅ Đã kết nối thiết bị!');
      
      // Start study timer
      this.startStudyTimer();
      
      // If in a room, try to connect to peers
      if (this.roomId) {
        console.log('📡 In room, checking for peers...');
        const roomData = loadData('room_' + this.roomId, { peers: [] });
        console.log('👥 Room has', roomData.peers.length, 'peers');
        
        roomData.peers.forEach(peerInfo => {
          if (peerInfo.peerId !== this.peerId && !this.peers[peerInfo.peerId]) {
            console.log('🔗 Connecting to peer:', peerInfo.peerId);
            setTimeout(() => this.connectToPeer(peerInfo.peerId), 1000);
          }
        });
      }
      
    } catch (error) {
      console.error('getUserMedia error:', error);
      showToast('❌ Không thể truy cập camera/mic. Vui lòng cấp quyền!');
      throw error;
    }
  }
  
  async startScreenShare() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always'
        },
        audio: false
      });
      
      // Replace video track
      const screenTrack = screenStream.getVideoTracks()[0];
      const localVideo = document.getElementById('video-local');
      
      if (localVideo) {
        localVideo.srcObject = screenStream;
      }
      
      this.screenSharing = true;
      
      const screenBtn = document.getElementById('screen-btn');
      if (screenBtn) {
        screenBtn.classList.add('on');
        screenBtn.textContent = '🖥️ Stop Sharing';
      }
      
      // Handle stop sharing
      screenTrack.onended = () => {
        this.stopScreenShare();
      };
      
      showToast('🖥️ Đang chia sẻ màn hình');
      
    } catch (error) {
      console.error('Screen share error:', error);
      showToast('❌ Không thể chia sẻ màn hình!');
    }
  }
  
  stopScreenShare() {
    const localVideo = document.getElementById('video-local');
    if (localVideo && this.localStream) {
      localVideo.srcObject = this.localStream;
    }
    
    this.screenSharing = false;
    
    const screenBtn = document.getElementById('screen-btn');
    if (screenBtn) {
      screenBtn.classList.remove('on');
      screenBtn.textContent = '🖥️ Share Screen';
    }
    
    showToast('🖥️ Đã dừng chia sẻ màn hình');
  }
  
  updateStatusIcon(id, micOn, camOn) {
    const statusIcon = document.getElementById(`status-${id}`);
    if (!statusIcon) return;
    
    let icons = '';
    if (micOn) icons += '🎤 ';
    if (camOn) icons += '📷 ';
    if (!micOn && !camOn) icons = '🔇';
    
    statusIcon.textContent = icons;
  }
  
  inviteMember() {
    // Check if PeerJS is ready
    if (!this.peer || !this.peerId) {
      showToast('⏳ Đang khởi tạo kết nối... Vui lòng thử lại sau vài giây!');
      return;
    }
    
    // Check if camera/mic is on
    if (!this.localStream || (!this.micEnabled && !this.cameraEnabled)) {
      showToast('⚠️ Vui lòng bật camera hoặc mic trước khi mời!');
      return;
    }
    
    // Create room if not exists
    if (!this.roomId) {
      this.roomId = 'room_' + Math.random().toString(36).substr(2, 9);
      this.joinRoom(this.roomId);
    }
    
    const inviteLink = `${window.location.origin}${window.location.pathname}?room=${this.roomId}&name=`;
    
    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink).then(() => {
        showToast('✅ Đã sao chép link mời!');
        this.showInviteDialog(inviteLink);
      }).catch(() => {
        this.showInviteDialog(inviteLink);
      });
    } else {
      this.showInviteDialog(inviteLink);
    }
  }
  
  showInviteDialog(link) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 1000;
      max-width: 400px;
      width: 90%;
    `;
    
    const connectedCount = Object.keys(this.peers).length;
    const maxTotal = this.maxPeers + 1;
    
    dialog.innerHTML = `
      <h3 style="margin:0 0 10px 0;color:#2e7d32;">📱 Mời bạn bè (Group Study)</h3>
      <div style="background:#e3f2fd;padding:8px;border-radius:6px;margin-bottom:10px;font-size:12px;text-align:center;">
        👥 Đã kết nối: <strong>${connectedCount + 1}/${maxTotal}</strong> người
      </div>
      <p style="font-size:13px;color:#666;margin-bottom:10px;">Chia sẻ link này cho bạn bè:</p>
      <input type="text" value="${link}" readonly style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;font-size:12px;margin-bottom:10px;background:#f5f5f5;">
      <div style="background:#e8f5e9;padding:10px;border-radius:6px;margin-bottom:10px;font-size:12px;">
        <strong>✅ Hướng dẫn:</strong><br>
        1. Bật camera/mic của bạn<br>
        2. Copy link và gửi cho bạn bè<br>
        3. Bạn bè mở link → Bật camera/mic<br>
        4. Tự động kết nối với tất cả!<br>
        <br>
        <strong>🎯 Tối đa ${maxTotal} người cùng lúc</strong>
      </div>
      <p style="font-size:11px;color:#999;margin-bottom:10px;">💡 Mesh network (P2P). Mỗi người kết nối trực tiếp với người khác.</p>
      <div style="display:flex;gap:8px;">
        <button onclick="navigator.clipboard.writeText('${link}');showToast('✅ Đã copy!')" style="flex:1;padding:8px;background:#4a7c59;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;">📋 Copy Link</button>
        <button onclick="this.parentElement.parentElement.remove()" style="flex:1;padding:8px;background:#999;color:white;border:none;border-radius:6px;cursor:pointer;">Đóng</button>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Auto close after 30 seconds
    setTimeout(() => {
      if (dialog.parentElement) {
        dialog.remove();
      }
    }, 30000);
  }
  
  loadRoomState() {
    // Check if joining a room from URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    const urlName = urlParams.get('name');
    
    if (roomId) {
      this.roomId = roomId;
      saveData('currentRoomId', roomId);
      showToast('🔗 Đang tham gia phòng...');
      
      // Ask for name if not provided
      if (!urlName && this.userName === 'You') {
        setTimeout(() => {
          this.showChangeNameDialog();
        }, 500);
      }
      
      // Wait for PeerJS to be ready, then join room
      const waitForPeer = setInterval(() => {
        if (this.peerId) {
          clearInterval(waitForPeer);
          this.joinRoom(roomId);
        }
      }, 500);
      
      // Timeout after 10 seconds
      setTimeout(() => clearInterval(waitForPeer), 10000);
    }
  }
  
  startStudyTimer() {
    if (this.studyTimer) return;
    
    this.studyTimer = setInterval(() => {
      this.studySeconds++;
      const minutes = Math.floor(this.studySeconds / 60);
      
      // Update missions
      if (window.missionsManager) {
        window.missionsManager.checkGroupProgress(minutes);
      }
      
      // Save progress
      saveData('groupStudySeconds', this.studySeconds);
    }, 1000);
  }
  
  stopStudyTimer() {
    if (this.studyTimer) {
      clearInterval(this.studyTimer);
      this.studyTimer = null;
    }
  }
  
  cleanup() {
    // Leave room via API
    if (this.roomId && this.peerId) {
      fetch(`${API_BASE_URL}/signaling/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: this.roomId,
          peerId: this.peerId
        })
      }).catch(err => console.error('Leave room error:', err));
    }
    
    // Stop polling and heartbeat
    if (this.peerPollingInterval) {
      clearInterval(this.peerPollingInterval);
      this.peerPollingInterval = null;
    }
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    // Close all calls
    Object.values(this.calls).forEach(call => {
      try {
        call.close();
      } catch (e) {
        console.error('Error closing call:', e);
      }
    });
    this.calls = {};
    
    // Stop all tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    // Close all peer connections
    Object.values(this.peerConnections).forEach(pc => pc.close());
    
    // Destroy peer
    if (this.peer && !this.peer.destroyed) {
      this.peer.destroy();
    }
    
    // Stop presence interval
    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
      this.presenceInterval = null;
    }
    
    // Stop timer
    this.stopStudyTimer();
    
    showToast('👋 Đã rời phòng');
  }
  
  getStats() {
    return {
      roomId: this.roomId,
      userId: this.userId,
      studyMinutes: Math.floor(this.studySeconds / 60),
      micEnabled: this.micEnabled,
      cameraEnabled: this.cameraEnabled,
      screenSharing: this.screenSharing,
      members: this.members.length
    };
  }
}

// Initialize
let groupStudyManager = null;

function initGroupStudy() {
  groupStudyManager = new GroupStudyManager();
  window.groupStudyManager = groupStudyManager;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (groupStudyManager) {
    groupStudyManager.cleanup();
  }
});

// Export
window.initGroupStudy = initGroupStudy;
window.GroupStudyManager = GroupStudyManager;
