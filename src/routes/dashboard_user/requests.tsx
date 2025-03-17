import { AuthManager } from '@/backend/auth'
import { listUserRequests } from '@/backend/request_backend'
import RequestCreator from '@/components/RequestCreator'
import RequestVisualizer from '@/components/RequestVisualizer'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_user/requests')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = AuthManager.getUserId() ?? ''

  const { data: userRequests, isLoading } = useQuery({
    queryFn: () => listUserRequests(userId),
    queryKey: ['requests', userId]
  })

  if (isLoading || !userRequests) {
    return <h1>Loading</h1>
  }

  return <div className='flex flex-col w-full p-8'>
    <RequestCreator />
    <h1 className='text-xl font-bold mb-2 mt-4'>Your requests</h1>
    <div className='flex flex-row'>
      {userRequests.map((request, index) => <RequestVisualizer key={index} request={request} />)}
    </div>
  </div>
}
