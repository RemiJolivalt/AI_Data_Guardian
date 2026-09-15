import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client factory (ADR-0008). Instantiated lazily so that local demo mode,
 * which has no Supabase configured, never fails at import time.
 *
 * The deterministic core never imports this directly; only the repository layer does.
 */
/** Server-side client using the service-role secret. Never import into client components. */
export function createServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase server is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or run in demo mode with the local repository.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Browser client using the publishable (anon) key. Safe to expose to the client. */
export function createBrowserClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return createClient(url, key);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
