import { getAllUsers } from '@/backend/user_backend'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_admin/role_management')({
  component: RouteComponent,
})

function RouteComponent() {
  const { } = useQuery({
    queryFn: getAllUsers,
    queryKey: ['user']
  })

  return <div>

  </div>
}
