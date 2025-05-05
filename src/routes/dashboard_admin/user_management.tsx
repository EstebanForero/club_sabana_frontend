import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAllUsers } from '@/backend/user_backend'; // Adjust path
import { Uuid } from '@/backend/common'; // Adjust path
import UsersTable from '@/components/UsersTable'; // Adjust path
import UserEditDialog from '@/components/UserEditDialog'; // Adjust path
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

export const Route = createFileRoute('/dashboard_admin/user_management')({
  component: AdminUserListPage,
})

function AdminUserListPage() {
  const [editingUserId, setEditingUserId] = useState<Uuid | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['allUsers'],
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000,
  });

  const handleEditUser = (userId: Uuid) => {
    setEditingUserId(userId);
    setIsEditDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setEditingUserId(null);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">User Management</h1>

      {isError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Users</AlertTitle>
          <AlertDescription>
            Could not fetch the user list. {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      )}

      <UsersTable
        users={users || []}
        isLoading={isLoading}
        onEditUser={handleEditUser}
      />

      <UserEditDialog
        userId={editingUserId}
        isOpen={isEditDialogOpen}
        onOpenChange={handleOpenChange}
      />
    </div>
  );
}
