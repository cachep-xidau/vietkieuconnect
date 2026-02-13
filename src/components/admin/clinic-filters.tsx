"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useCallback } from "react";

interface ClinicFiltersProps {
  cities: string[];
}

export function ClinicFilters({ cities }: ClinicFiltersProps) {
  const t = useTranslations("admin.clinics");
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const verified = searchParams.get("verified") || "all";
  const city = searchParams.get("city") || "all";

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // Reset to page 1 on filter change
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const clearFilters = useCallback(() => {
    router.push(window.location.pathname);
  }, [router]);

  const hasFilters = search || verified !== "all" || city !== "all";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      {/* Search */}
      <div className="flex-1">
        <label htmlFor="search" className="text-sm font-medium mb-2 block">
          {t("search")}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => updateFilters("search", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Verified Filter */}
      <div className="w-full md:w-48">
        <label htmlFor="verified" className="text-sm font-medium mb-2 block">
          {t("filterVerified")}
        </label>
        <Select value={verified} onValueChange={(v) => updateFilters("verified", v)}>
          <SelectTrigger id="verified">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterVerifiedAll")}</SelectItem>
            <SelectItem value="verified">{t("filterVerifiedOnly")}</SelectItem>
            <SelectItem value="unverified">{t("filterUnverifiedOnly")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* City Filter */}
      <div className="w-full md:w-48">
        <label htmlFor="city" className="text-sm font-medium mb-2 block">
          {t("filterCity")}
        </label>
        <Select value={city} onValueChange={(v) => updateFilters("city", v)}>
          <SelectTrigger id="city">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterCityAll")}</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="md:w-auto">
          <X className="h-4 w-4 mr-2" />
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
