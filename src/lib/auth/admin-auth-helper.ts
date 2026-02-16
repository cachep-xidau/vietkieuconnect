"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Check if current user is admin
 * Throws redirect if not authenticated or not admin
 * @returns User ID if admin
 */
export async function checkAdminRole(): Promise<string> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const userRole = profile?.role;

  if (userRole !== "admin") {
    redirect("/dashboard");
  }

  return user.id;
}

/**
 * Check if user is authenticated (no admin requirement)
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUser(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

/**
 * Verify if a user has admin role (non-redirecting version).
 * Use in server actions that return ActionResult instead of redirecting.
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @returns true if admin, false otherwise
 */
export async function verifyAdminRole(supabase: any, userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return profile?.role === "admin";
}
