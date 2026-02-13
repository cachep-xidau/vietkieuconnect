"use server";

import { createClient } from "@/lib/supabase/server";
import { ClinicTable } from "@/types/database-clinic-tables";
import { ReviewTable } from "@/types/database-clinic-tables";
import { ActionResult } from "@/types/actions";

interface GetClinicsFilters {
  treatmentTypes?: string[];
  sortBy?: string;
  city?: string;
}

export async function getClinics(
  filters?: GetClinicsFilters
): Promise<ActionResult<ClinicTable["Row"][]>> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("clinics")
      .select("*")
      .eq("active", true);

    if (filters?.city && filters.city !== "All Cities") {
      query = query.eq("city", filters.city);
    }

    if (filters?.treatmentTypes && filters.treatmentTypes.length > 0) {
      query = query.contains("services", filters.treatmentTypes);
    }

    if (filters?.sortBy === "rating") {
      query = query.order("rating", { ascending: false });
    } else if (filters?.sortBy === "reviews") {
      query = query.order("review_count", { ascending: false });
    } else if (filters?.sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    } else {
      query = query.order("rating", { ascending: false });
    }

    const { data, error } = await (query as any);

    if (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch clinics",
    };
  }
}

export async function getClinicBySlug(
  slug: string
): Promise<ActionResult<ClinicTable["Row"] | null>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clinics")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return { success: true, data: null };
      }
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch clinic",
    };
  }
}

interface GetClinicReviewsOptions {
  sortBy?: string;
  page?: number;
  limit?: number;
}

export async function getClinicReviews(
  clinicId: string,
  options?: GetClinicReviewsOptions
): Promise<
  ActionResult<{ reviews: ReviewTable["Row"][]; total: number }>
> {
  try {
    const supabase = await createClient();
    const limit = options?.limit || 10;
    const page = options?.page || 1;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("reviews")
      .select("*", { count: "exact" })
      .eq("clinic_id", clinicId)
      .eq("status", "approved")
      .range(from, to);

    if (options?.sortBy === "highest") {
      query = query.order("rating", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query;

    if (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: true,
      data: {
        reviews: data || [],
        total: count || 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch reviews",
    };
  }
}

/**
 * Get all approved reviews for a clinic (for rating breakdown calculation)
 * Returns only rating field to minimize data transfer
 */
export async function getAllClinicReviews(
  clinicId: string
): Promise<ActionResult<Array<{ rating: number }>>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("clinic_id", clinicId)
      .eq("status", "approved");

    if (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch reviews",
    };
  }
}
