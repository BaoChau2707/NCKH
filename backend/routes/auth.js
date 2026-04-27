const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.json({ success: false, message: 'Missing required fields' });
    }

    // Check if email exists
    const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, full_name, display_name) VALUES (?, ?, ?, ?)',
      [email, passwordHash, fullName, fullName]
    );

    const userId = result.insertId;

    // Get user data
    const [users] = await db.query(
      'SELECT user_id, email, full_name, display_name, total_leaves, level FROM users WHERE user_id = ?',
      [userId]
    );

    // Set session
    req.session.userId = userId;
    req.session.email = email;

    res.json({
      success: true,
      message: 'Registration successful',
      user: users[0]
    });
  } catch (error) {
    console.error('Register error:', error);
    res.json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: 'Missing email or password' });
    }

    // Get user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );

    if (users.length === 0) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    // Update last login
    await db.query('UPDATE users SET last_login_at = NOW() WHERE user_id = ?', [user.user_id]);

    // Set session
    req.session.userId = user.user_id;
    req.session.email = user.email;

    // Remove sensitive data
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, message: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logout successful' });
});

// Check session
router.get('/check', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ success: false, message: 'No active session' });
    }

    const [users] = await db.query(
      'SELECT user_id, email, full_name, display_name, total_leaves, daily_leaves, level FROM users WHERE user_id = ?',
      [req.session.userId]
    );

    if (users.length === 0) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Session valid',
      user: users[0]
    });
  } catch (error) {
    console.error('Check session error:', error);
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;
