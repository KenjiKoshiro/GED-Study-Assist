require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const authRoutes      = require('./routes/authRoutes')
const quizRoutes      = require('./routes/quizRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const flashcardRoutes = require('./routes/flashcardRoutes')
const mocktestRoutes  = require('./routes/mocktestRoutes')

const path    = require('path')
const app     = express()
const PORT    = process.env.PORT || 3000

// ── Middleware ──
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

// Serve static files from the 'view' directory
app.use(express.static(path.join(__dirname, '../src/view')))

// ── Frontend Routes ──
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/view/landing.html'))
})

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/view/auth.html'))
})

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/view/dashboard.html'))
})

app.get('/subjects', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/view/subjects.html'))
})

// ── Routes ──
app.use('/api/auth',      authRoutes)
app.use('/api/quiz',      quizRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/flashcards', flashcardRoutes)
app.use('/api/mocktest',  mocktestRoutes)

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'GEDReady API is running 🚀' })
})

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

const server = app.listen(PORT, () => {
  console.log(`✅ GEDReady server running on http://localhost:${PORT}`)
})

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err.message)
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`)
  }
})
