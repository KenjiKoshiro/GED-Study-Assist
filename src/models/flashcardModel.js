const supabase = require('../config/supabase')

// ── Get flashcards for a subject ──
const getFlashcardsBySubject = async (subject) => {
  const { data, error } = await supabase
    .from('flashcards')
    .select('id, subject, topic, front, back')
    .eq('subject', subject)

  if (error) throw error
  return data
}

// ── Save flashcard progress (known / unknown) ──
const saveFlashcardProgress = async (userId, cardId, status) => {
  // Upsert — update if exists, insert if not
  const { data, error } = await supabase
    .from('flashcard_progress')
    .upsert([{ user_id: userId, card_id: cardId, status, updated_at: new Date().toISOString() }],
            { onConflict: 'user_id, card_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Get a user's flashcard progress for a subject ──
const getUserFlashcardProgress = async (userId, subject) => {
  const { data, error } = await supabase
    .from('flashcard_progress')
    .select('card_id, status')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

module.exports = { getFlashcardsBySubject, saveFlashcardProgress, getUserFlashcardProgress }
