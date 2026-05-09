const express    = require('express')
const router     = express.Router()
const { getFlashcards, updateProgress } = require('../controllers/flashcardController')
const { requireAuth } = require('../middleware/authMiddleware')

// GET /api/flashcards/:subject  — public (guest can browse, progress saved if logged in)
router.get('/:subject', getFlashcards)

// POST /api/flashcards/progress  — protected
router.post('/progress', requireAuth, updateProgress)

module.exports = router
