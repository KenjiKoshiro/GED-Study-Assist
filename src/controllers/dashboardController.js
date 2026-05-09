const { getUserById } = require('../models/userModel')
const { getQuizHistory, getProgressBySubject } = require('../models/quizModel')

// ── GET /api/dashboard ──
// Returns everything the dashboard needs in one request
const getDashboard = async (req, res) => {
  const userId = req.user.id

  try {
    const [user, recentActivity, subjectProgress] = await Promise.all([
      getUserById(userId),
      getQuizHistory(userId, 5),
      getProgressBySubject(userId)
    ])

    // Total quizzes and average score
    const allHistory = await getQuizHistory(userId, 1000)
    const totalQuizzes = allHistory.length
    const avgScore = totalQuizzes > 0
      ? Math.round(allHistory.reduce((sum, a) => sum + a.score, 0) / totalQuizzes)
      : 0

    // Mock tests count (subject = 'mock_test')
    const mockTests = allHistory.filter(a => a.subject === 'mock_test').length

    return res.status(200).json({
      user: {
        id:             user.id,
        email:          user.email,
        currentStreak:  user.current_streak,
        bestStreak:     user.best_streak,
        lastStudyDate:  user.last_study_date
      },
      stats: {
        totalQuizzes,
        avgScore,
        mockTests
      },
      subjectProgress,
      recentActivity
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = { getDashboard }
