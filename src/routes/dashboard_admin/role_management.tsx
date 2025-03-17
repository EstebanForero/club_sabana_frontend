import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_admin/role_management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard_admin/role_management"!</div>
}
