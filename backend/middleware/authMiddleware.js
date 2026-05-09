const supabase = require('../config/supabase')

// Attach this to any route that requires a logged-in user
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header.' })
  }

  const token = authHeader.split(' ')[1]

  // Verify the token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' })
  }

  // Attach user to request so controllers can use it
  req.user = user
  next()
}

module.exports = { requireAuth }
