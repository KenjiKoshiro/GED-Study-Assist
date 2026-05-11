
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error querying "questions" table:', error.message);
    } else {
      console.log('✅ Connected to Supabase!');
      if (data && data.length > 0) {
        console.log('✅ Found data in "questions" table.');
        console.log('Sample data:', JSON.stringify(data[0], null, 2));
      } else {
        console.log('⚠️ "questions" table exists but is currently EMPTY.');
      }
    }
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

checkConnection();
