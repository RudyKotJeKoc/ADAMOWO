import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Generic Supabase client type with flexible typing for any database schema.
 */
export type GenericSupabaseClient = SupabaseClient;

/**
 * Cached Supabase client instance.
 * - undefined: not yet initialized
 * - null: configuration is missing
 * - GenericSupabaseClient: successfully initialized client
 *
 * @internal
 */
let cachedClient: GenericSupabaseClient | null | undefined;

/**
 * Resolves and validates Supabase configuration from environment variables.
 * @returns {Object|null} Configuration object with url and key, or null if invalid/missing
 * @private
 */
function resolveEnv(): { url: string; key: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON;

  if (typeof url === 'string' && url.length > 0 && typeof key === 'string' && key.length > 0) {
    return { url, key };
  }

  return null;
}

/**
 * Checks if Supabase environment variables are properly configured.
 * @returns {boolean} True if VITE_SUPABASE_URL and VITE_SUPABASE_ANON are set and valid
 */
export function hasSupabaseConfig(): boolean {
  return resolveEnv() !== null;
}

/**
 * Returns a singleton Supabase client instance.
 * Creates a new client on first call if configuration is available.
 * Caches the result (client or null) for subsequent calls.
 * @returns {GenericSupabaseClient|null} Supabase client instance or null if no configuration
 */
export function getSupabaseClient(): GenericSupabaseClient | null {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const config = resolveEnv();

  if (!config) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(config.url, config.key, {
    auth: { persistSession: false },
  });

  return cachedClient;
}

/**
 * Overrides the cached Supabase client for testing purposes.
 * @param {GenericSupabaseClient|null} client - Mock client to use for tests
 * @internal
 */
export function __setSupabaseClientForTests(client: GenericSupabaseClient | null): void {
  cachedClient = client;
}
