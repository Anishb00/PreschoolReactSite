import { authorizeUser, isAdmin } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import { AdminSidebar } from "@/app/admin/components/Sidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.VIEW_DASHBOARD);
  const isAdminUser = await isAdmin();

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isAdmin={isAdminUser} />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
