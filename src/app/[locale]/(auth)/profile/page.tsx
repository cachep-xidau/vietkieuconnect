import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Mail, User, Phone, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getInitials } from "@/lib/utils/user";

export default async function ProfilePage() {
  const t = await getTranslations();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let profile: { full_name: string | null; phone: string | null } | null = null;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .single();
    profile = data;
  } catch {
    // Profile may not exist, use auth metadata
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = getInitials(profile?.full_name || user.user_metadata?.full_name);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Avatar size="lg" className="mx-auto mb-4">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{displayName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          {profile?.full_name && (
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium">{profile.full_name}</p>
              </div>
            </div>
          )}

          {profile?.phone && (
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{profile.phone}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
