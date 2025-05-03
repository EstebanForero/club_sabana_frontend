// src/components/trainings/TrainingCreation.tsx
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createTraining, TrainingCreation as TrainingCreationData } from '@/backend/training_backend'; // Adjust path
import TrainingForm, { TrainingFormData } from './TrainingForm';
import { Uuid } from '@/backend/common';

const TrainingCreation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTraining,
    onSuccess: () => {
      toast.success('Training created successfully!');
      queryClient.invalidateQueries({ queryKey: ['trainings'] }); // Key for the list
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create training: ${error.message || 'Unknown error'}`);
    },
  });

  function handleFormSubmit(values: TrainingFormData) {
    const trainingData: TrainingCreationData = {
      ...values,
      id_category: values.id_category as Uuid,
      // Ensure minimum_payment is a number (handled by zod preprocess)
      minimum_payment: values.minimum_payment ?? 0,
    };
    mutation.mutate(trainingData);
  }

  const handleOpenChange = (open: boolean) => setIsOpen(open);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className='hover:bg-muted'>Create New Training</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Training</DialogTitle>
          <DialogDescription>Fill in the details for the new training session.</DialogDescription>
        </DialogHeader>

        <TrainingForm
          mode="create"
          onSubmit={handleFormSubmit}
          isLoading={mutation.isLoading}
          onCancel={() => setIsOpen(false)}
        />

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={mutation.isLoading}>Cancel</Button>
          <Button type="submit" form="training-form-create" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Creating...' : 'Create Training'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingCreation;
