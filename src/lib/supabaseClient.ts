import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Generic Supabase client type with any database schema.
 * Used to avoid tight coupling to specific database types.
 */
export type GenericSupabaseClient = SupabaseClient<any, any, any>;

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
 * Resolves Supabase configuration from environment variables.
 * Checks for VITE_SUPABASE_URL and VITE_SUPABASE_ANON.
 *
 * @returns Configuration object with url and key, or null if not configured
 *
 * @internal
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
 * Checks if Supabase configuration is available in environment variables.
 *
 * @returns true if VITE_SUPABASE_URL and VITE_SUPABASE_ANON are properly configured
 *
 * @example
 * ```typescript
 * if (hasSupabaseConfig()) {
 *   const client = getSupabaseClient();
 *   // Use client...
 * } else {
 *   console.log('Running in offline mode');
 * }
 * ```
 */
export function hasSupabaseConfig(): boolean {
  return resolveEnv() !== null;
}

/**
 * Gets or creates a Supabase client instance.
 * Uses singleton pattern with caching to avoid creating multiple clients.
 * Returns null if Supabase configuration is not available.
 *
 * The client is configured with:
 * - persistSession: false (stateless sessions for security)
 *
 * @returns Cached Supabase client instance, or null if configuration is missing
 *
 * @example
 * ```typescript
 * const client = getSupabaseClient();
 * if (client) {
 *   const { data, error } = await client
 *     .from('episodes')
 *     .select('*');
 * } else {
 *   // Fallback to mock data
 * }
 * ```
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
    auth: { persistSession: false }
  });

  return cachedClient;
}

/**
 * Sets the Supabase client instance for testing purposes.
 * Allows injecting a mock client to test code that depends on Supabase.
 *
 * @param client - Mock or test Supabase client instance, or null
 *
 * @internal
 *
 * @example
 * ```typescript
 * // In tests:
 * const mockClient = createMockSupabaseClient();
 * __setSupabaseClientForTests(mockClient);
 *
 * // Test code that uses getSupabaseClient()...
 *
 * // Cleanup:
 * __setSupabaseClientForTests(null);
 * ```
 */
export function __setSupabaseClientForTests(client: GenericSupabaseClient | null): void {
  cachedClient = client;
}
