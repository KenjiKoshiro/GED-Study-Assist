const express    = require('express')
const router     = express.Router()
const { getQuestions, submitQuiz, getHistory } = require('../controllers/quizController')
const { requireAuth } = require('../middleware/authMiddleware')

// GET /api/quiz/:subject  — public (no login needed to see questions)
router.get('/:subject', getQuestions)

// POST /api/quiz/submit  — protected (must be logged in to save score)
router.post('/submit', requireAuth, submitQuiz)

// GET /api/quiz/history  — protected
router.get('/history', requireAuth, getHistory)

module.exports = router
