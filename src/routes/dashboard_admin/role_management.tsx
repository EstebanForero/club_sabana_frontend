import { URol } from '@/backend/common'
import { getAllUsers, getUserById, updateUserRol, UserInfo } from '@/backend/user_backend'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard_admin/role_management')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: users } = useQuery({
    queryFn: getAllUsers,
    queryKey: ['user']
  })

  return <div className='p-8'>
    <h1 className='text-2xl m-3'>User roles</h1>
    <div className='flex flex-row flex-wrap gap-4'>
      {users?.map(user => <UserRoleManagement user={user} />)}
    </div>
  </div>
}

type Props = {
  user: UserInfo
}

const UserRoleManagement = ({ user }: Props) => {
  const queryClient = useQueryClient()

  const changeRoleMutation = useMutation({
    mutationFn: (rol: URol) => updateUserRol(user.id_user, rol),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', user.id_user])
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  return (
    <Card className='shadow-lg shadow-primary'>
      <CardHeader>
        <CardTitle>{user.first_name}</CardTitle>
        <CardDescription>{user.last_name}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
        <p>{user.phone_number}</p>
        <p>{user.id_user}</p>
        <p>{user.identification_type}</p>
        <p>{user.identification_number}</p>
      </CardContent>
      <CardFooter>
        <Select defaultValue={user.user_rol} onValueChange={(rol) => changeRoleMutation.mutate(rol as URol)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ADMIN'>Admin</SelectItem>
            <SelectItem value='USER'>User</SelectItem>
            <SelectItem value='TRAINER'>Trainer</SelectItem>
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  )
}

