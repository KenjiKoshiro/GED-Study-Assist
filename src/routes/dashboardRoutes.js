// ── dashboardRoutes.js ──
const express             = require('express')
const dashRouter          = express.Router()
const { getDashboard }    = require('../controllers/dashboardController')
const { requireAuth }     = require('../middleware/authMiddleware')

// GET /api/dashboard  — protected
dashRouter.get('/', requireAuth, getDashboard)

module.exports = dashRouter
