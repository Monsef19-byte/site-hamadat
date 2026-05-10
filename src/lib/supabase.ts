import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Residence queries
export async function getResidences() {
  const { data, error } = await supabase
    .from('residences')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getResidenceBySlug(slug: string) {
  const { data, error } = await supabase
    .from('residences')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getFeaturedResidences(limit = 3) {
  const { data, error } = await supabase
    .from('residences')
    .select('*')
    .eq('featured_on_home', true)
    .limit(limit);

  if (error) throw error;
  return data;
}

// Image queries
export async function getResidenceImages(residenceId: string) {
  const { data, error } = await supabase
    .from('residence_images')
    .select('*')
    .eq('residence_id', residenceId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

// Virtual tour queries
export async function getResidenceTour(residenceId: string) {
  const { data, error } = await supabase
    .from('residence_tours')
    .select('*')
    .eq('residence_id', residenceId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  return data || null;
}

// Admin functions
export async function loginAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getAdminSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
