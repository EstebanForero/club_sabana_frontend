import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

import { getUserById, updateUser, UserCreation } from '@/backend/user_backend';
import { Uuid } from '@/backend/common';
import UserEditForm, { UserEditFormData } from './UserEditForm';

interface UserEditDialogProps {
  userId: Uuid | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({
  userId,
  isOpen,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading: isLoadingUser,
    isError,
    error: queryError,
    isFetching,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId && isOpen,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: (formData: UserEditFormData) => {
      const userCreation: UserCreation = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        country_code: formData.country_code,
        identification_number: formData.identification_number,
        identification_type: formData.identification_type,
        birth_date: formData.birth_date,
        phone_number: formData.phone_number,
        password: formData.password ?? ''
      }

      return updateUser(
        userId ?? '',
        userCreation
      )
    }
    ,
    onSuccess: (_, variables) => {
      toast.success(`User ${variables.first_name} ${variables.last_name} updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      onOpenChange(false);
    },
    onError: (error: Error, variables) => {
      console.error("Error updating user:", error);
      toast.error(`Failed to update user ${variables.first_name}: ${error.message || 'Unknown error'}`);
    },
  });

  const handleFormSubmit = (data: UserEditFormData) => {
    if (!userId) {
      toast.error("Cannot update: User ID is missing.");
      return;
    }
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const renderDialogContent = () => {
    if (!isOpen) return null;

    if (isLoadingUser || (isFetching && !userData)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      );
    }

    if (isError || !userData) {
      return (
        <Alert variant="destructive" className='my-4'>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading User Data</AlertTitle>
          <AlertDescription>
            Could not load user details. {queryError instanceof Error ? queryError.message : ''}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <UserEditForm
        initialData={userData}
        onSubmit={handleFormSubmit}
        isLoading={updateMutation.isLoading}
        onCancel={handleCancel}
      />
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Modify the user's details below. Role and password changes are handled separately.
          </DialogDescription>
        </DialogHeader>

        {renderDialogContent()}

        {!isLoadingUser && !isError && userData && (
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={updateMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="user-edit-form"
              disabled={updateMutation.isLoading || isFetching}
            >
              {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        )}
        {(isError && !isLoadingUser) && (
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>Close</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
