import { getSupabaseClient } from './supabaseClient';

export interface PageVisit {
  id?: number;
  path: string;
  visited_at?: string;
  user_agent?: string;
  referrer?: string;
  session_id?: string;
}

export interface VisitStats {
  total_visits: number;
  unique_sessions: number;
  last_visit: string;
  first_visit: string;
}

// Generate or retrieve session ID from localStorage
function getSessionId(): string {
  const SESSION_KEY = 'adamowo_session_id';
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    // Generate a simple UUID v4
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

// Track a page visit
export async function trackPageVisit(path: string): Promise<void> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn('Analytics: Supabase not configured, skipping page visit tracking');
    return;
  }

  try {
    const visit: PageVisit = {
      path,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      session_id: getSessionId(),
    };

    const { error } = await supabase.from('page_visits').insert([visit]);

    if (error) {
      console.error('Analytics: Error tracking page visit:', error);
    }
  } catch (error) {
    console.error('Analytics: Failed to track page visit:', error);
  }
}

// Get total visit count for all pages
export async function getTotalVisits(): Promise<number> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn('Analytics: Supabase not configured');
    return 0;
  }

  try {
    const { data, error } = await supabase.rpc('get_total_visits');

    if (error) {
      console.error('Analytics: Error getting total visits:', error);
      return 0;
    }

    return data || 0;
  } catch (error) {
    console.error('Analytics: Failed to get total visits:', error);
    return 0;
  }
}

// Get visit count for a specific path
export async function getVisitsByPath(path: string): Promise<number> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn('Analytics: Supabase not configured');
    return 0;
  }

  try {
    const { data, error } = await supabase.rpc('get_visits_by_path', { p_path: path });

    if (error) {
      console.error('Analytics: Error getting visits by path:', error);
      return 0;
    }

    return data || 0;
  } catch (error) {
    console.error('Analytics: Failed to get visits by path:', error);
    return 0;
  }
}

// Get visit statistics for a specific path
export async function getVisitStats(path: string): Promise<VisitStats | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn('Analytics: Supabase not configured');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('page_visit_stats')
      .select('*')
      .eq('path', path)
      .single();

    if (error) {
      console.error('Analytics: Error getting visit stats:', error);
      return null;
    }

    return data as VisitStats;
  } catch (error) {
    console.error('Analytics: Failed to get visit stats:', error);
    return null;
  }
}

// Get all visit statistics grouped by path
export async function getAllVisitStats(): Promise<Record<string, VisitStats>> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn('Analytics: Supabase not configured');
    return {};
  }

  try {
    const { data, error } = await supabase.from('page_visit_stats').select('*');

    if (error) {
      console.error('Analytics: Error getting all visit stats:', error);
      return {};
    }

    // Convert array to record keyed by path
    const stats: Record<string, VisitStats> = {};
    if (data) {
      data.forEach((stat: VisitStats & { path: string }) => {
        stats[stat.path] = stat;
      });
    }

    return stats;
  } catch (error) {
    console.error('Analytics: Failed to get all visit stats:', error);
    return {};
  }
}
