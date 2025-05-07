import { AppSidebar, SidebarLink } from '@/components/AppSideBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ChartBarStacked, CreditCard, Dumbbell, LandPlot, Mail, ShieldUser, Trophy, UserPen, UsersRound } from 'lucide-react';

export const Route = createFileRoute('/dashboard_admin')({
  component: RouteComponent,
})

const sidebarLinks: SidebarLink[] = [
  { icon: UserPen, text: "Profile", to: "/dashboard_user" },
  { icon: Mail, text: "Requests", to: "/dashboard_admin/requests" },
  { icon: ShieldUser, text: "Role management", to: "/dashboard_admin/role_management" },
  { icon: ChartBarStacked, text: "Category Management", to: "/dashboard_admin/category_management" },
  { icon: Trophy, text: "Tournament management", to: "/dashboard_admin/tournament_management" },
  { icon: Dumbbell, text: "Training management", to: "/dashboard_admin/training_management" },
  { icon: UsersRound, text: "User management", to: "/dashboard_admin/user_management" },
  { icon: LandPlot, text: "Court management", to: "/dashboard_admin/courts_management" },
];

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar links={sidebarLinks} />
      <Outlet />
    </SidebarProvider>
  )
}
