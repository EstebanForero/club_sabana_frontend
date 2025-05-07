import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { createTraining, TrainingCreationPayload } from '@/backend/training_backend';
import TrainingForm, { TrainingFormData } from './TrainingForm';
import { Uuid } from '@/backend/common';
import { PlusCircle } from 'lucide-react';

const TrainingCreation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTraining,
    onSuccess: (createdTraining) => {
      toast.success(`Training "${createdTraining.name}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: ['allTrainings'] });
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      console.error("Error creating training:", error);
      toast.error(`Failed to create training: ${error.message || 'Unknown error'}`);
    },
  });

  function handleFormSubmit(values: TrainingFormData) {
    const trainingPayload: TrainingCreationPayload = {
      name: values.name,
      id_category: values.id_category as Uuid,
      trainer_id: values.trainer_id as Uuid,
      id_court: values.id_court as Uuid,
      start_datetime: values.start_datetime,
      end_datetime: values.end_datetime,
      minimum_payment: values.minimum_payment ?? 0
    };
    mutation.mutate(trainingPayload);
  }

  const handleOpenChange = (open: boolean) => setIsOpen(open);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Training
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Training</DialogTitle>
          <DialogDescription>Fill in the details for the new training session.</DialogDescription>
        </DialogHeader>

        <TrainingForm
          mode="create"
          onSubmit={handleFormSubmit}
          isLoading={mutation.isLoading}
          onCancel={() => setIsOpen(false)}
          formId="training-create-dialog-form"
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={mutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="training-create-dialog-form"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Creating...' : 'Create Training'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingCreation;
