import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Fetching home page...');
  const { data, error } = await supabase
      .from('pages')
      .select('*, page_sections(*)')
      .eq('slug', 'home')
      .eq('page_sections.is_active', true)
      .order('order_index', { foreignTable: 'page_sections', ascending: true })
      .maybeSingle();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data ? (data.page_sections ? data.page_sections.length : 0) : 'no data');
  }
}

test();
