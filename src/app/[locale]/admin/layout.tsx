import { redirect } from "next/navigation";
import { checkAdminRole } from "@/lib/auth/admin-auth-helper";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { createClient } from "@/lib/supabase/server";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Admin layout with sidebar navigation
 * Protects all admin routes with role check
 */
export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;

  // Check admin role (redirects if not admin)
  await checkAdminRole();

  // Get user email for header
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r bg-background">
        <AdminSidebar locale={locale} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader locale={locale} userEmail={user?.email} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
