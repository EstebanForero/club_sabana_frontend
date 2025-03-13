import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_user')({
  component: RouteComponent,
})

const sidebarLinks: SidebarLink[] = [
  { icon: Home, text: "Home", to: "/" },
  { icon: Mail, text: "Inbox", to: "/inbox" },
  { icon: Calendar, text: "Calendar", to: "/calendar" },
];

function RouteComponent() {
  return <div>Hello "/dashboard_user"!</div>
}
