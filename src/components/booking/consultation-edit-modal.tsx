"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateConsultation } from "@/lib/actions/consultation-actions";
import { ConsultationRequestTable } from "@/types/database-booking-tables";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ConsultationEditModalProps {
    consultation: ConsultationRequestTable["Row"];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ConsultationEditModal({
    consultation,
    open,
    onOpenChange,
    onSuccess,
}: ConsultationEditModalProps) {
    const t = useTranslations("consultation");
    const tCommon = useTranslations("common");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [treatmentDescription, setTreatmentDescription] = useState(
        consultation.treatment_description
    );
    const [patientCount, setPatientCount] = useState(consultation.patient_count);

    const handleSave = async () => {
        if (!treatmentDescription || treatmentDescription.length < 10) {
            toast.error("Treatment description must be at least 10 characters");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateConsultation(consultation.id, {
                treatmentDescription,
                patientCount,
            });

            if (result.success) {
                toast.success(t("updateSuccess"));
                onOpenChange(false);
                onSuccess();
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>{t("editConsultation")}</SheetTitle>
                    <SheetDescription>
                        {t("myConsultationsDesc")}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    <div className="space-y-2">
                        <Label htmlFor="edit-treatment" className="text-sm font-medium">
                            {t("treatmentDescription")}
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <textarea
                            id="edit-treatment"
                            value={treatmentDescription}
                            onChange={(e) => setTreatmentDescription(e.target.value)}
                            placeholder={t("treatmentDescriptionPlaceholder")}
                            className="w-full min-h-[120px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                            maxLength={1000}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-patients" className="text-sm font-medium">
                            {t("patientCount")}
                        </Label>
                        <Input
                            id="edit-patients"
                            type="number"
                            min="1"
                            max="10"
                            value={patientCount}
                            onChange={(e) => setPatientCount(Number(e.target.value))}
                        />
                    </div>
                </div>

                <SheetFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        {tCommon("cancel")}
                    </Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {tCommon("save")}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
