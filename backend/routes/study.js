const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Middleware: Check auth
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.json({ success: false, message: 'Not authenticated' });
  }
  next();
};

router.use(requireAuth);

// Start study session
router.post('/start', async (req, res) => {
  try {
    const { sessionType, musicType, timerMode, targetMinutes } = req.body;
    const userId = req.session.userId;

    const [result] = await db.query(
      'INSERT INTO study_sessions (user_id, session_type, start_time, music_type, timer_mode, target_minutes) VALUES (?, ?, NOW(), ?, ?, ?)',
      [userId, sessionType || 'alone', musicType, timerMode || 'countup', targetMinutes]
    );

    res.json({
      success: true,
      message: 'Session started',
      sessionId: result.insertId
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.json({ success: false, message: error.message });
  }
});

// End study session
router.post('/end', async (req, res) => {
  try {
    const { sessionId, durationMinutes, sessionType } = req.body;
    const userId = req.session.userId;

    // Calculate leaves
    let leavesEarned = 0;
    if (durationMinutes >= 15) leavesEarned = 10;
    if (durationMinutes >= 30) leavesEarned = 20;

    // Update session
    await db.query(
      'UPDATE study_sessions SET end_time = NOW(), duration_minutes = ?, leaves_earned = ?, is_completed = TRUE WHERE session_id = ? AND user_id = ?',
      [durationMinutes, leavesEarned, sessionId, userId]
    );

    // Update user stats
    await db.query(
      'UPDATE users SET total_leaves = total_leaves + ?, daily_leaves = daily_leaves + ?, total_study_minutes = total_study_minutes + ? WHERE user_id = ?',
      [leavesEarned, leavesEarned, durationMinutes, userId]
    );

    // Update missions
    const missionPrefix = sessionType === 'alone' ? 'STUDY_ALONE_' : 'STUDY_GROUP_';
    if (durationMinutes >= 15) {
      await db.query('CALL update_mission_progress(?, ?, ?)', [userId, missionPrefix + '15', 15]);
    }
    if (durationMinutes >= 30) {
      await db.query('CALL update_mission_progress(?, ?, ?)', [userId, missionPrefix + '30', 30]);
    }

    res.json({
      success: true,
      message: 'Session ended',
      leavesEarned,
      durationMinutes
    });
  } catch (error) {
    console.error('End session error:', error);
    res.json({ success: false, message: error.message });
  }
});

// Get stats
router.get('/stats', async (req, res) => {
  try {
    const userId = req.session.userId;

    const [stats] = await db.query('SELECT * FROM user_stats_view WHERE user_id = ?', [userId]);

    res.json({
      success: true,
      message: 'Stats retrieved',
      stats: stats[0] || {}
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;
