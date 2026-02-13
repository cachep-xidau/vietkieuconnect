"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, ImageIcon } from "lucide-react";
import { format } from "date-fns";

type Consultation = {
  id: string;
  user_id: string;
  clinic_id: string | null;
  treatment_description: string;
  status: "pending" | "quoted" | "accepted" | "declined" | "expired";
  created_at: string;
  user: { email: string; full_name: string | null } | null;
  clinic: { id: string; name: string; city: string } | null;
  image_count?: number;
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  quoted: "bg-blue-100 text-blue-800 border-blue-300",
  accepted: "bg-green-100 text-green-800 border-green-300",
  declined: "bg-red-100 text-red-800 border-red-300",
  expired: "bg-gray-100 text-gray-800 border-gray-300",
};

interface ConsultationListProps {
  consultations: Consultation[];
}

export function ConsultationList({ consultations }: ConsultationListProps) {
  if (consultations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No consultations found
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead>Clinic</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations.map((consultation) => (
            <TableRow key={consultation.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {consultation.user?.full_name || "Unknown"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {consultation.user?.email || "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <p className="max-w-xs truncate" title={consultation.treatment_description}>
                  {consultation.treatment_description}
                </p>
              </TableCell>
              <TableCell>
                {consultation.clinic ? (
                  <div className="flex flex-col">
                    <span className="font-medium">{consultation.clinic.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {consultation.clinic.city}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Any clinic</span>
                )}
              </TableCell>
              <TableCell>
                {consultation.image_count && consultation.image_count > 0 ? (
                  <Badge variant="outline" className="gap-1">
                    <ImageIcon className="h-3 w-3" />
                    {consultation.image_count}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">None</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusColors[consultation.status]}
                >
                  {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(consultation.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/consultations/${consultation.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
