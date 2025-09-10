
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// POST /api/exam/start
router.post('/start', examController.startExam);

// POST /api/exam/submit
router.post('/submit', examController.submitExam);

// POST /api/exam/analyze (AI feedback)
router.post('/analyze', examController.analyzeAttempt);

// POST /api/exam/test-ai - Test AI question generation
router.post('/test-ai', examController.testAIQuestions);

module.exports = router;
