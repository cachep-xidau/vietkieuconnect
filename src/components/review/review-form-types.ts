export interface ReviewFormTranslations {
  title: string;
  ratingLabel: string;
  titleLabel: string;
  titlePlaceholder: string;
  contentLabel: string;
  contentPlaceholder: string;
  treatmentTypeLabel: string;
  treatmentTypePlaceholder: string;
  photosLabel: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
}

export interface ReviewFormProps {
  bookingId: string;
  clinicName: string;
  translations: ReviewFormTranslations;
}
