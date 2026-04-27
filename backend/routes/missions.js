const express = require('express');
const router = express.Router();
const db = require('../config/database');

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.json({ success: false, message: 'Not authenticated' });
  }
  next();
};

router.use(requireAuth);

// Get missions list
router.get('/list', async (req, res) => {
  try {
    const [missions] = await db.query('SELECT * FROM missions WHERE is_active = TRUE ORDER BY display_order');
    res.json({ success: true, missions });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Get user progress
router.get('/progress', async (req, res) => {
  try {
    const userId = req.session.userId;
    const [progress] = await db.query(
      'SELECT * FROM daily_mission_progress_view WHERE user_id = ?',
      [userId]
    );
    res.json({ success: true, progress });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;
