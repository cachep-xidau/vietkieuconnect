"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  X,
  ArrowUpDown,
  Sparkles,
  CircleDot,
  Smile,
  Stethoscope,
} from "lucide-react";
import { useClinicFilter } from "@/hooks/use-clinic-filter";
import { cn } from "@/lib/utils";

const TREATMENT_TYPES = ["implant", "veneer", "braces", "general"] as const;
const SORT_OPTIONS = ["rating", "reviews", "newest"] as const;

const TREATMENT_ICONS: Record<string, React.ElementType> = {
  implant: CircleDot,
  veneer: Sparkles,
  braces: Smile,
  general: Stethoscope,
};

const CITY_CHIPS = [
  { value: "All Cities", labelKey: "allCitiesChip" },
  { value: "Hanoi", labelKey: "cityHanoi" },
  { value: "Ho Chi Minh City", labelKey: "cityHCM" },
  { value: "Da Nang", labelKey: "cityDaNang" },
] as const;

export function ClinicFilter() {
  const t = useTranslations("clinic");
  const tCommon = useTranslations("common");
  const {
    treatmentTypes,
    sortBy,
    city,
    isFiltered,
    setTreatmentTypes,
    setSortBy,
    setCity,
    clearFilters,
  } = useClinicFilter();

  const toggleTreatmentType = (type: string) => {
    if (treatmentTypes.includes(type)) {
      setTreatmentTypes(treatmentTypes.filter((t) => t !== type));
    } else {
      setTreatmentTypes([...treatmentTypes, type]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Location Chips — horizontal scroll on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
        {CITY_CHIPS.map((chip) => {
          const isActive =
            city === chip.value ||
            (chip.value === "All Cities" && city === "All Cities");
          return (
            <button
              key={chip.value}
              onClick={() => setCity(chip.value)}
              className={cn(
                "group relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium snap-center",
                "transition-all duration-200 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-bg-card text-text-secondary border border-border hover:border-primary/40 hover:text-primary hover:bg-primary/5"
              )}
            >
              <MapPin
                className={cn(
                  "h-3.5 w-3.5 transition-colors duration-200",
                  isActive
                    ? "text-white/80"
                    : "text-text-tertiary group-hover:text-primary/60"
                )}
              />
              {t(chip.labelKey)}
              {isActive && chip.value !== "All Cities" && (
                <span className="ml-0.5 flex h-1.5 w-1.5 rounded-full bg-white/60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Treatment Filters + Sort — responsive layout */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Treatment Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory w-full sm:w-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary self-center flex-shrink-0">
            {tCommon("filter")}
          </span>
          <div className="h-4 w-px bg-border flex-shrink-0" />
          {TREATMENT_TYPES.map((type) => {
            const isActive = treatmentTypes.includes(type);
            const Icon = TREATMENT_ICONS[type];
            return (
              <button
                key={type}
                onClick={() => toggleTreatmentType(type)}
                className={cn(
                  "group relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium snap-center",
                  "transition-all duration-200 ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30 shadow-sm"
                    : "bg-transparent text-text-secondary border border-border hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-text-tertiary group-hover:text-primary/60"
                  )}
                />
                {t(`filter.${type}`)}
                {isActive && (
                  <X
                    className="h-3 w-3 ml-0.5 text-primary/60 hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTreatmentType(type);
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px] rounded-full border-border bg-bg-card h-9 text-sm pl-3 pr-2 gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-text-tertiary flex-shrink-0" />
              <SelectValue placeholder={t("sortByRating")} />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(
                    `sortBy${option.charAt(0).toUpperCase() + option.slice(1)}`
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters — animated entry */}
      {isFiltered && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 text-xs text-text-secondary hover:text-destructive rounded-full px-3 h-7"
          >
            <X className="w-3 h-3" />
            {t("clearFilters")}
          </Button>
        </div>
      )}
    </div>
  );
}
