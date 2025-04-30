import CategoryManagement from '@/components/CategoryManagement'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_admin/category_management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <CategoryManagement />
  </div>
}
