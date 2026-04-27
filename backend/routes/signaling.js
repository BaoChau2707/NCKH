const express = require('express');
const router = express.Router();

// In-memory storage for rooms (in production, use Redis)
const rooms = new Map();

// Clean up old rooms every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [roomId, room] of rooms.entries()) {
    // Remove peers older than 60 seconds
    room.peers = room.peers.filter(peer => now - peer.timestamp < 60000);
    
    // Remove empty rooms
    if (room.peers.length === 0) {
      rooms.delete(roomId);
    }
  }
}, 5 * 60 * 1000);

// Join room
router.post('/join', (req, res) => {
  try {
    const { roomId, peerId, userName } = req.body;

    if (!roomId || !peerId) {
      return res.json({ success: false, message: 'Missing roomId or peerId' });
    }

    // Get or create room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { peers: [] });
    }

    const room = rooms.get(roomId);

    // Check if peer already exists
    const existingPeer = room.peers.find(p => p.peerId === peerId);
    if (existingPeer) {
      // Update timestamp
      existingPeer.timestamp = Date.now();
      existingPeer.userName = userName || existingPeer.userName;
    } else {
      // Add new peer
      room.peers.push({
        peerId,
        userName: userName || 'Anonymous',
        timestamp: Date.now()
      });
    }

    // Return other peers in room
    const otherPeers = room.peers.filter(p => p.peerId !== peerId);

    res.json({
      success: true,
      peers: otherPeers,
      totalPeers: room.peers.length
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.json({ success: false, message: error.message });
  }
});

// Leave room
router.post('/leave', (req, res) => {
  try {
    const { roomId, peerId } = req.body;

    if (!roomId || !peerId) {
      return res.json({ success: false, message: 'Missing roomId or peerId' });
    }

    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.peers = room.peers.filter(p => p.peerId !== peerId);

      // Remove empty room
      if (room.peers.length === 0) {
        rooms.delete(roomId);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Leave room error:', error);
    res.json({ success: false, message: error.message });
  }
});

// Get room peers (polling)
router.get('/peers/:roomId', (req, res) => {
  try {
    const { roomId } = req.params;

    if (!rooms.has(roomId)) {
      return res.json({ success: true, peers: [] });
    }

    const room = rooms.get(roomId);
    const now = Date.now();

    // Filter out stale peers
    room.peers = room.peers.filter(peer => now - peer.timestamp < 60000);

    res.json({
      success: true,
      peers: room.peers,
      totalPeers: room.peers.length
    });
  } catch (error) {
    console.error('Get peers error:', error);
    res.json({ success: false, message: error.message });
  }
});

// Heartbeat (keep alive)
router.post('/heartbeat', (req, res) => {
  try {
    const { roomId, peerId } = req.body;

    if (!roomId || !peerId) {
      return res.json({ success: false, message: 'Missing roomId or peerId' });
    }

    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      const peer = room.peers.find(p => p.peerId === peerId);
      
      if (peer) {
        peer.timestamp = Date.now();
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;
