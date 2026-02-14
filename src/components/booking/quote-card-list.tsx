"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import type { TreatmentPlanWithClinic, TreatmentItem } from "@/types/database-booking-tables";
import {
    ChevronDown,
    ChevronUp,
    Star,
    BadgeCheck,
    MapPin,
    TrendingDown,
    DollarSign,
    Clock,
    Award,
    FileText,
    SortAsc,
} from "lucide-react";

interface QuoteCardListProps {
    treatmentPlans: TreatmentPlanWithClinic[];
    onAccept?: (planId: string) => void;
    onDecline?: (planId: string) => void;
}

type SortOption = "price" | "rating" | "newest";

const US_AVG_PRICES: Record<string, number> = {
    "Dental Implant": 3500,
    "Cấy ghép Implant": 3500,
    "Crown": 1200,
    "Răng sứ": 1200,
    "Root Canal": 1000,
    "Điều trị tủy": 1000,
    "Veneer": 1500,
    "Mặt dán sứ": 1500,
    "Teeth Whitening": 600,
    "Tẩy trắng răng": 600,
    "Bridge": 3000,
    "Cầu răng": 3000,
    "Filling": 200,
    "Trám răng": 200,
    "Extraction": 150,
    "Nhổ răng": 150,
};

function calculateSavings(items: TreatmentItem[]): number {
    let totalSavings = 0;
    items.forEach((item) => {
        const usPrice = US_AVG_PRICES[item.name] || US_AVG_PRICES[item.nameEn || ""] || item.priceUsd * 3;
        totalSavings += (usPrice - item.priceUsd) * item.quantity;
    });
    return Math.max(0, totalSavings);
}

function formatVnd(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(amount);
}

function formatUsd(amount: number): string {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
}

