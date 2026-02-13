"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";
import { ReviewTable } from "@/types/database-clinic-tables";
import { checkAdminRole } from "@/lib/auth/admin-auth-helper";

/**
 * Extended review type with clinic and user info for admin view
 */
export interface AdminReviewRow {
  id: string;
  user_id: string;
  clinic_id: string;
  booking_id: string | null;
  rating: number;
  title: string;
  content: string;
  treatment_type: string | null;
  photos: string[];
  status: "pending" | "approved" | "flagged" | "removed";
  flagged: boolean;
  flagged_at: string | null;
  flagged_by: string | null;
  flag_reason: string | null;
  created_at: string;
  clinic?: {
    id: string;
    name: string;
    slug: string;
  };
  user?: {
    id: string;
    full_name: string | null;
  };
}

export type ReviewFilter = "all" | "flagged" | "by_clinic";

/**
 * Get all reviews with clinic and user info (admin only)
 */
export async function getAllReviews(
  filter: ReviewFilter = "all",
  clinicId?: string
): Promise<ActionResult<AdminReviewRow[]>> {
  try {
    await checkAdminRole();
    const supabase = await createClient();

    let query = supabase
      .from("reviews")
      .select(`
        *,
        clinic:clinics(id, name, slug),
        user:profiles(id, full_name)
      `)
      .order("created_at", { ascending: false });

    // Apply filters
    if (filter === "flagged") {
      query = query.eq("flagged", true);
    }

    if (clinicId) {
      query = query.eq("clinic_id", clinicId);
    }

    const { data: reviews, error } = await (query as any);

    if (error) {
      console.error("Get all reviews error:", error);
      return { success: false, error: "Failed to fetch reviews" };
    }

    return { success: true, data: reviews as AdminReviewRow[] };
  } catch (error) {
    console.error("Get all reviews error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get flagged review count (admin only)
 */
export async function getFlaggedReviewCount(): Promise<ActionResult<number>> {
  try {
    await checkAdminRole();
    const supabase = await createClient();

    const { count, error } = await (supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("flagged", true) as any);

    if (error) {
      console.error("Get flagged count error:", error);
      return { success: false, error: "Failed to get flagged count" };
    }

    return { success: true, data: count || 0 };
  } catch (error) {
    console.error("Get flagged count error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
