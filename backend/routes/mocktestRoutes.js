const express    = require('express')
const router     = express.Router()
const { getMockTest, submitMockTest } = require('../controllers/mocktestController')
const { requireAuth } = require('../middleware/authMiddleware')

// GET /api/mocktest  — protected (premium feature)
router.get('/', requireAuth, getMockTest)

// POST /api/mocktest/submit  — protected
router.post('/submit', requireAuth, submitMockTest)

module.exports = router
