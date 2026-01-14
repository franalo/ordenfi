import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Solo inicializamos si las variables existen para evitar la pantalla en blanco
export const supabase = (supabaseUrl && supabaseUrl !== 'TU_URL_DE_SUPABASE')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
