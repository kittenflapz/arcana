import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  created_at: string
  username?: string
  has_begun: boolean
  start_date?: string
  home_timezone: string
  current_day: number
  year_intention?: string
}

export interface Reading {
  id: string
  user_id: string
  day_number: number
  cards: string[] // JSON array of card IDs
  oracle_response: string
  user_intention?: string
  journal_entry?: string
  created_at: string
}
