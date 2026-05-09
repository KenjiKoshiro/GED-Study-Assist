const supabase = require('../config/supabase')

// ── Get user profile ──
const getUserById = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// ── Create user profile after signup ──
// Supabase Auth creates the auth record — we create a matching row in our users table
const createUserProfile = async (userId, email) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ id: userId, email, current_streak: 0, best_streak: 0 }])
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Update streak ──
const updateStreak = async (userId, currentStreak, bestStreak, lastStudyDate) => {
  const { data, error } = await supabase
    .from('users')
    .update({ current_streak: currentStreak, best_streak: bestStreak, last_study_date: lastStudyDate })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

module.exports = { getUserById, createUserProfile, updateStreak }
