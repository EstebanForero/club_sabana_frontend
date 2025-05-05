import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserInfo } from '@/backend/user_backend';
import { Uuid, URol } from '@/backend/common';
import { formatDate } from '@/lib/utils';
import { Pencil, ShieldCheck, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UsersTableProps {
  users: UserInfo[];
  isLoading: boolean;
  onEditUser: (userId: Uuid) => void;
}

const RoleBadge: React.FC<{ role: URol }> = ({ role }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  let Icon = UserCog;
  if (role === URol.ADMIN) {
    variant = "destructive";
    Icon = ShieldCheck;
  } else if (role === URol.TRAINER) {
    variant = "outline";
  }

  return (
    <Badge variant={variant} className="flex items-center w-fit">
      <Icon className="mr-1 h-3 w-3" />
      {role}
    </Badge>
  );
};


const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  onEditUser,
}) => {

  if (isLoading) {
    return (
      <div className="border rounded-md p-4">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(5)].map((_, i) => <TableHead key={i}><Skeleton className='h-5 w-full' /></TableHead>)}
              <TableHead className='w-[100px]'><Skeleton className='h-5 w-full' /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={`skel-${i}`}>
                {[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton className='h-5 w-full' /></TableCell>)}
                <TableCell><Skeleton className='h-8 w-full' /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No users found.</p>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableCaption>A list of registered users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>ID Type</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id_user}>
              <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell><RoleBadge role={user.user_rol} /></TableCell>
              <TableCell>{user.identification_type}</TableCell>
              <TableCell>{formatDate(user.registration_date, 'PP')}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => onEditUser(user.id_user)}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit User</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
