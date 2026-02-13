"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { ConsultationRequestInput } from "@/lib/validators/consultation";

interface ConsultationStepTreatmentProps {
  register: UseFormRegister<ConsultationRequestInput>;
  errors: FieldErrors<ConsultationRequestInput>;
}

export function ConsultationStepTreatment({ register, errors }: ConsultationStepTreatmentProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="treatmentDescription" className="text-base font-medium">
          {t("consultation.treatmentDescription")}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <textarea
          id="treatmentDescription"
          {...register("treatmentDescription")}
          placeholder={t("consultation.treatmentDescriptionPlaceholder")}
          className="w-full min-h-[120px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          maxLength={1000}
        />
        {errors.treatmentDescription && (
          <p className="text-sm text-destructive">{errors.treatmentDescription.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="patientCount" className="text-base font-medium">
          {t("consultation.patientCount")}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="patientCount"
          type="number"
          min="1"
          max="10"
          defaultValue="1"
          {...register("patientCount", { valueAsNumber: true })}
        />
        {errors.patientCount && (
          <p className="text-sm text-destructive">{errors.patientCount.message}</p>
        )}
      </div>
    </div>
  );
}
