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
import { Eye } from "lucide-react";
import { format } from "date-fns";

type Booking = {
  id: string;
  user_id: string;
  clinic_id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  user: { email: string; full_name: string | null } | null;
  clinic: { id: string; name: string; city: string } | null;
  treatment_plan: { total_usd: number | null } | null;
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-green-100 text-green-800 border-green-300",
  completed: "bg-gray-100 text-gray-800 border-gray-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

interface BookingListProps {
  bookings: Booking[];
}

export function BookingList({ bookings }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No bookings found
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Clinic</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {booking.user?.full_name || "Unknown"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {booking.user?.email || "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {booking.clinic ? (
                  <div className="flex flex-col">
                    <span className="font-medium">{booking.clinic.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {booking.clinic.city}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {booking.treatment_plan?.total_usd ? (
                  <span className="font-semibold">
                    ${booking.treatment_plan.total_usd.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusColors[booking.status]}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(booking.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/bookings/${booking.id}`}>
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
