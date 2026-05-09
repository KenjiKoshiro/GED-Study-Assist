const { getAllQuestionsForMockTest } = require('../models/questionModel')
const { saveQuizAttempt } = require('../models/quizModel')
const { getUserById, updateStreak } = require('../models/userModel')

// ── GET /api/mocktest ──
const getMockTest = async (req, res) => {
  try {
    const questions = await getAllQuestionsForMockTest()

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: 'No mock test questions available.' })
    }

    // Strip correct answers before sending
    const safeQuestions = questions.map(({ correct_answer, ...q }) => q)

    return res.status(200).json({
      totalQuestions: safeQuestions.length,
      durationMinutes: 90,
      questions: safeQuestions
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// ── POST /api/mocktest/submit ──
const submitMockTest = async (req, res) => {
  const { answers, timeTakenSeconds } = req.body
  // answers = [{ questionId, selectedAnswer }, ...]
  const userId = req.user.id

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers array is required.' })
  }

  try {
    const questions = await getAllQuestionsForMockTest()
    const questionMap = Object.fromEntries(questions.map(q => [q.id, q.correct_answer]))

    let correctCount = 0
    const resultsBySubject = {}

    answers.forEach(({ questionId, selectedAnswer }) => {
      const q = questions.find(q => q.id === questionId)
      if (!q) return

      const isCorrect = questionMap[questionId] === selectedAnswer
      if (isCorrect) correctCount++

      if (!resultsBySubject[q.subject]) {
        resultsBySubject[q.subject] = { correct: 0, total: 0 }
      }
      resultsBySubject[q.subject].total++
      if (isCorrect) resultsBySubject[q.subject].correct++
    })

    const totalQuestions = answers.length
    const score          = Math.round((correctCount / totalQuestions) * 100)
    const wrongCount     = totalQuestions - correctCount

    // Save as a mock test attempt
    const attempt = await saveQuizAttempt(userId, 'mock_test', score, totalQuestions, correctCount, wrongCount)

    // Update streak
    const user = await getUserById(userId)
    const today     = new Date().toDateString()
    const lastStudy = user.last_study_date ? new Date(user.last_study_date).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    let newStreak = user.current_streak
    if (lastStudy !== today) {
      newStreak = lastStudy === yesterday ? newStreak + 1 : 1
    }
    const bestStreak = Math.max(newStreak, user.best_streak)
    await updateStreak(userId, newStreak, bestStreak, new Date().toISOString())

    return res.status(200).json({
      message:         'Mock test submitted.',
      score,
      correctCount,
      wrongCount,
      totalQuestions,
      timeTakenSeconds,
      resultsBySubject,
      currentStreak:   newStreak,
      attempt
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = { getMockTest, submitMockTest }
