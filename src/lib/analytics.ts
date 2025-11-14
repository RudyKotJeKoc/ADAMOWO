import { getSupabaseClient } from './supabaseClient';

/**
 * Represents a single page visit record.
 * @interface PageVisit
 * @property {number} [id] - Unique visit identifier (assigned by database)
 * @property {string} path - URL path that was visited
 * @property {string} [visited_at] - ISO timestamp of the visit
 * @property {string} [user_agent] - Browser user agent string
 * @property {string} [referrer] - Referrer URL if available
 * @property {string} [session_id] - Unique session identifier for tracking unique visitors
 */
export interface PageVisit {
  id?: number;
  path: string;
  visited_at?: string;
  user_agent?: string;
  referrer?: string;
  session_id?: string;
}

/**
 * Aggregated visit statistics for a specific path.
 * @interface VisitStats
 * @property {number} total_visits - Total number of page views
 * @property {number} unique_sessions - Number of unique visitor sessions
 * @property {string} last_visit - ISO timestamp of the most recent visit
 * @property {string} first_visit - ISO timestamp of the first recorded visit
 */
export interface VisitStats {
  total_visits: number;
  unique_sessions: number;
  last_visit: string;
  first_visit: string;
}

/**
 * Generates or retrieves a persistent session UUID from localStorage.
 * Creates a new UUID v4 if one doesn't exist.
 * @returns {string} Session UUID for tracking unique visitors
 * @private
 */
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

/**
 * Tracks a page visit by inserting a record into the Supabase page_visits table.
 * Includes session ID, user agent, and referrer information.
 * Silently fails if Supabase is not configured.
 * @param {string} path - URL path to track
 * @returns {Promise<void>}
 */
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

/**
 * Fetches the total visit count across all pages.
 * Uses the Supabase RPC function 'get_total_visits'.
 * @returns {Promise<number>} Total number of page visits, or 0 if unavailable
 */
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

/**
 * Retrieves the visit count for a specific URL path.
 * Uses the Supabase RPC function 'get_visits_by_path'.
 * @param {string} path - URL path to query
 * @returns {Promise<number>} Number of visits for the path, or 0 if unavailable
 */
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

/**
 * Fetches comprehensive visit statistics for a specific path.
 * Queries the 'page_visit_stats' view which includes aggregated data.
 * @param {string} path - URL path to query
 * @returns {Promise<VisitStats|null>} Visit statistics object, or null if unavailable
 */
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

/**
 * Retrieves all visit statistics grouped by path.
 * Queries the 'page_visit_stats' view and returns data as a keyed record.
 * @returns {Promise<Record<string, VisitStats>>} Object mapping paths to their visit stats, or empty object if unavailable
 */
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
