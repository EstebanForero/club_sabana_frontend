import { AppSidebar, SidebarLink } from '@/components/AppSideBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Mail, Trophy, UserPen } from 'lucide-react';

export const Route = createFileRoute('/dashboard_trainer')({
  component: RouteComponent,
})

const sidebarLinks: SidebarLink[] = [
  { icon: UserPen, text: "Profile", to: "/dashboard_trainer" },
  { icon: Mail, text: "Requests", to: "/dashboard_user/requests" },
  { icon: Trophy, text: "Tournaments", to: "/dashboard_trainer/tournament" },
];

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar links={sidebarLinks} />
      <Outlet />
    </SidebarProvider>
  )
}
