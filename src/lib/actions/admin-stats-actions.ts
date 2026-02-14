"use server";

import { createClient } from "@/lib/supabase/server";
import { checkAdminRole } from "@/lib/auth/admin-auth-helper";

export interface DashboardStats {
  totalClinics: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
}

/**
 * Get dashboard statistics for admin overview
 * @returns Dashboard stats object
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  await checkAdminRole();
  const supabase = await createClient();

  // Count total clinics
  const { count: totalClinics } = await (supabase
    .from("clinics")
    .select("*", { count: "exact", head: true }) as any);

  // Count total bookings
  const { count: totalBookings } = await (supabase
    .from("bookings")
    .select("*", { count: "exact", head: true }) as any);

  // Calculate total revenue from bookings
  const { data: bookings } = await (supabase
    .from("bookings")
    .select("treatment_plan")
    .not("treatment_plan", "is", null) as any);

  const totalRevenue = bookings?.reduce((sum: number, booking: any) => {
    const plan = booking.treatment_plan as { total_usd?: number } | null;
    return sum + (plan?.total_usd || 0);
  }, 0) || 0;

  // Count active users (profiles)
  const { count: activeUsers } = await (supabase
    .from("profiles")
    .select("*", { count: "exact", head: true }) as any);

  return {
    totalClinics: totalClinics || 0,
    totalBookings: totalBookings || 0,
    totalRevenue,
    activeUsers: activeUsers || 0,
  };
}
