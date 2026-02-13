/**
 * Profile Existence Safeguard
 *
 * Ensures a profile exists for a user after OAuth login, handling
 * race conditions where the trigger might fail or be delayed.
 */

import { createClient } from '@/lib/supabase/server';

interface EnsureProfileResult {
  success: boolean;
  profileExists: boolean;
  error?: string;
}

/**
 * Ensures a profile exists for the authenticated user
 *
 * Uses ON CONFLICT handling for idempotency and defense against
 * race conditions in the database trigger.
 *
 * @returns Result indicating success and profile status
 */
export async function ensureProfile(): Promise<EnsureProfileResult> {
  try {
    const supabase = await createClient();

    // Get current authenticated user
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        profileExists: false,
        error: 'No authenticated user'
      };
    }

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (expected if profile doesn't exist)
      const timestamp = new Date().toISOString();
      console.error(
        `[${timestamp}] [Profile Check Error]`,
        checkError.message
      );

      return {
        success: false,
        profileExists: false,
        error: checkError.message
      };
    }

    // Profile already exists
    if (existingProfile) {
      return {
        success: true,
        profileExists: true
      };
    }

    // Create profile using upsert with ON CONFLICT handling
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          full_name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            null,
          avatar_url: user.user_metadata?.avatar_url || null
        },
        {
          onConflict: 'id',
          ignoreDuplicates: false // Update if exists
        }
      );

    if (upsertError) {
      const timestamp = new Date().toISOString();
      console.error(
        `[${timestamp}] [Profile Upsert Error]`,
        upsertError.message
      );

      return {
        success: false,
        profileExists: false,
        error: upsertError.message
      };
    }

    // Profile created successfully
    return {
      success: true,
      profileExists: true
    };
  } catch (error) {
    const timestamp = new Date().toISOString();
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';

    console.error(`[${timestamp}] [Ensure Profile Error]`, errorMsg);

    return {
      success: false,
      profileExists: false,
      error: errorMsg
    };
  }
}
