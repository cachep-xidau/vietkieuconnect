"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import { updateBookingStatus } from "@/lib/actions/admin-booking-actions";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-green-100 text-green-800 border-green-300",
  completed: "bg-gray-100 text-gray-800 border-gray-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface BookingStatusUpdaterProps {
  bookingId: string;
  currentStatus: BookingStatus;
}

export function BookingStatusUpdater({
  bookingId,
  currentStatus,
}: BookingStatusUpdaterProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(currentStatus);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getAvailableStatuses = (status: BookingStatus): BookingStatus[] => {
    const transitions: Record<BookingStatus, BookingStatus[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };
    return transitions[status] || [];
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  const handleStatusChange = (newStatus: BookingStatus) => {
    setSelectedStatus(newStatus);
    setShowConfirm(true);
  };

  const handleConfirmUpdate = async () => {
    setIsUpdating(true);
    setShowConfirm(false);

    const result = await updateBookingStatus(bookingId, selectedStatus);

    setIsUpdating(false);

    if (result.success) {
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update booking status",
        variant: "destructive",
      });
      setSelectedStatus(currentStatus);
    }
  };

  if (availableStatuses.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">Status</p>
        <Badge variant="outline" className={statusColors[currentStatus]}>
          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} (Final)
        </Badge>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm font-medium">Current Status</p>
          <Badge variant="outline" className={statusColors[currentStatus]}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Update Status</p>
          <div className="flex gap-2">
            <Select
              value={selectedStatus}
              onValueChange={(value) => handleStatusChange(value as BookingStatus)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={currentStatus} disabled>
                  {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} (Current)
                </SelectItem>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the booking status from{" "}
              <strong>{currentStatus}</strong> to <strong>{selectedStatus}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedStatus(currentStatus)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdate}>
              Confirm Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
