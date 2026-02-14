import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getBookingByIdAdmin } from "@/lib/actions/admin-booking-actions";
import { BookingStatusUpdater } from "@/components/admin/booking-status-updater";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, FileText, DollarSign, Building2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { format } from "date-fns";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-green-100 text-green-800 border-green-300",
  completed: "bg-gray-100 text-gray-800 border-gray-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export default async function BookingDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const t = await getTranslations("admin.bookings");

  const result = await getBookingByIdAdmin(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const booking = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/bookings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <p className="text-muted-foreground mt-1">ID: {booking.id}</p>
        </div>
        <Badge
          variant="outline"
          className={statusColors[booking.status as keyof typeof statusColors]}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{booking.user?.full_name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{booking.user?.email || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Clinic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Clinic Name</p>
              <p className="font-medium">{booking.clinic?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">City</p>
              <p className="font-medium">{booking.clinic?.city || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="font-medium">
              {format(new Date(booking.created_at), "PPP 'at' p")}
            </p>
          </div>
          {booking.confirmed_at && (
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="font-medium">
                {format(new Date(booking.confirmed_at), "PPP 'at' p")}
              </p>
            </div>
          )}
          {booking.completed_at && (
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="font-medium">
                {format(new Date(booking.completed_at), "PPP 'at' p")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {booking.treatment_plan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Treatment Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.treatment_plan.total_usd && (
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold">
                  ${booking.treatment_plan.total_usd.toFixed(2)} USD
                </p>
              </div>
            )}
            {(() => {
              const items = booking.treatment_plan.items;
              if (!items || !Array.isArray(items) || items.length === 0) return null;

              const typedItems = items as Array<{ treatment: string; price: number }>;
              return (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Treatments</p>
                  <div className="space-y-2">
                    {typedItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b pb-2">
                        <span>{item.treatment}</span>
                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {booking.treatment_plan.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm whitespace-pre-wrap">{booking.treatment_plan.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {booking.consultation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Related Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href={`/admin/consultations/${booking.consultation.id}`}>
                View Original Consultation
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Update Booking Status</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingStatusUpdater
            bookingId={booking.id}
            currentStatus={booking.status as any}
          />
        </CardContent>
      </Card>
    </div>
  );
}
