import { createSupabaseServerClient } from "./supabase-server";

// The database decides membership from auth.uid(), not editable profile fields.
export async function requireSiteAdmin() {
  const client = await createSupabaseServerClient();
  if (!client) return { client: null, status: 503 as const };
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return { client: null, status: 401 as const };
  const { data: allowed, error: roleError } = await client.rpc("is_site_admin");
  if (roleError) return { client: null, status: 503 as const };
  if (allowed !== true) return { client: null, status: 403 as const };
  return { client, status: 200 as const };
}

export const adminHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Vary": "Cookie",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
};
