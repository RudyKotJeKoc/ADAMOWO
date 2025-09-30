import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type GenericSupabaseClient = SupabaseClient<Record<string, unknown>, 'public', Record<string, unknown>>;

let cachedClient: GenericSupabaseClient | null | undefined;

function resolveEnv(): { url: string; key: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON;

  if (typeof url === 'string' && url.length > 0 && typeof key === 'string' && key.length > 0) {
    return { url, key };
  }

  return null;
}

export function hasSupabaseConfig(): boolean {
  return resolveEnv() !== null;
}

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

export function __setSupabaseClientForTests(client: GenericSupabaseClient | null): void {
  cachedClient = client;
}
