import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_trainer/trainings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard_trainer/trainings"!</div>
}
