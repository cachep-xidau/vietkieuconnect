"use client";

import { useTranslations } from "next-intl";
import { ClinicTable } from "@/types/database-clinic-tables";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { Edit, Trash2, Star } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useState, useTransition } from "react";
import { deleteClinic, toggleVerified } from "@/lib/actions/admin-clinic-mutations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ClinicListProps {
  clinics: ClinicTable["Row"][];
  locale: string;
}

export function ClinicList({ clinics, locale }: ClinicListProps) {
  const t = useTranslations("admin.clinics");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleToggleVerified = async (id: string) => {
    startTransition(async () => {
      const result = await toggleVerified(id);
      if (result.success) {
        toast.success(t("verifiedToggled"));
        router.refresh();
      } else {
        toast.error(result.error || t("verifiedToggleFailed"));
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    startTransition(async () => {
      const result = await deleteClinic(deleteId);
      if (result.success) {
        toast.success(t("deleteSuccess"));
        setDeleteId(null);
        router.refresh();
      } else {
        toast.error(result.error || t("deleteFailed"));
      }
    });
  };

  if (clinics.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t("noClinics")}
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{t("logo")}</TableHead>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("city")}</TableHead>
              <TableHead className="text-center">{t("verified")}</TableHead>
              <TableHead className="text-center">{t("rating")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clinics.map((clinic) => (
              <TableRow key={clinic.id}>
                <TableCell>
                  {clinic.logo_url ? (
                    <Image
                      src={clinic.logo_url}
                      alt={clinic.name}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      {clinic.name.charAt(0)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{clinic.name}</TableCell>
                <TableCell>{clinic.city}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={clinic.verified}
                    onCheckedChange={() => handleToggleVerified(clinic.id)}
                    disabled={isPending}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{clinic.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">
                      ({clinic.review_count})
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/clinics/${clinic.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        {t("edit")}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(clinic.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t("delete")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {t("confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
