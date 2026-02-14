"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteConsultation } from "@/lib/actions/consultation-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ConsultationDeleteDialogProps {
    consultationId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ConsultationDeleteDialog({
    consultationId,
    open,
    onOpenChange,
    onSuccess,
}: ConsultationDeleteDialogProps) {
    const t = useTranslations("consultation");
    const tCommon = useTranslations("common");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteConsultation(consultationId);

            if (result.success) {
                toast.success(t("deleteSuccess"));
                onOpenChange(false);
                onSuccess();
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("deleteConfirm")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("deleteDescription")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        {tCommon("cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {t("deleteConsultation")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
