import { AppSidebar, SidebarLink } from '@/components/AppSideBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { CreditCard, UserPen } from 'lucide-react';

export const Route = createFileRoute('/dashboard_trainer')({
  component: RouteComponent,
})

const sidebarLinks: SidebarLink[] = [
  { icon: UserPen, text: "Profile", to: "/dashboard_user" },
  { icon: CreditCard, text: "Tuition", to: "/dashboard_user/tuition" },
];

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar links={sidebarLinks} />
      <Outlet />
    </SidebarProvider>
  )
}
