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

// Create quiz
router.post('/create', async (req, res) => {
  try {
    const { title, difficulty, totalQuestions, timeLimit } = req.body;
    const userId = req.session.userId;

    const [result] = await db.query(
      'INSERT INTO quizzes (user_id, quiz_title, difficulty, total_questions, time_limit_minutes) VALUES (?, ?, ?, ?, ?)',
      [userId, title, difficulty || 'normal', totalQuestions, timeLimit || 30]
    );

    res.json({ success: true, quizId: result.insertId });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Submit quiz
router.post('/submit', async (req, res) => {
  try {
    const { quizId, score, correctAnswers, wrongAnswers } = req.body;
    const userId = req.session.userId;

    // Calculate leaves
    const leavesEarned = Math.floor(score / 10);

    // Update quiz
    await db.query(
      'UPDATE quizzes SET score = ?, correct_answers = ?, wrong_answers = ?, leaves_earned = ?, is_completed = TRUE, completed_at = NOW() WHERE quiz_id = ? AND user_id = ?',
      [score, correctAnswers, wrongAnswers, leavesEarned, quizId, userId]
    );

    // Update user
    await db.query(
      'UPDATE users SET total_leaves = total_leaves + ?, daily_leaves = daily_leaves + ?, total_quiz_completed = total_quiz_completed + 1 WHERE user_id = ?',
      [leavesEarned, leavesEarned, userId]
    );

    res.json({ success: true, leavesEarned });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Get user quizzes
router.get('/list', async (req, res) => {
  try {
    const userId = req.session.userId;
    const [quizzes] = await db.query(
      'SELECT * FROM quizzes WHERE user_id = ? ORDER BY started_at DESC LIMIT 20',
      [userId]
    );
    res.json({ success: true, quizzes });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;
