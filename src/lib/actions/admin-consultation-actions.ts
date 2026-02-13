"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";
import {
  ConsultationRequestTable,
  ConsultationImageTable,
  TreatmentPlanTable
} from "@/types/database-booking-tables";

type ConsultationWithRelations = ConsultationRequestTable["Row"] & {
  user: { email: string; full_name: string | null } | null;
  clinic: { id: string; name: string; city: string } | null;
  images: ConsultationImageTable["Row"][];
  image_count?: number;
};

async function verifyAdminAccess(supabase: any, userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return profile?.role === "admin";
}

export async function getAllConsultationsAdmin(
  filters?: {
    status?: string;
    search?: string;
  },
  page: number = 1
): Promise<ActionResult<{ consultations: ConsultationWithRelations[]; total: number }>> {
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
      .from("consultation_requests")
      .select(`
        *,
        user:profiles!consultation_requests_user_id_fkey(email, full_name),
        clinic:clinics(id, name, city)
      `, { count: "exact" });

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters?.search) {
      query = query.or(`treatment_description.ilike.%${filters.search}%`);
    }

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    const { data: consultations, error, count } = await query;

    if (error) {
      console.error("Fetch consultations error:", error);
      return { success: false, error: "Failed to fetch consultations" };
    }

    const consultationIds = consultations?.map((c: any) => c.id) || [];
    const { data: imageCounts } = await supabase
      .from("consultation_images")
      .select("consultation_id")
      .in("consultation_id", consultationIds);

    const imageCountMap = (imageCounts || []).reduce((acc: Record<string, number>, img: any) => {
      acc[img.consultation_id] = (acc[img.consultation_id] || 0) + 1;
      return acc;
    }, {});

    const consultationsWithCounts = (consultations || []).map((c: any) => ({
      ...c,
      image_count: imageCountMap[c.id] || 0,
      images: [],
    }));

    return {
      success: true,
      data: {
        consultations: consultationsWithCounts,
        total: count || 0,
      },
    };
  } catch (error) {
    console.error("Get all consultations admin error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getConsultationByIdAdmin(
  id: string
): Promise<ActionResult<ConsultationWithRelations & {
  treatment_plans: TreatmentPlanTable["Row"][];
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

    const { data: consultation, error: consultationError } = await supabase
      .from("consultation_requests")
      .select(`
        *,
        user:profiles!consultation_requests_user_id_fkey(email, full_name),
        clinic:clinics(id, name, city)
      `)
      .eq("id", id)
      .single();

    if (consultationError || !consultation) {
      return { success: false, error: "Consultation not found" };
    }

    const { data: images } = await supabase
      .from("consultation_images")
      .select("*")
      .eq("consultation_id", id)
      .order("created_at", { ascending: true });

    const { data: treatmentPlans } = await supabase
      .from("treatment_plans")
      .select("*")
      .eq("consultation_id", id)
      .order("created_at", { ascending: false });

    return {
      success: true,
      data: {
        ...consultation,
        images: images || [],
        treatment_plans: treatmentPlans || [],
      } as any,
    };
  } catch (error) {
    console.error("Get consultation by ID admin error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function createTreatmentPlan(
  consultationId: string,
  planData: {
    clinicId: string;
    items: Array<{ treatment: string; price: number }>;
    notes?: string;
  }
): Promise<ActionResult<{ treatmentPlanId: string }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    if (!(await verifyAdminAccess(supabase, user.id))) {
      return { success: false, error: "Unauthorized", code: "FORBIDDEN" };
    }

    const { data: consultation } = await supabase
      .from("consultation_requests")
      .select("id")
      .eq("id", consultationId)
      .single();

    if (!consultation) {
      return { success: false, error: "Consultation not found" };
    }

    const totalUsd = planData.items.reduce((sum, item) => sum + item.price, 0);

    const insertData: TreatmentPlanTable["Insert"] = {
      consultation_id: consultationId,
      clinic_id: planData.clinicId,
      items: planData.items,
      total_usd: totalUsd,
      notes: planData.notes || null,
      status: "sent",
    };

    const { data: treatmentPlan, error: insertError } = await supabase
      .from("treatment_plans")
      .insert(insertData)
      .select("id")
      .single();

    if (insertError) {
      console.error("Treatment plan insert error:", insertError);
      return { success: false, error: "Failed to create treatment plan" };
    }

    const { error: updateError } = await (supabase
      .from("consultation_requests")
      .update({ status: "quoted" })
      .eq("id", consultationId) as any);

    if (updateError) {
      console.error("Consultation status update error:", updateError);
    }

    return { success: true, data: { treatmentPlanId: treatmentPlan.id } };
  } catch (error) {
    console.error("Create treatment plan error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
