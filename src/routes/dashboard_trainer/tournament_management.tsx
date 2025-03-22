import TournamentManagement from '@/components/TournamentManagement'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard_trainer/tournament_management',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <TournamentManagement />
}
