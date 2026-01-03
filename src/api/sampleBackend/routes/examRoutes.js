
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// POST /api/exam/start
router.post('/start', examController.startExam);

// POST /api/exam/submit
router.post('/submit', examController.submitExam);

<<<<<<< HEAD
=======
// POST /api/exam/analyze (AI feedback)
router.post('/analyze', examController.analyzeAttempt);

// GET /api/exam/feedback/:examId - Get AI feedback for specific exam
router.get('/feedback/:examId', examController.getAIFeedback);

// POST /api/exam/test-ai - Test AI question generation
router.post('/test-ai', examController.testAIQuestions);

>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
module.exports = router;
