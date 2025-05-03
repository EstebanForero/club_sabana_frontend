// src/components/trainings/TrainingEdit.tsx
import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from "@/components/ui/skeleton";
import { getTraining, updateTraining, Training } from '@/backend/training_backend'; // Adjust path
import TrainingForm, { TrainingFormData } from './TrainingForm';
import { Uuid } from '@/backend/common';

interface TrainingEditProps {
  trainingId: Uuid | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrainingEdit: React.FC<TrainingEditProps> = ({ trainingId, isOpen, onOpenChange }) => {
  const queryClient = useQueryClient();

  const { data: trainingData, isLoading: isLoadingTraining, isError, error } = useQuery({
    queryKey: ['training', trainingId], // Unique key per training
    queryFn: () => getTraining(trainingId!),
    enabled: !!trainingId && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: updateTraining,
    onSuccess: (_, updatedTrainingInput) => { // API returns void
      // We don't get the full updated object back, use input or fetched data
      const name = updatedTrainingInput.name || trainingData?.name || 'Training';
      toast.success(`Training "${name}" updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ['trainings'] }); // Invalidate list
      queryClient.invalidateQueries({ queryKey: ['training', trainingId] }); // Invalidate specific item
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
    const updatedTrainingData: Training = {
      id_training: trainingId, // Include the ID
      name: values.name,
      id_category: values.id_category as Uuid,
      start_datetime: values.start_datetime,
      end_datetime: values.end_datetime,
      minimum_payment: values.minimum_payment ?? 0,
    };
    updateMutation.mutate(updatedTrainingData);
  }

  const handleCancel = () => onOpenChange(false);

  const renderContent = () => {
    if (!isOpen) return null;
    if (isLoadingTraining) {
      return <div className="space-y-4 py-4"> {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-14 w-full" />)} </div>;
    }
    if (isError || !trainingData) {
      return <p className="text-destructive py-4">Error loading training data</p>;
    }
    return (
      <TrainingForm
        mode="edit"
        initialData={trainingData}
        onSubmit={handleFormSubmit}
        isLoading={updateMutation.isLoading}
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
        {(isError || (!trainingData && !isLoadingTraining)) && ( // Error state footer
          <DialogFooter><Button type="button" variant="ghost" onClick={handleCancel}>Close</Button></DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrainingEdit;
