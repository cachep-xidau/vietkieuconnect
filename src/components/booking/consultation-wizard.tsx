"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ConsultationStepTreatment } from "./consultation-step-treatment";
import { ConsultationStepReview } from "./consultation-step-review";
import { XrayUploader } from "./xray-uploader";
import { useImageUpload } from "@/hooks/use-image-upload";
import { submitConsultation, uploadConsultationImage } from "@/lib/actions/consultation-actions";
import { consultationRequestSchema, ConsultationRequestInput } from "@/lib/validators/consultation";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { ClinicTable } from "@/types/database-clinic-tables";

const STEPS = 3;

interface ConsultationWizardProps {
  clinics: ClinicTable["Row"][];
}

export function ConsultationWizard({ clinics }: ConsultationWizardProps) {
  const t = useTranslations();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ConsultationRequestInput>({
    resolver: zodResolver(consultationRequestSchema) as any,
    defaultValues: {
      patientCount: 1,
      treatmentDescription: "",
    },
  });

  const { images, previews, isUploading, error: uploadError, addImage, removeImage, uploadAll, reset } = useImageUpload();

  const formData = watch();

  // Load saved form data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("consultation-draft");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setValue("treatmentDescription", data.treatmentDescription || "");
        setValue("patientCount", data.patientCount || 1);
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, [setValue]);

  // Auto-save form data
  useEffect(() => {
    if (formData.treatmentDescription) {
      localStorage.setItem("consultation-draft", JSON.stringify(formData));
    }
  }, [formData]);

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await new Promise<boolean>((resolve) => {
        handleSubmit(
          () => resolve(true),
          () => resolve(false)
        )();
      });
      if (!isValid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Submit consultation
      const result = await submitConsultation(formData);

      if (!result.success) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      const newConsultationId = result.data.consultationId;
      setConsultationId(newConsultationId);

      // Upload images
      if (images.length > 0) {
        const uploadSuccess = await uploadAll(newConsultationId, uploadConsultationImage);
        if (!uploadSuccess) {
          toast.error("Failed to upload some images");
          setIsSubmitting(false);
          return;
        }
      }

      // Clear draft
      localStorage.removeItem("consultation-draft");
      reset();
      setSubmitted(true);
      toast.success(t("consultation.submitted"));
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted && consultationId) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t("consultation.submitted")}</h2>
          <p className="text-muted-foreground text-center mb-6">
            {t("consultation.responseTime")}
          </p>
          <Button onClick={() => router.push(`/consultation/${consultationId}`)}>
            View Consultation
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progressValue = (currentStep / STEPS) * 100;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>{t("consultation.title")}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {t("consultation.stepOf", { current: currentStep, total: STEPS })}
          </span>
        </div>
        <Progress value={progressValue} className="h-2" />
        <CardDescription className="pt-2">
          {currentStep === 1 && t("consultation.step1")}
          {currentStep === 2 && t("consultation.step2")}
          {currentStep === 3 && t("consultation.step3")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <ConsultationStepTreatment
            register={register}
            errors={errors}
            clinics={clinics}
            selectedClinicId={formData.clinicId}
            onClinicSelect={(id) => setValue("clinicId", id)}
          />
        )}

        {currentStep === 2 && (
          <XrayUploader
            images={images}
            previews={previews}
            onAddImage={addImage}
            onRemoveImage={removeImage}
            error={uploadError}
          />
        )}

        {currentStep === 3 && (
          <ConsultationStepReview
            formData={formData}
            images={images}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting || isUploading}
          />
        )}

        {currentStep < 3 && (
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
            <Button
              type="button"
              onClick={handleNext}
            >
              {t("common.next")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
