const { getQuestionsBySubject } = require('../models/questionModel')
const { saveQuizAttempt, getQuizHistory } = require('../models/quizModel')
const { getUserById, updateStreak } = require('../models/userModel')

// ── GET /api/quiz/:subject ──
// Returns 10 questions for the given subject
const getQuestions = async (req, res) => {
  const { subject } = req.params

  try {
    const questions = await getQuestionsBySubject(subject)

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: `No questions found for subject: ${subject}` })
    }

    // Strip correct_answer before sending to frontend (don't expose answers!)
    const safeQuestions = questions.map(({ correct_answer, ...q }) => q)

    return res.status(200).json({ subject, questions: safeQuestions })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

// ── POST /api/quiz/submit ──
// Saves the quiz result and updates the user's streak
const submitQuiz = async (req, res) => {
  const { subject, answers } = req.body
  // answers = [{ questionId, selectedAnswer }, ...]
  const userId = req.user.id

  if (!subject || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'subject and answers array are required.' })
  }

  try {
    // Fetch correct answers from DB to score on server (never trust the client)
    const questions = await getQuestionsBySubject(subject)
    const questionMap = Object.fromEntries(questions.map(q => [q.id, q.correct_answer]))

    let correctCount = 0
    let wrongCount   = 0

    answers.forEach(({ questionId, selectedAnswer }) => {
      if (questionMap[questionId] === selectedAnswer) {
        correctCount++
      } else {
        wrongCount++
      }
    })

    const totalQuestions = answers.length
    const score = Math.round((correctCount / totalQuestions) * 100)

    // Save attempt
    const attempt = await saveQuizAttempt(userId, subject, score, totalQuestions, correctCount, wrongCount)

    // Update streak
    const user = await getUserById(userId)
    const today = new Date().toDateString()
    const lastStudy = user.last_study_date ? new Date(user.last_study_date).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    let newStreak = user.current_streak
    if (lastStudy !== today) {
      newStreak = lastStudy === yesterday ? newStreak + 1 : 1
    }

    const bestStreak = Math.max(newStreak, user.best_streak)
    await updateStreak(userId, newStreak, bestStreak, new Date().toISOString())

    return res.status(200).json({
      message:       'Quiz submitted successfully.',
      score,
      correctCount,
      wrongCount,
      totalQuestions,
      currentStreak: newStreak,
      attempt
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// ── GET /api/quiz/history ──
// Returns recent quiz attempts for the logged-in user
const getHistory = async (req, res) => {
  const userId = req.user.id

  try {
    const history = await getQuizHistory(userId)
    return res.status(200).json({ history })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = { getQuestions, submitQuiz, getHistory }
