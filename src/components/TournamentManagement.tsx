
import React from 'react'
import TournamentComponent from './TournamentComponent'
import { useQuery } from '@tanstack/react-query'
import { listTournaments } from '@/backend/tournament_backend'

const TournamentManagement = () => {

  const { data } = useQuery({
    queryFn: listTournaments,
    queryKey: ['tournaments']
  })

  return (
    <div>
      {data?.map(tournament => <TournamentComponent tournament={tournament} />)}
    </div>
  )
}

export default TournamentManagement
