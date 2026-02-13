import type { ProfileTable, NotificationTable } from "./database-user-tables";
import type { ClinicTable, ReviewTable } from "./database-clinic-tables";
import type {
  ConsultationRequestTable,
  ConsultationImageTable,
  TreatmentPlanTable,
  BookingTable,
} from "./database-booking-tables";

export interface Database {
  public: {
    Tables: {
      profiles: ProfileTable;
      clinics: ClinicTable;
      consultation_requests: ConsultationRequestTable;
      consultation_images: ConsultationImageTable;
      treatment_plans: TreatmentPlanTable;
      bookings: BookingTable;
      reviews: ReviewTable;
      notifications: NotificationTable;
    };
  };
}

export type {
  ProfileTable,
  NotificationTable,
  ClinicTable,
  ReviewTable,
  ConsultationRequestTable,
  ConsultationImageTable,
  TreatmentPlanTable,
  BookingTable,
};
