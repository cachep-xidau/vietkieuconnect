export const LOCALES = ["en", "vi"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const MAX_UPLOAD_SIZE = 20 * 1024 * 1024; // 20MB
export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const BOOKING_STATUSES = [
  "inquiry",
  "consultation",
  "plan_sent",
  "booked",
  "completed",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];
