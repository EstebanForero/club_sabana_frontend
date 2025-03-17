
import React from 'react'

import { Request } from "../backend/request_backend"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/backend/user_backend'
import { Badge } from './ui/badge'

type Props = {
  request: Request
}

const RequestVisualizer = ({ request }: Props) => {

  const { data: requesterInfo, isLoading } = useQuery({
    queryFn: () => getUserById(request.requester_id),
    queryKey: [request.requester_id]
  })

  if (isLoading || !requesterInfo) {
    return <h1>loading</h1>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{request.requested_command}</CardTitle>
        <CardDescription>Requested by: {requesterInfo.email}</CardDescription>
      </CardHeader>
      <CardContent>
        {request.justification}
      </CardContent>
      <CardFooter>
        {request.approved !== null ? <ApprovedBadge approved={request.approved} approver_id={request.approver_id ?? ''} /> :
          <Badge variant={'secondary'}>In Wait</Badge>}
      </CardFooter>
    </Card>
  )
}

export default RequestVisualizer


type ApprovedBageProps = {
  approved: boolean,
  approver_id: string
}

const ApprovedBadge = ({ approved, approver_id }: ApprovedBageProps) => {

  const { data: approverInfo, isLoading } = useQuery({
    queryFn: () => getUserById(approver_id),
    queryKey: [approver_id]
  })

  if (isLoading || !approverInfo) {
    return <h1>Loading</h1>
  }

  return (
    <div className='flex flex-row'>
      {approved ? <Badge>approved</Badge> : <Badge>Rejected</Badge>}
      <p>{approverInfo.email}</p>
    </div>
  )
}
