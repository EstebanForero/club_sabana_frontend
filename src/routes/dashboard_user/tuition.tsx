import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_user/tuition')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard_user/tuition"!</div>
}

