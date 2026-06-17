import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key missing in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing connection to Supabase:', supabaseUrl);
  
  // Test profiles table
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
    
  if (error) {
    console.log('Profiles table check error:', error.message);
  } else {
    console.log('Profiles table exists! Sample data:', data);
  }

  // Check portfolios
  const { data: portData, error: portError } = await supabase
    .from('portfolios')
    .select('*')
    .limit(1);

  if (portError) {
    console.log('Portfolios table check error:', portError.message);
  } else {
    console.log('Portfolios table exists! Sample data:', portData);
  }
}

test();
