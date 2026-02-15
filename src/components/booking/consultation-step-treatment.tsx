"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { ConsultationRequestInput } from "@/lib/validators/consultation";
import { Star, CheckCircle2, MapPin } from "lucide-react";
import type { ClinicTable } from "@/types/database-clinic-tables";
import Image from "next/image";

interface ConsultationStepTreatmentProps {
  register: UseFormRegister<ConsultationRequestInput>;
  errors: FieldErrors<ConsultationRequestInput>;
  clinics: ClinicTable["Row"][];
  selectedClinicId?: string;
  onClinicSelect: (id: string | undefined) => void;
}

export function ConsultationStepTreatment({
  register,
  errors,
  clinics,
  selectedClinicId,
  onClinicSelect,
}: ConsultationStepTreatmentProps) {
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

      {/* Clinic Preference Section */}
      {clinics.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-medium">
            {t("consultation.clinicPreference")}
          </Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {clinics.slice(0, 6).map((clinic) => {
              const isSelected = selectedClinicId === clinic.id;
              return (
                <button
                  key={clinic.id}
                  type="button"
                  onClick={() => onClinicSelect(isSelected ? undefined : clinic.id)}
                  className={`
                    relative flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all duration-200
                    ${isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-primary/40 hover:bg-accent/50"
                    }
                  `}
                >
                  {/* Clinic logo/avatar */}
                  <div className="flex-shrink-0">
                    {clinic.logo_url ? (
                      <Image
                        src={clinic.logo_url}
                        alt={clinic.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <img
                        src={clinic.photos?.[0] || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=200&auto=format&fit=crop"}
                        alt={clinic.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                  </div>

                  {/* Clinic info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm truncate">{clinic.name}</span>
                      {clinic.verified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{clinic.rating.toFixed(1)}</span>
                      </div>
                      {clinic.city && (
                        <div className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{clinic.city}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
