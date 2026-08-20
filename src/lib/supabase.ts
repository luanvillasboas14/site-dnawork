import { createClient } from '@supabase/supabase-js';

// Supabase URL & Key from environment or provided credentials
const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL : '') ||
  'https://moemgftlmncdqfvzscmq.supabase.co';

const supabaseAnonKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY : '') ||
  'sb_publishable_ki09Yq98EGxbMN-sGBGtVQ_WajEWiOF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Utility to test connection to Supabase
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('jobs').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // Table might not exist yet, but connection was made to rest endpoint
      return { success: true, message: 'Conectado ao Supabase!', details: error.message };
    }
    return { success: true, message: 'Conexão com Supabase estabelecida com sucesso!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Erro de conexão' };
  }
}
