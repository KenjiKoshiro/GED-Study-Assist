const express    = require('express')
const router     = express.Router()
const { signup, login, logout, getMe } = require('../controllers/authController')
const { requireAuth } = require('../middleware/authMiddleware')

// POST /api/auth/signup
router.post('/signup', signup)

// POST /api/auth/login
router.post('/login', login)

// POST /api/auth/logout
router.post('/logout', logout)

// GET /api/auth/me  — protected
router.get('/me', requireAuth, getMe)

module.exports = router
