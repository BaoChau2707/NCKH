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

// Get shop items
router.get('/items', async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM shop_items WHERE is_available = TRUE ORDER BY display_order');
    res.json({ success: true, items });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Get user inventory
router.get('/inventory', async (req, res) => {
  try {
    const userId = req.session.userId;
    const [inventory] = await db.query(
      'SELECT ui.*, si.item_name, si.item_category FROM user_inventory ui JOIN shop_items si ON ui.item_id = si.item_id WHERE ui.user_id = ?',
      [userId]
    );
    res.json({ success: true, inventory });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Purchase item
router.post('/purchase', async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.session.userId;

    await db.query('CALL purchase_item(?, ?, ?, @success, @message)', [userId, itemId, quantity || 1]);
    const [[result]] = await db.query('SELECT @success as success, @message as message');

    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;