function QuoteCard({
    plan,
    isBestValue,
    onAccept,
    onDecline,
}: {
    plan: TreatmentPlanWithClinic;
    isBestValue: boolean;
    onAccept?: (planId: string) => void;
    onDecline?: (planId: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const t = useTranslations("booking");

    const items = (plan.items as TreatmentItem[]) || [];
    const totalVnd = plan.total_vnd || 0;
    const totalUsd = plan.total_usd || 0;
    const savings = calculateSavings(items);
    const clinic = plan.clinic;

    return (
        <Card className={`transition-all duration-200 ${isBestValue ? "ring-2 ring-emerald-500/50 shadow-emerald-100 dark:shadow-emerald-900/20" : "hover:shadow-md"}`}>
            <CardHeader className="pb-3">
                {/* Clinic Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Clinic Logo */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 flex items-center justify-center flex-shrink-0 border border-teal-200/50 dark:border-teal-700/50">
                            {clinic?.logo_url ? (
                                <img src={clinic.logo_url} alt={clinic.name} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                                <span className="text-teal-600 dark:text-teal-400 font-bold text-lg">
                                    {clinic?.name?.charAt(0) || "?"}
                                </span>
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-base truncate">
                                    {clinic?.name || "Unknown Clinic"}
                                </h3>
                                {clinic?.verified && (
                                    <BadgeCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                                {clinic?.city && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {clinic.city}
                                    </span>
                                )}
                                {clinic?.rating ? (
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        {clinic.rating}
                                        <span className="text-xs">({clinic.review_count})</span>
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        {isBestValue && (
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                {t("quotes.bestValue")}
                            </Badge>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(plan.created_at)}
                        </span>
                    </div>
                </div>

                {/* Summary Row */}
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold text-foreground">
                            {formatVnd(totalVnd)} <span className="text-sm font-normal text-muted-foreground">VNĐ</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            ~{formatUsd(totalUsd)}
                        </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            {t("quotes.services", { count: items.length })}
                        </span>
                    </div>
                </div>

                {/* Savings Banner */}
                {savings > 0 && (
                    <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-sm">
                        <TrendingDown className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">
                            {t("quotes.savingsVsUs", { amount: formatUsd(savings) })}
                        </span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="pt-0">
                {/* Expand/Collapse Button */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                >
                    {expanded ? (
                        <>
                            {t("quotes.hideDetails")}
                            <ChevronUp className="h-4 w-4" />
                        </>
                    ) : (
                        <>
                            {t("quotes.viewDetails")}
                            <ChevronDown className="h-4 w-4" />
                        </>
                    )}
                </button>

                {/* Expanded Detail */}
                {expanded && (
                    <div className="mt-3 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        {/* Line Items Table */}
                        <div className="rounded-lg border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="text-left p-3 font-medium">{t("quotes.service")}</th>
                                        <th className="text-center p-3 font-medium w-16">{t("quotes.qty")}</th>
                                        <th className="text-right p-3 font-medium">{t("quotes.unitPrice")}</th>
                                        <th className="text-right p-3 font-medium">{t("quotes.subtotal")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="p-3">
                                                <p className="font-medium">{item.name}</p>
                                                {item.warrantyYears && (
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {t("quotes.warranty")}: {item.warrantyYears} {item.warrantyYears > 1 ? "years" : "year"}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="p-3 text-center">{item.quantity}</td>
                                            <td className="p-3 text-right whitespace-nowrap">{formatVnd(item.priceVnd)}</td>
                                            <td className="p-3 text-right whitespace-nowrap font-medium">
                                                {formatVnd(item.priceVnd * item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t bg-muted/30">
                                        <td colSpan={3} className="p-3 font-bold text-right">
                                            {t("quotes.total")}
                                        </td>
                                        <td className="p-3 text-right font-bold whitespace-nowrap">
                                            {formatVnd(totalVnd)} VNĐ
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Clinic Notes */}
                        {plan.notes && (
                            <div className="p-4 rounded-lg bg-muted/50 border">
                                <p className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                                    <FileText className="h-3.5 w-3.5" />
                                    {t("quotes.clinicNotes")}
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{plan.notes}</p>
                            </div>
                        )}

                        <Separator />

                        {/* Accept/Decline */}
                        {plan.status === "sent" && onAccept && onDecline && (
                            <div className="flex gap-3">
                                <Button onClick={() => onAccept(plan.id)} className="flex-1">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    {t("acceptPlan")}
                                </Button>
                                <Button onClick={() => onDecline(plan.id)} variant="outline" className="flex-1">
                                    {t("decline")}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function QuoteCardList({ treatmentPlans, onAccept, onDecline }: QuoteCardListProps) {
    const [sortBy, setSortBy] = useState<SortOption>("price");
    const t = useTranslations("booking");

    const sortedPlans = useMemo(() => {
        const plans = [...treatmentPlans];
        switch (sortBy) {
            case "price":
                return plans.sort((a, b) => (a.total_vnd || 0) - (b.total_vnd || 0));
            case "rating":
                return plans.sort((a, b) => (b.clinic?.rating || 0) - (a.clinic?.rating || 0));
            case "newest":
                return plans.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            default:
                return plans;
        }
    }, [treatmentPlans, sortBy]);

    const bestValueId = useMemo(() => {
        if (treatmentPlans.length <= 1) return null;
        const cheapest = [...treatmentPlans].sort((a, b) => (a.total_vnd || 0) - (b.total_vnd || 0))[0];
        return cheapest?.id || null;
    }, [treatmentPlans]);

    if (treatmentPlans.length === 0) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium">{t("quotes.waitingForQuotes")}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            {t("quotes.quotesWillAppear")}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header + Sort */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    {t("quotes.quotesReceived", { count: treatmentPlans.length })}
                </h2>

                {treatmentPlans.length > 1 && (
                    <div className="flex items-center gap-2">
                        <SortAsc className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="text-sm border rounded-lg px-3 py-1.5 bg-background text-foreground"
                        >
                            <option value="price">{t("quotes.lowestPrice")}</option>
                            <option value="rating">{t("quotes.highestRating")}</option>
                            <option value="newest">{t("quotes.newest")}</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Quote Cards */}
            <div className="space-y-4">
                {sortedPlans.map((plan) => (
                    <QuoteCard
                        key={plan.id}
                        plan={plan}
                        isBestValue={plan.id === bestValueId}
                        onAccept={onAccept}
                        onDecline={onDecline}
                    />
                ))}
            </div>
        </div>
    );
}
