const { getFlashcardsBySubject, saveFlashcardProgress, getUserFlashcardProgress } = require('../models/flashcardModel')

// ── GET /api/flashcards/:subject ──
const getFlashcards = async (req, res) => {
  const { subject } = req.params

  try {
    const cards = await getFlashcardsBySubject(subject)

    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: `No flashcards found for subject: ${subject}` })
    }

    // If user is logged in, attach their progress to each card
    let progress = []
    if (req.user) {
      progress = await getUserFlashcardProgress(req.user.id, subject)
    }

    const progressMap = Object.fromEntries(progress.map(p => [p.card_id, p.status]))
    const cardsWithProgress = cards.map(card => ({
      ...card,
      status: progressMap[card.id] || 'unseen'
    }))

    return res.status(200).json({ subject, cards: cardsWithProgress })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

// ── POST /api/flashcards/progress ──
const updateProgress = async (req, res) => {
  const { cardId, status } = req.body
  const userId = req.user.id

  if (!cardId || !['known', 'unknown'].includes(status)) {
    return res.status(400).json({ error: 'cardId and status (known/unknown) are required.' })
  }

  try {
    const result = await saveFlashcardProgress(userId, cardId, status)
    return res.status(200).json({ message: 'Progress saved.', result })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = { getFlashcards, updateProgress }
