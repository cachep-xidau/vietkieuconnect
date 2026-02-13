// Dashboard data types

export interface DashboardStats {
  totalSaved: number;
  totalSavedTrend: string;
  activeConsultations: number;
  bookings: number;
  nextAppointment: {
    date: string;
    time: string;
    clinic: string;
  } | null;
}

export interface TimelineActivity {
  id: string;
  type: 'consultation' | 'booking' | 'review';
  status: 'pending' | 'quoted' | 'confirmed' | 'completed';
  date: string;
  title: string;
  subtitle?: string;
  clinic: { name: string; city: string };
  price?: number;
  details?: string;
}

export interface ClinicRecommendation {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviewCount: number;
  matchScore: number;
  reason: string;
  specialties: string[];
  logo?: string;
}

export interface TreatmentRecommendation {
  name: string;
  usPrice: number;
  vnPrice: number;
  savings: number;
  trending: boolean;
  reason: string;
}

export interface DashboardRecommendations {
  clinics: ClinicRecommendation[];
  treatments: TreatmentRecommendation[];
}
