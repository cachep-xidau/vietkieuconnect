"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { clinicFormSchema, ClinicFormData } from "@/lib/validators/clinic";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ClinicTable } from "@/types/database-clinic-tables";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createClinic, updateClinic } from "@/lib/actions/admin-clinic-mutations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ClinicFormProps {
  mode: "create" | "edit";
  initialData?: ClinicTable["Row"];
  locale: string;
}

export function ClinicForm({ mode, initialData, locale }: ClinicFormProps) {
  const t = useTranslations("admin.clinics.form");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [services, setServices] = useState<string>(
    initialData?.services ? (initialData.services as string[]).join(", ") : ""
  );
  const [pricingInput, setPricingInput] = useState<string>(
    initialData?.pricing
      ? Object.entries(initialData.pricing as Record<string, number>)
          .map(([k, v]) => `${k}:${v}`)
          .join(", ")
      : ""
  );
  const [photosInput, setPhotosInput] = useState<string>(
    initialData?.photos?.join("\n") || ""
  );

  const form = useForm<ClinicFormData>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      city: initialData?.city || "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      website: initialData?.website || "",
      description_en: initialData?.description_en || "",
      description_vi: initialData?.description_vi || "",
      services: initialData?.services ? (initialData.services as string[]) : [],
      pricing: initialData?.pricing ? (initialData.pricing as Record<string, number>) : {},
      logo_url: initialData?.logo_url || "",
      photos: initialData?.photos || [],
      verified: initialData?.verified || false,
    },
  });

  const onSubmit = async (data: ClinicFormData) => {
    // Parse services from comma-separated string
    const servicesArray = services
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Parse pricing from "treatment:price" format
    const pricingObj: Record<string, number> = {};
    pricingInput.split(",").forEach((pair) => {
      const [key, value] = pair.split(":").map((s) => s.trim());
      if (key && value) {
        pricingObj[key] = parseFloat(value);
      }
    });

    // Parse photos from newline-separated URLs
    const photosArray = photosInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const formData = {
      ...data,
      services: servicesArray,
      pricing: pricingObj,
      photos: photosArray,
    };

    startTransition(async () => {
      if (mode === "create") {
        const result = await createClinic(formData);
        if (result.success) {
          toast.success(t("createSuccess"));
          router.push(`/${locale}/admin/clinics`);
        } else {
          toast.error(result.error || t("createFailed"));
        }
      } else {
        if (!initialData?.id) return;
        const result = await updateClinic(initialData.id, formData);
        if (result.success) {
          toast.success(t("updateSuccess"));
          router.push(`/${locale}/admin/clinics`);
        } else {
          toast.error(result.error || t("updateFailed"));
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("namePlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("slug")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("slugPlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("city")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("cityPlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("address")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("addressPlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phone")}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} placeholder="+84 123 456 789" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} type="email" placeholder="clinic@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("website")}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} placeholder="https://example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="description_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("descriptionEn")}</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ""} rows={4} placeholder={t("descriptionPlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description_vi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("descriptionVi")}</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ""} rows={4} placeholder={t("descriptionPlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Services & Pricing */}
        <div className="space-y-4">
          <div>
            <FormLabel>{t("services")}</FormLabel>
            <Input
              value={services}
              onChange={(e) => setServices(e.target.value)}
              placeholder={t("servicesPlaceholder")}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">{t("servicesHint")}</p>
          </div>

          <div>
            <FormLabel>{t("pricing")}</FormLabel>
            <Input
              value={pricingInput}
              onChange={(e) => setPricingInput(e.target.value)}
              placeholder={t("pricingPlaceholder")}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">{t("pricingHint")}</p>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="logo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("logoUrl")}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} placeholder="https://example.com/logo.png" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>{t("photos")}</FormLabel>
            <Textarea
              value={photosInput}
              onChange={(e) => setPhotosInput(e.target.value)}
              rows={3}
              placeholder={t("photosPlaceholder")}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">{t("photosHint")}</p>
          </div>
        </div>

        {/* Verified */}
        <FormField
          control={form.control}
          name="verified"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="!mt-0">{t("verified")}</FormLabel>
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {t(mode === "create" ? "create" : "update")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
