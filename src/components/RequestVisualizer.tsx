
import React from 'react'

import { completeRequest, Request } from "../backend/request_backend"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserById } from '@/backend/user_backend'
import { Badge } from './ui/badge'
import { AuthManager } from '@/backend/auth'
import { Button } from './ui/button'
import { toast } from 'sonner'

type Props = {
  request: Request,
  admin?: boolean
}

const RequestVisualizer = ({ request, admin }: Props) => {

  const { data: requesterInfo, isLoading } = useQuery({
    queryFn: () => getUserById(request.requester_id),
    queryKey: [request.requester_id]
  })

  if (isLoading || !requesterInfo) {
    return <h1>loading</h1>
  }

  return (
    <Card className='max-w-96'>
      <CardHeader>
        <CardTitle>{request.requested_command}</CardTitle>
        <CardDescription>Requested by: {requesterInfo.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='py-2'>
          {request.justification}
        </div>
        <div>
          <strong>
            Request id: {request.request_id}
          </strong>
        </div>
      </CardContent>
      <CardFooter>
        {request.approved !== null ? <ApprovedBadge approved={request.approved} approver_id={request.approver_id ?? ''} /> :
          <Badge variant={'secondary'} className='h-full'>In Wait</Badge>}
        {admin && <AdminFunctionality requestId={request.request_id} alreadyCompleted={request.approved !== null} />}
      </CardFooter>
    </Card>
  )
}

export default RequestVisualizer

type AdminFuncProps = {
  requestId: string,
  alreadyCompleted?: boolean
}

const AdminFunctionality = ({ requestId, alreadyCompleted }: AdminFuncProps) => {

  const queryClient = useQueryClient()

  const completeRequestMutation = useMutation({
    mutationFn: (approved: boolean) => completeRequest(requestId, approved, AuthManager.getToken() ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  return (
    <>
      {
        !alreadyCompleted &&
        <div className='flex flex-row gap-4 ml-4'>
          <Button onClick={() => completeRequestMutation.mutate(true)}>Approve</Button>
          <Button variant={'destructive'} onClick={() => completeRequestMutation.mutateAsync(false)}>Reject</Button>
        </div>
      }
    </>
  )
}

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
    <div className='flex flex-row gap-4 flex-wrap'>
      {approved ? <Badge>approved</Badge> : <Badge className='bg-red-700'>Rejected</Badge>}
      <p>{approverInfo.email}</p>
    </div>
  )
}
