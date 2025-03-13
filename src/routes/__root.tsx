import * as React from 'react'
import { Outlet, createRootRoute, useMatch, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/sonner'
import NavBarComponent from '@/components/NavBarComponent'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

const queryClient = new QueryClient()

function RootComponent() {
  const match_user_dashboard = useMatch({ from: '/dashboard_user/', shouldThrow: false })
  const match_admin_dashboard = useMatch({ from: '/dashboard_admin/', shouldThrow: false })
  const match_trainer_dashboard = useMatch({ from: '/dashboard_trainer/', shouldThrow: false })

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {match_user_dashboard || match_admin_dashboard || match_trainer_dashboard ? <div></div> : <NavBarComponent />}
        <hr />
        <Toaster position='top-right' richColors />
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}
