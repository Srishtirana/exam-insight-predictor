
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// POST /api/exam/start
router.post('/start', examController.startExam);

// POST /api/exam/submit
router.post('/submit', examController.submitExam);

module.exports = router;
