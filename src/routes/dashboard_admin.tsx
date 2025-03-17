import { AppSidebar, SidebarLink } from '@/components/AppSideBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { CreditCard, Mail, ShieldUser, UserPen } from 'lucide-react';

export const Route = createFileRoute('/dashboard_admin')({
  component: RouteComponent,
})

const sidebarLinks: SidebarLink[] = [
  { icon: UserPen, text: "Profile", to: "/dashboard_user" },
  { icon: Mail, text: "Requests", to: "/dashboard_admin/requests" },
  { icon: ShieldUser, text: "Role management", to: "/dashboard_admin/role_management" },
];

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar links={sidebarLinks} />
      <Outlet />
    </SidebarProvider>
  )
}
