"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";
import { BookingTable, TreatmentPlanTable } from "@/types/database-booking-tables";
import { ClinicTable } from "@/types/database-clinic-tables";

type BookingWithRelations = BookingTable["Row"] & {
  user: { email: string; full_name: string | null } | null;
  clinic: Pick<ClinicTable["Row"], "id" | "name" | "city"> | null;
  treatment_plan: TreatmentPlanTable["Row"] | null;
};

async function verifyAdminAccess(supabase: any, userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return profile?.role === "admin";
}

export async function getAllBookingsAdmin(
  filters?: {
    status?: string;
    search?: string;
  },
  page: number = 1
): Promise<ActionResult<{ bookings: BookingWithRelations[]; total: number }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    if (!(await verifyAdminAccess(supabase, user.id))) {
      return { success: false, error: "Unauthorized", code: "FORBIDDEN" };
    }

    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from("bookings")
      .select(`
        *,
        user:profiles!bookings_user_id_fkey(email, full_name),
        clinic:clinics(id, name, city),
        treatment_plan:treatment_plans(*)
      `, { count: "exact" });

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters?.search) {
      query = query.ilike("status", `%${filters.search}%`);
    }

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    const { data: bookings, error, count } = await query;

    if (error) {
      console.error("Fetch bookings error:", error);
      return { success: false, error: "Failed to fetch bookings" };
    }

    return {
      success: true,
      data: {
        bookings: bookings as any || [],
        total: count || 0,
      },
    };
  } catch (error) {
    console.error("Get all bookings admin error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getBookingByIdAdmin(
  id: string
): Promise<ActionResult<BookingWithRelations & {
  consultation: { id: string } | null;
}>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    if (!(await verifyAdminAccess(supabase, user.id))) {
      return { success: false, error: "Unauthorized", code: "FORBIDDEN" };
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        *,
        user:profiles!bookings_user_id_fkey(email, full_name),
        clinic:clinics(*),
        treatment_plan:treatment_plans(*)
      `)
      .eq("id", id)
      .single();

    if (error || !booking) {
      return { success: false, error: "Booking not found" };
    }

    // Fetch consultation if treatment plan exists
    let consultation = null;
    if ((booking as any).treatment_plan) {
      const { data: consultationData } = await supabase
        .from("treatment_plans")
        .select("consultation_id")
        .eq("id", (booking as any).treatment_plan.id)
        .single();

      if (consultationData) {
        consultation = { id: consultationData.consultation_id };
      }
    }

    return {
      success: true,
      data: {
        ...(booking as any),
        consultation,
      },
    };
  } catch (error) {
    console.error("Get booking by ID admin error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateBookingStatus(
  id: string,
  status: "pending" | "confirmed" | "completed" | "cancelled"
): Promise<ActionResult<{ success: true }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    if (!(await verifyAdminAccess(supabase, user.id))) {
      return { success: false, error: "Unauthorized", code: "FORBIDDEN" };
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("id, status")
      .eq("id", id)
      .single();

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    // Validate status transition
    const currentStatus = booking.status;
    const validTransitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    if (!validTransitions[currentStatus]?.includes(status)) {
      return {
        success: false,
        error: `Cannot change status from ${currentStatus} to ${status}`
      };
    }

    const updateData: BookingTable["Update"] = { status };

    if (status === "confirmed") {
      updateData.confirmed_at = new Date().toISOString();
    } else if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
    }

    const { error: updateError } = await (supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id) as any);

    if (updateError) {
      console.error("Booking status update error:", updateError);
      return { success: false, error: "Failed to update booking status" };
    }

    return { success: true, data: { success: true } };
  } catch (error) {
    console.error("Update booking status error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
