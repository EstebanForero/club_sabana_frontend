import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added for better error display
import { AlertTriangle } from 'lucide-react'; // For error display

import { getTraining, updateTraining, TrainingUpdatePayload, Training } from '@/backend/training_backend'; // Import TrainingUpdatePayload
import TrainingForm, { TrainingFormData } from './TrainingForm'; // Assuming TrainingForm exists and is correct
import { Uuid } from '@/backend/common';

interface TrainingEditProps {
  trainingId: Uuid | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrainingEdit: React.FC<TrainingEditProps> = ({ trainingId, isOpen, onOpenChange }) => {
  const queryClient = useQueryClient();

  const { data: trainingData, isLoading: isLoadingTraining, isError, error: queryError } = useQuery({
    queryKey: ['training', trainingId],
    queryFn: () => getTraining(trainingId!),
    enabled: !!trainingId && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    // updateTraining expects (idTraining: Uuid, payload: TrainingUpdatePayload)
    mutationFn: (payload: TrainingUpdatePayload) => updateTraining(trainingId!, payload),
    onSuccess: (updatedTraining) => { // updateTraining now returns the updated Training object
      toast.success(`Training "${updatedTraining.name}" updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ['allTrainingsTrainer'] }); // Or 'allTrainings' if that's the main list key
      queryClient.invalidateQueries({ queryKey: ['trainings'] }); // General list if exists
      queryClient.invalidateQueries({ queryKey: ['training', trainingId] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update training: ${error.message || 'Unknown error'}`);
    },
  });

  function handleFormSubmit(values: TrainingFormData) {
    if (!trainingId) {
      toast.error("Cannot update training: Invalid ID.");
      return;
    }
    // Construct the TrainingUpdatePayload
    const payload: TrainingUpdatePayload = {
      name: values.name,
      id_category: values.id_category as Uuid,
      trainer_id: values.trainer_id as Uuid, // Assuming trainer_id is in TrainingFormData
      start_datetime: values.start_datetime, // Form provides local, backend service converts
      end_datetime: values.end_datetime,     // Form provides local, backend service converts
      minimum_payment: values.minimum_payment ?? 1,
      id_court: values.id_court || undefined, // Send undefined if null/empty
    };
    updateMutation.mutate(payload);
  }

  const handleCancel = () => onOpenChange(false);

  const renderContent = () => {
    if (!isOpen) return null;
    if (isLoadingTraining) {
      return (
        <div className="space-y-4 py-4">
          {[...Array(6)].map((_, i) => ( // Assuming ~6 fields in TrainingForm
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      );
    }
    if (isError || !trainingData) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Training Data</AlertTitle>
          <AlertDescription>
            Could not load training details. {queryError instanceof Error ? queryError.message : 'Please try again.'}
          </AlertDescription>
        </Alert>
      );
    }
    return (
      <TrainingForm
        mode="edit"
        initialData={trainingData} // TrainingForm expects initialData to have local datetime strings
        onSubmit={handleFormSubmit}
        isLoading={updateMutation.isLoading} // Use isPending
        onCancel={handleCancel}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Training</DialogTitle>
          <DialogDescription>Modify the details for this training session.</DialogDescription>
        </DialogHeader>
        {renderContent()}
        {!isLoadingTraining && !isError && trainingData && (
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleCancel} disabled={updateMutation.isLoading}>Cancel</Button>
            <Button type="submit" form="training-form-edit" disabled={updateMutation.isLoading}>
              {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        )}
        {(isError && !isLoadingTraining && !trainingData) && ( // Condition for showing close on error
          <DialogFooter><Button type="button" variant="ghost" onClick={handleCancel}>Close</Button></DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrainingEdit;
