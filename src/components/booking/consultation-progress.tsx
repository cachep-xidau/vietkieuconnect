"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Clock, FileText, CalendarCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsultationProgressProps {
    status: string;
}

const STEPS = [
    { key: "progressSubmitted", icon: CheckCircle2 },
    { key: "progressReviewing", icon: Clock },
    { key: "progressQuoted", icon: FileText },
    { key: "progressBooked", icon: CalendarCheck },
];

function getActiveStep(status: string): number {
    switch (status) {
        case "pending":
            return 1;
        case "quoted":
            return 3;
        case "accepted":
            return 4;
        case "declined":
        case "cancelled":
            return -1; // Special: cancelled
        default:
            return 1;
    }
}

export function ConsultationProgress({ status }: ConsultationProgressProps) {
    const t = useTranslations("consultation");
    const activeStep = getActiveStep(status);
    const isCancelled = activeStep === -1;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between relative">
                {STEPS.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = !isCancelled && stepNumber < activeStep;
                    const isActive = !isCancelled && stepNumber === activeStep;
                    const isPending = !isCancelled && stepNumber > activeStep;
                    const Icon = step.icon;

                    return (
                        <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
                            {/* Connector line (before this step) */}
                            {index > 0 && (
                                <div
                                    className={cn(
                                        "absolute top-4 right-1/2 w-full h-0.5 -z-10",
                                        isCompleted || isActive
                                            ? "bg-primary"
                                            : isCancelled
                                                ? "bg-destructive/30"
                                                : "bg-border"
                                    )}
                                />
                            )}

                            {/* Step circle */}
                            <div
                                className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                                    isCompleted && "bg-primary border-primary text-primary-foreground",
                                    isActive && "bg-primary/10 border-primary text-primary ring-4 ring-primary/20",
                                    isPending && "bg-background border-border text-muted-foreground",
                                    isCancelled && "bg-destructive/10 border-destructive/30 text-destructive"
                                )}
                            >
                                {isCancelled ? (
                                    <XCircle className="h-4 w-4" />
                                ) : isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    <Icon className="h-4 w-4" />
                                )}
                            </div>

                            {/* Step label */}
                            <span
                                className={cn(
                                    "text-xs mt-1.5 text-center leading-tight font-medium",
                                    isCompleted && "text-primary",
                                    isActive && "text-primary",
                                    isPending && "text-muted-foreground",
                                    isCancelled && "text-destructive/60"
                                )}
                            >
                                {t(step.key)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
