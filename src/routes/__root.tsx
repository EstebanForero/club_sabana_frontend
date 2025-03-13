import * as React from 'react'
import { Link, Outlet, createRootRoute, useMatch, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/sonner'
import NavBarComponent from '@/components/NavBarComponent'
import { AuthManager } from '@/backend/auth'
import { navigateToRol } from '@/lib/utils'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const navigate = useNavigate({ from: '/' })

  const match_user_dashboard = useMatch({ from: '/dashboard_user/', shouldThrow: false })
  const match_admin_dashboard = useMatch({ from: '/dashboard_admin/', shouldThrow: false })
  const match_trainer_dashboard = useMatch({ from: '/dashboard_trainer/', shouldThrow: false })

  //if (AuthManager.isAuthenticated()) {
  //  const userRol = AuthManager.getUserRol()
  //
  //  if (userRol != null) {
  //    navigateToRol(userRol, navigate)
  //  }
  //}

  return (
    <>
      {match_user_dashboard || match_admin_dashboard || match_trainer_dashboard ? <div></div> : <NavBarComponent />}
      <hr />
      <Toaster position='top-right' richColors />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
