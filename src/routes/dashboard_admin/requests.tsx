import { listRequests } from '@/backend/request_backend'
import RequestVisualizer from '@/components/RequestVisualizer'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard_admin/requests')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: requests, isLoading } = useQuery({
    queryFn: listRequests,
    queryKey: ['requests']
  })

  if (isLoading || !requests) {
    return <h1>Loading</h1>
  }

  return <div className='w-full md:p-8'>
    <h1 className='text-2xl font-bold'>All requests</h1>
    <div className='flex flex-row gap-4 flex-wrap'>
      {requests.map((request, index) => <RequestVisualizer key={index} request={request} admin />)}
    </div>

  </div>
}
