"use server";

import { createClient } from "@/lib/supabase/server";
import { ClinicTable } from "@/types/database-clinic-tables";
import { ActionResult } from "@/types/actions";

interface GetClinicsAdminFilters {
  search?: string;
  verified?: "all" | "verified" | "unverified";
  city?: string;
}

interface GetClinicsAdminResult {
  clinics: ClinicTable["Row"][];
  total: number;
}

/**
 * Get all clinics for admin with pagination and filters
 */
export async function getAllClinicsAdmin(
  filters?: GetClinicsAdminFilters,
  page: number = 1
): Promise<ActionResult<GetClinicsAdminResult>> {
  try {
    const supabase = await createClient();
    const limit = 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("clinics")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    // Search filter (name or city)
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
    }

    // Verified filter
    if (filters?.verified === "verified") {
      query = query.eq("verified", true);
    } else if (filters?.verified === "unverified") {
      query = query.eq("verified", false);
    }

    // City filter
    if (filters?.city && filters.city !== "all") {
      query = query.eq("city", filters.city);
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
        clinics: data || [],
        total: count || 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch clinics",
    };
  }
}

/**
 * Get clinic by ID for editing
 */
export async function getClinicById(
  id: string
): Promise<ActionResult<ClinicTable["Row"] | null>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("clinics")
      .select("*")
      .eq("id", id)
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

/**
 * Get unique cities from clinics
 */
export async function getClinicCities(): Promise<ActionResult<string[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("clinics")
      .select("city")
      .eq("active", true);

    if (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    // Extract unique cities
    const cities = Array.from(new Set(data.map((c: any) => c.city))) as string[];

    return {
      success: true,
      data: cities,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch cities",
    };
  }
}
