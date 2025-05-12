import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_trainer/user_categories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard_trainer/user_categories"!</div>
}
