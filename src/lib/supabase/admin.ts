import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client using the service role key.
 * This bypasses RLS and should ONLY be used in server actions
 * where ownership/authorization is manually verified in code.
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!serviceRoleKey) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
    }

    return createSupabaseClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
