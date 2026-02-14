export interface ConsultationRequestTable {
  Row: {
    id: string;
    user_id: string;
    clinic_id: string | null;
    treatment_description: string;
    patient_count: number;
    travel_dates: string | null;
    status: "pending" | "quoted" | "accepted" | "declined" | "expired";
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    clinic_id?: string | null;
    treatment_description: string;
    patient_count?: number;
    travel_dates?: string | null;
    status?: "pending" | "quoted" | "accepted" | "declined" | "expired";
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    clinic_id?: string | null;
    treatment_description?: string;
    patient_count?: number;
    travel_dates?: string | null;
    status?: "pending" | "quoted" | "accepted" | "declined" | "expired";
    created_at?: string;
    updated_at?: string;
  };
}

export interface ConsultationImageTable {
  Row: {
    id: string;
    consultation_id: string;
    image_url: string;
    image_type: "xray" | "photo" | "other" | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    consultation_id: string;
    image_url: string;
    image_type?: "xray" | "photo" | "other" | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    consultation_id?: string;
    image_url?: string;
    image_type?: "xray" | "photo" | "other" | null;
    created_at?: string;
  };
}

export interface TreatmentPlanTable {
  Row: {
    id: string;
    consultation_id: string;
    clinic_id: string;
    items: unknown;
    total_usd: number | null;
    total_vnd: number | null;
    notes: string | null;
    status: "draft" | "sent" | "accepted" | "declined";
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    consultation_id: string;
    clinic_id: string;
    items?: unknown;
    total_usd?: number | null;
    total_vnd?: number | null;
    notes?: string | null;
    status?: "draft" | "sent" | "accepted" | "declined";
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    consultation_id?: string;
    clinic_id?: string;
    items?: unknown;
    total_usd?: number | null;
    total_vnd?: number | null;
    notes?: string | null;
    status?: "draft" | "sent" | "accepted" | "declined";
    created_at?: string;
    updated_at?: string;
  };
}

export interface BookingTable {
  Row: {
    id: string;
    treatment_plan_id: string;
    user_id: string;
    clinic_id: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    confirmed_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    treatment_plan_id: string;
    user_id: string;
    clinic_id: string;
    status?: "pending" | "confirmed" | "completed" | "cancelled";
    confirmed_at?: string | null;
    completed_at?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    treatment_plan_id?: string;
    user_id?: string;
    clinic_id?: string;
    status?: "pending" | "confirmed" | "completed" | "cancelled";
    confirmed_at?: string | null;
    completed_at?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface TreatmentItem {
  name: string;
  nameEn?: string;
  category?: string;
  quantity: number;
  unit?: string;
  priceUsd: number;
  priceVnd: number;
  warrantyYears?: number;
  notes?: string;
}

export interface ClinicInfo {
  id: string;
  name: string;
  logo_url: string | null;
  city: string;
  rating: number;
  review_count: number;
  verified: boolean;
}

export type TreatmentPlanWithClinic = TreatmentPlanTable["Row"] & {
  clinic: ClinicInfo | null;
};
