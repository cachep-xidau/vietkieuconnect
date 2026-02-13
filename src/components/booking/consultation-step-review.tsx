"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { ConsultationRequestInput } from "@/lib/validators/consultation";
import { useState } from "react";

interface ConsultationStepReviewProps {
  formData: ConsultationRequestInput;
  images: File[];
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ConsultationStepReview({ formData, images, onSubmit, isSubmitting }: ConsultationStepReviewProps) {
  const t = useTranslations();
  const [consentChecked, setConsentChecked] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t("consultation.reviewAndSubmit")}</h3>

        <div className="space-y-4 rounded-lg border p-4">
          <div>
            <Label className="text-muted-foreground">{t("consultation.treatmentDescription")}</Label>
            <p className="mt-1">{formData.treatmentDescription}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">{t("consultation.patientCount")}</Label>
            <p className="mt-1">{formData.patientCount}</p>
          </div>

          {formData.travelDates && (formData.travelDates.start || formData.travelDates.end) && (
            <div>
              <Label className="text-muted-foreground">{t("consultation.travelDates")}</Label>
              <p className="mt-1">
                {formData.travelDates.start && `From: ${formData.travelDates.start}`}
                {formData.travelDates.start && formData.travelDates.end && " - "}
                {formData.travelDates.end && `To: ${formData.travelDates.end}`}
              </p>
            </div>
          )}

          <div>
            <Label className="text-muted-foreground">{t("consultation.uploadImages")}</Label>
            <p className="mt-1">{images.length} {images.length === 1 ? "image" : "images"} uploaded</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
        <input
          type="checkbox"
          id="consent"
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="consent" className="text-sm cursor-pointer leading-relaxed">
          {t("consultation.consent")}
        </Label>
      </div>

      <Button
        onClick={onSubmit}
        disabled={!consentChecked || isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? t("consultation.submitting") : t("common.submit")}
      </Button>
    </div>
  );
}
