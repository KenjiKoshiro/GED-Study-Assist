
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using what's in .env

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchQuestions() {
  try {
    // Check 'questions' table
    const { data: qData, error: qError } = await supabase.from('questions').select('*').limit(1);
    console.log('--- questions table ---');
    if (qError) console.error('Error:', qError.message);
    else console.log('Found:', qData.length, 'rows');

    // Check 'quiz_questions' table
    const { data: qqData, error: qqError } = await supabase.from('quiz_questions').select('*').limit(1);
    console.log('--- quiz_questions table ---');
    if (qqError) console.error('Error:', qqError.message);
    else console.log('Found:', qqData.length, 'rows');

    // Check 'flashcards' table
    const { data: fData, error: fError } = await supabase.from('flashcards').select('*').limit(1);
    console.log('--- flashcards table ---');
    if (fError) console.error('Error:', fError.message);
    else console.log('Found:', fData.length, 'rows');
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

fetchQuestions();
