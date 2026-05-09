const supabase = require('../config/supabase')
const { createUserProfile } = require('../models/userModel')

// ── POST /api/auth/signup ──
const signup = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' })
  }

  try {
    // Create auth user in Supabase
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) return res.status(400).json({ error: error.message })

    // Create matching profile row in our users table
    await createUserProfile(data.user.id, email)

    return res.status(201).json({
      message: 'Account created successfully. Please check your email to confirm.',
      user: { id: data.user.id, email: data.user.email }
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// ── POST /api/auth/login ──
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return res.status(401).json({ error: 'Invalid email or password.' })

    return res.status(200).json({
      message: 'Logged in successfully.',
      token: data.session.access_token,
      user: { id: data.user.id, email: data.user.email }
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// ── POST /api/auth/logout ──
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ message: 'Logged out successfully.' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// ── GET /api/auth/me ──
// Returns the currently logged-in user (requires auth middleware)
const getMe = async (req, res) => {
  return res.status(200).json({
    user: { id: req.user.id, email: req.user.email }
  })
}

module.exports = { signup, login, logout, getMe }
