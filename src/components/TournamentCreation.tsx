import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

import { createTournament, TournamentCreationPayload } from '@/backend/tournament_backend';
import TournamentForm, { TournamentFormData } from './TournamentForm';
import { Uuid } from '@/backend/common';
import { PlusCircle } from 'lucide-react';

const TournamentCreation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTournament,
    onSuccess: (createdTournament) => {
      toast.success(`Tournament "${createdTournament.name}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: ['allTournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      console.error("Error creating tournament:", error);
      toast.error(`Failed to create tournament: ${error.message || 'Unknown error'}`);
    },
  });

  function handleFormSubmit(values: TournamentFormData) {
    const tournamentPayload: TournamentCreationPayload = {
      name: values.name,
      id_category: values.id_category as Uuid,
      id_court: values.id_court as Uuid,
      start_datetime: values.start_datetime,
      end_datetime: values.end_datetime,
    };
    mutation.mutate(tournamentPayload);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Tournament</DialogTitle>
        </DialogHeader>
        <TournamentForm
          mode="create"
          onSubmit={handleFormSubmit}
          isLoading={mutation.isLoading}
          onCancel={() => setIsOpen(false)}
          formId="tournament-create-dialog-form"
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
            form="tournament-create-dialog-form"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Creating...' : 'Create Tournament'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentCreation;
