const supabase = require('../config/supabase')

// ── Save a completed quiz attempt ──
const saveQuizAttempt = async (userId, subject, score, totalQuestions, correctCount, wrongCount) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert([{
      user_id:         userId,
      subject,
      score,
      total_questions: totalQuestions,
      correct_count:   correctCount,
      wrong_count:     wrongCount,
      attempted_at:    new Date().toISOString()
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Get quiz history for a user ──
const getQuizHistory = async (userId, limit = 10) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('attempted_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// ── Get average score per subject for a user ──
const getProgressBySubject = async (userId) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('subject, score')
    .eq('user_id', userId)

  if (error) throw error

  // Group by subject and calculate average
  const subjects = {}
  data.forEach(({ subject, score }) => {
    if (!subjects[subject]) subjects[subject] = { total: 0, count: 0 }
    subjects[subject].total += score
    subjects[subject].count += 1
  })

  return Object.entries(subjects).map(([subject, { total, count }]) => ({
    subject,
    average_score: Math.round(total / count)
  }))
}

module.exports = { saveQuizAttempt, getQuizHistory, getProgressBySubject }
