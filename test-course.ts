
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkCourse() {
    const { data, error } = await supabase
        .from('courses')
        .select('id, title, course_type, venue_name, venue_address, venue_city, venue_country')
        .ilike('title', '%Carbon Credit Trading%')
        .single()

    if (error) {
        console.error('Error fetching course:', error)
    } else {
        console.log('Course Data:', JSON.stringify(data, null, 2))
    }
}

checkCourse()
