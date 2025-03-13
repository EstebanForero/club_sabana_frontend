import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard_admin/"!</div>
}
