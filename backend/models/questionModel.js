const supabase = require('../config/supabase')

const VALID_SUBJECTS = ['math', 'science', 'social_studies', 'rla']

// ── Get 10 random questions for a subject ──
const getQuestionsBySubject = async (subject) => {
  if (!VALID_SUBJECTS.includes(subject)) {
    throw new Error(`Invalid subject. Must be one of: ${VALID_SUBJECTS.join(', ')}`)
  }

  const { data, error } = await supabase
    .from('questions')
    .select('id, subject, topic, type:question_type, question_text:question, options, correct_answer, explanation')
    .eq('subject', subject)
    .limit(30)

  if (error) throw error
  return data
}

// ── Get all questions for mock test (all 4 subjects, 10 each = 40 total) ──
const getAllQuestionsForMockTest = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('id, subject, topic, type:question_type, question_text:question, options, correct_answer, explanation')
    .limit(40)

  if (error) throw error
  return data
}

module.exports = { getQuestionsBySubject, getAllQuestionsForMockTest }
