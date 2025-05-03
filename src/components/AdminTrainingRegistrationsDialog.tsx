// src/components/trainings/admin/AdminTrainingRegistrationsDialog.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTraining, getTrainingRegistrations, deleteTrainingRegistration, Training, TrainingRegistration } from '@/backend/training_backend'; // Adjust paths
import { Uuid } from '@/backend/common';
import AdminTrainingRegistrationRow from './AdminTrainingRegistrationRow'; // Import admin row
import { AlertTriangle } from 'lucide-react';

interface AdminTrainingRegistrationsDialogProps {
  trainingId: Uuid | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminTrainingRegistrationsDialog: React.FC<AdminTrainingRegistrationsDialogProps> = ({ trainingId, isOpen, onOpenChange }) => {
  const queryClient = useQueryClient();
  const [deletingUserId, setDeletingUserId] = useState<Uuid | null>(null);
  const [rowError, setRowError] = useState<{ userId: Uuid, error: Error } | null>(null);

  // Fetch Training Details (Optional, for context)
  const { data: training, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['adminTrainingDetails', trainingId], // Distinct key
    queryFn: () => getTraining(trainingId!),
    enabled: !!trainingId && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch Registrations
  const { data: registrations, isLoading: isLoadingRegs, refetch } = useQuery({
    queryKey: ['adminTrainingRegistrations', trainingId], // Distinct key
    queryFn: () => getTrainingRegistrations(trainingId!),
    enabled: !!trainingId && isOpen,
    staleTime: 30 * 1000,
  });

  const isLoading = isLoadingDetails || isLoadingRegs;

  // Delete Mutation
  const deleteRegMutation = useMutation({
    mutationFn: ({ trainingId, userId }: { trainingId: Uuid, userId: Uuid }) =>
      deleteTrainingRegistration(trainingId, userId),
    onSuccess: (message, variables) => {
      toast.success(message || `Registration deleted for ${variables.userId}`);
      setRowError(null);
      queryClient.invalidateQueries({ queryKey: ['adminTrainingRegistrations', trainingId] });
      // Refetch might be slightly faster UI update than invalidation alone
      // refetch();
    },
    onError: (error: Error, variables) => {
      setRowError({ userId: variables.userId, error });
      toast.error(`Failed to delete registration: ${error.message || 'Unknown error'}`);
    },
    onSettled: () => {
      setDeletingUserId(null);
    }
  });

  const handleDeleteRegistration = (userId: Uuid) => {
    if (!trainingId) return;
    setRowError(null);
    setDeletingUserId(userId);
    deleteRegMutation.mutate({ trainingId, userId });
  };

  // Render Helper
  const formatDate = (dateString: string | null | undefined, formatString = 'PPp'): string => {
    if (!dateString) return 'N/A'; try { const date = new Date(dateString.replace(' ', 'T')); if (isNaN(date.getTime())) return dateString; return format(date, formatString); } catch (error) { return dateString; }
  };


  const renderContent = () => {
    if (isLoadingRegs) {
      return <div className="space-y-2 py-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>;
    }
    if (!registrations || registrations.length === 0) {
      return <p className="text-center text-muted-foreground py-6">No registrations found for this training.</p>;
    }
    // Optional: Sort registrations, e.g., by registration date
    const sortedRegistrations = [...registrations].sort((a, b) =>
      new Date(b.registration_datetime).getTime() - new Date(a.registration_datetime).getTime()
    );

    return (
      <ScrollArea className="max-h-[60vh] border rounded-md mt-4">
        <div className="divide-y dark:divide-gray-700">
          {sortedRegistrations.map((reg) => (
            <AdminTrainingRegistrationRow
              key={reg.id_user} // Assuming user can only register once per training
              registration={reg}
              onDelete={handleDeleteRegistration}
              isDeleting={deletingUserId === reg.id_user}
              deleteError={rowError?.userId === reg.id_user ? rowError.error : null}
            />
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          {isLoadingDetails || !training ? <Skeleton className="h-6 w-3/4" /> : <DialogTitle>Registrations: {training.name}</DialogTitle>}
          <DialogDescription>
            View and manage user registrations for this training session.
            {training && (
              <span className="block text-xs mt-1 text-muted-foreground">
                Runs: {formatDate(training.start_datetime)} - {formatDate(training.end_datetime)} | Min Payment: ${training.minimum_payment.toFixed(2)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading && !training ? ( // Main skeleton if core details loading
          <div className="space-y-4 py-6"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : (
          renderContent() // Render registration list or empty state
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTrainingRegistrationsDialog;
