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
  DialogTrigger,
} from '@/components/ui/dialog';

import { createTournament, TournamentCreation as TournamentCreationData } from '@/backend/tournament_backend'; // Adjust path
import TournamentForm, { TournamentFormData } from './TournamentForm'; // Import the refactored form
import { Uuid } from '@/backend/common';

const TournamentCreation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTournament,
    onSuccess: () => {
      toast.success('Tournament created successfully!');
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      setIsOpen(false); // Close dialog on success
      // Form reset is handled within TournamentForm via useEffect/props
    },
    onError: (error: Error) => {
      console.error("Error creating tournament:", error);
      toast.error(`Failed to create tournament: ${error.message || 'Unknown error'}`);
    },
  });

  function handleFormSubmit(values: TournamentFormData) {
    console.log("Submitting Tournament Creation:", values);
    // Type assertion needed as schema ensures it's a valid UUID string here
    const tournamentData: TournamentCreationData = {
      ...values,
      id_category: values.id_category as Uuid,
    };
    mutation.mutate(tournamentData);
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className='hover:text-gray-500 bg-green-600'>
          Create New Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
        </DialogHeader>

        <TournamentForm
          mode="create"
          onSubmit={handleFormSubmit}
          isLoading={mutation.isLoading}
          onCancel={() => setIsOpen(false)}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={mutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="tournament-form-create"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Creating...' : 'Create Tournament'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentCreation
