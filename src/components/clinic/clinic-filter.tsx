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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useClinicFilter } from "@/hooks/use-clinic-filter";

const TREATMENT_TYPES = ["implant", "veneer", "braces", "general"] as const;
const SORT_OPTIONS = ["rating", "reviews", "newest"] as const;
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
    <div className="space-y-4">
      {/* Quick City Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CITY_CHIPS.map((chip) => (
          <Badge
            key={chip.value}
            variant={city === chip.value || (chip.value === "All Cities" && city === "All Cities") ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap px-3 py-1.5 text-sm"
            onClick={() => setCity(chip.value)}
          >
            {t(chip.labelKey)}
          </Badge>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-text-secondary self-center">
            {tCommon("filter")}:
          </span>
          {TREATMENT_TYPES.map((type) => (
            <Badge
              key={type}
              variant={
                treatmentTypes.includes(type) ? "default" : "outline"
              }
              className="cursor-pointer"
              onClick={() => toggleTreatmentType(type)}
            >
              {t(`filter.${type}`)}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap md:flex-nowrap w-full md:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t("sortByRating")} />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(`sortBy${option.charAt(0).toUpperCase() + option.slice(1)}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-1"
        >
          <X className="w-4 h-4" />
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
