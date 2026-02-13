import { getBookings } from "@/lib/actions/booking-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Calendar, MapPin, Plus } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function BookingsPage() {
  const t = await getTranslations();
  const result = await getBookings();

  if (!result.success) {
    if (result.code === "UNAUTHENTICATED") {
      redirect("/login");
    }
    return <div>Error loading bookings</div>;
  }

  const bookings = result.data;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("booking.myBookings")}</h1>
          <p className="text-muted-foreground mt-2">Manage your dental treatment bookings</p>
        </div>
        <Link href="/consultation/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("consultation.newConsultation")}
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">{t("booking.all")} ({bookings.length})</TabsTrigger>
          <TabsTrigger value="confirmed">{t("booking.confirmed")} ({confirmedBookings.length})</TabsTrigger>
          <TabsTrigger value="completed">{t("booking.completed")} ({completedBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">{t("booking.cancelled")} ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">{t("booking.noBookings")}</p>
                <p className="text-sm text-muted-foreground mt-2">Start by requesting a consultation</p>
                <Link href="/consultation/new">
                  <Button className="mt-4">{t("consultation.newConsultation")}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} t={t} />
            ))
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {confirmedBookings.length === 0 ? (
            <EmptyState message="No confirmed bookings" />
          ) : (
            confirmedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} t={t} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedBookings.length === 0 ? (
            <EmptyState message="No completed bookings" />
          ) : (
            completedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} t={t} />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledBookings.length === 0 ? (
            <EmptyState message="No cancelled bookings" />
          ) : (
            cancelledBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} t={t} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingCard({ booking, t }: { booking: any; t: any }) {
  return (
    <Link href={`/bookings/${booking.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{booking.clinic.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{booking.clinic.city}</span>
              </div>
            </div>
            <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
              {t(`booking.status.${booking.status}`)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Cost</span>
            <span className="font-semibold">
              ${booking.treatment_plan.total_usd?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Booking Date</span>
            <span>{new Date(booking.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
