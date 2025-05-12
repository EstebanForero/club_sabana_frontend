import { AppSidebar, SidebarLink } from '@/components/AppSideBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ChartBarStacked, Dumbbell, Mail, NotepadText, Trophy, UserPen } from 'lucide-react';

export const Route = createFileRoute('/dashboard_trainer')({
  component: RouteComponent,
})

const sidebarLinks: SidebarLink[] = [
  { icon: UserPen, text: "Profile", to: "/dashboard_trainer" },
  { icon: Mail, text: "Requests", to: "/dashboard_user/requests" },
  { icon: Trophy, text: "Tournaments", to: "/dashboard_trainer/tournament" },
  { icon: Dumbbell, text: "Trainings", to: "/dashboard_trainer/trainings" },
  { icon: NotepadText, text: "User reports", to: "/dashboard_trainer/reports" },
  { icon: ChartBarStacked, text: "User categories", to: "/dashboard_trainer/user_categories" },
];

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar links={sidebarLinks} />
      <Outlet />
    </SidebarProvider>
  )
}
