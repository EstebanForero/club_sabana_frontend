import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_user/requests')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard_user/requests"!</div>
}
