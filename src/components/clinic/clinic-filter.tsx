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
const CITIES = [
  "All Cities",
  "Hanoi",
  "Ho Chi Minh City",
  "Da Nang",
  "Nha Trang",
  "Can Tho",
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
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t("allCities")} />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
