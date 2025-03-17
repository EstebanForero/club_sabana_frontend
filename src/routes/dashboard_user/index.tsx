import { AuthManager } from '@/backend/auth'
import ProfileComponent from '@/components/ProfileComponent'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_user/')({
  component: RouteComponent,
  loader: () => {
    const logInInfo = AuthManager.getLogInInfo()

    if (!logInInfo) {
      throw redirect({
        to: '/auth/login'
      })
    }

    return logInInfo
  }
})

function RouteComponent() {
  const { user_id: userId, user_rol } = Route.useLoaderData()

  return <div className='m-4 w-full'>
    <ProfileComponent userId={userId} userRol={user_rol} />
  </div>
}
