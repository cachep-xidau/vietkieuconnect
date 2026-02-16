"use client";

import { ShieldCheck, User } from "lucide-react";

interface LicenseBadgeProps {
    medicalDirector: string | null;
    medicalDirectorLicense: string | null;
    licenseAuthority?: string | null;
    compact?: boolean;
}

export function LicenseBadge({
    medicalDirector,
    medicalDirectorLicense,
    licenseAuthority,
    compact = false,
}: LicenseBadgeProps) {
    if (!medicalDirector) return null;

    if (compact) {
        return (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                    {medicalDirector}
                    {medicalDirectorLicense && ` · ${medicalDirectorLicense}`}
                </span>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-semibold text-sm">Professional Credentials</span>
            </div>
            <div className="space-y-1.5 pl-7">
                <div className="flex items-center gap-2 text-sm">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{medicalDirector}</span>
                </div>
                {medicalDirectorLicense && (
                    <p className="text-xs text-muted-foreground">
                        CCHN: {medicalDirectorLicense}
                    </p>
                )}
                {licenseAuthority && (
                    <p className="text-xs text-muted-foreground">
                        {licenseAuthority}
                    </p>
                )}
            </div>
        </div>
    );
}
