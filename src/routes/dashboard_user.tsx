import { AppSidebar, SidebarLink } from '@/components/AppSideBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ChartBarStacked, CreditCard, Home, Mail, Trophy, UserPen } from 'lucide-react';

export const Route = createFileRoute('/dashboard_user')({
  component: RouteComponent,
})

const sidebarLinks: SidebarLink[] = [
  { icon: UserPen, text: "Profile", to: "/dashboard_user" },
  { icon: CreditCard, text: "Tuition", to: "/dashboard_user/tuition" },
  { icon: Mail, text: "Requests", to: "/dashboard_user/requests" },
  { icon: Trophy, text: "Tournaments", to: "/dashboard_user/tournament" },
  { icon: ChartBarStacked, text: "Categories", to: "/dashboard_user/categories" },
];

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar links={sidebarLinks} />
      <Outlet />
    </SidebarProvider>
  )
}
