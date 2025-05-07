import React, { useState } from 'react'; // Added React import
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';

import { URol, Uuid } from '@/backend/common';
import { getAllUsers, updateUserRol, UserInfo, UpdateUserRolePayload } from '@/backend/user_backend';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Users, ShieldCheck, Briefcase, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/dashboard_admin/role_management')({
  component: AdminRoleManagementPage,
});

function AdminRoleManagementPage() {
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['allUsersForRoleManagement'],
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className='container mx-auto p-4 md:p-8'>
        <h1 className='text-2xl md:text-3xl font-bold mb-6'>User Role Management</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="shadow-md">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='container mx-auto p-4 md:p-8'>
        <h1 className='text-2xl md:text-3xl font-bold mb-6'>User Role Management</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Users</AlertTitle>
          <AlertDescription>
            Could not fetch the user list. {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className='container mx-auto p-4 md:p-8'>
        <h1 className='text-2xl md:text-3xl font-bold mb-6'>User Role Management</h1>
        <p className="text-center text-muted-foreground py-8">No users found.</p>
      </div>
    );
  }

  const sortedUsers = [...users].sort((a, b) =>
    new Date(b.registration_date).getTime() - new Date(a.registration_date).getTime()
  );

  return (
    <div className='container mx-auto p-4 md:p-8'>
      <div className="flex items-center mb-6">
        <Users className="h-7 w-7 mr-3 text-primary" />
        <h1 className='text-2xl md:text-3xl font-bold'>User Role Management</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Assign and update roles for users in the system.
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {sortedUsers.map(user => <UserRoleCard key={user.id_user} user={user} />)}
      </div>
    </div>
  );
}


interface UserRoleCardProps {
  user: UserInfo;
}

const RoleIcon: React.FC<{ role: URol }> = ({ role }) => {
  switch (role) {
    case URol.ADMIN: return <ShieldCheck className="h-4 w-4 text-red-500" />;
    case URol.TRAINER: return <Briefcase className="h-4 w-4 text-blue-500" />;
    case URol.USER: return <UserCog className="h-4 w-4 text-green-500" />;
    default: return <UserCog className="h-4 w-4 text-gray-500" />;
  }
};

const UserRoleCard = ({ user }: UserRoleCardProps) => {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<URol>(user.user_rol);

  const changeRoleMutation = useMutation({
    mutationFn: (newRole: URol) => {
      const payload: UpdateUserRolePayload = { user_rol: newRole };
      return updateUserRol(user.id_user, payload);
    },
    onSuccess: (updatedUserInfo) => {
      toast.success(`Role for ${updatedUserInfo.first_name} updated to ${updatedUserInfo.user_rol}.`);
      queryClient.setQueryData<UserInfo[]>(['allUsersForRoleManagement'], (oldData) =>
        oldData?.map(u => u.id_user === updatedUserInfo.id_user ? updatedUserInfo : u) ?? []
      );
      queryClient.invalidateQueries({ queryKey: ['user', user.id_user] });
      setSelectedRole(updatedUserInfo.user_rol);
    },
    onError: (error: Error, newRoleAttempted) => {
      toast.error(`Failed to update role to ${newRoleAttempted}: ${error.message}`);
      setSelectedRole(user.user_rol);
    }
  });

  const handleRoleChange = (newRoleValue: string) => {
    const newRole = newRoleValue as URol;
    if (newRole !== selectedRole) {
      setSelectedRole(newRole);
      changeRoleMutation.mutate(newRole);
    }
  };

  return (
    <Card className='shadow-md hover:shadow-lg transition-shadow dark:border-gray-700 flex flex-col justify-between'>
      <div>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{user.first_name} {user.last_name}</span>
            <Badge variant={
              user.user_rol === URol.ADMIN ? "destructive" :
                user.user_rol === URol.TRAINER ? "outline" :
                  "secondary"
            } className="capitalize">
              <RoleIcon role={user.user_rol} />
              <span className="ml-1.5">{user.user_rol.toLowerCase()}</span>
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-1 pt-0 pb-2">
          <p className="text-xs text-muted-foreground">ID: <span className="font-mono">{user.id_user}</span></p>
          {/* <p>Phone: {user.phone_number}</p>
            <p>ID Type: {user.identification_type}</p>
            <p>ID Number: {user.identification_number}</p> */}
        </CardContent>
      </div>
      <CardFooter className="border-t dark:border-gray-700 pt-3">
        <Select
          value={selectedRole}
          onValueChange={handleRoleChange}
          disabled={changeRoleMutation.isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(URol).map(roleValue => (
              <SelectItem key={roleValue} value={roleValue} className="capitalize">
                {roleValue.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
}
