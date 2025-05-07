import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';


import { getTournament, updateTournament, Tournament, TournamentUpdatePayload } from '@/backend/tournament_backend';
import TournamentForm, { TournamentFormData } from './TournamentForm';
import { Uuid } from '@/backend/common';

interface TournamentEditProps {
  tournamentId: Uuid | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TournamentEdit: React.FC<TournamentEditProps> = ({
  tournamentId,
  isOpen,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();

  const { data: tournamentData, isLoading: isLoadingTournament, isError, error: queryError, isFetching } = useQuery({
    queryKey: ['tournamentDetails', tournamentId],
    queryFn: () => getTournament(tournamentId!),
    enabled: !!tournamentId && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: Uuid, data: TournamentUpdatePayload }) => updateTournament(payload.id, payload.data),
    onSuccess: (updatedTournament) => {
      toast.success(`Tournament "${updatedTournament.name}" updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ['allTournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournamentDetails', updatedTournament.id_tournament] });
      onOpenChange(false);
    },
    onError: (error: Error, variables) => {
      console.error("Error updating tournament:", error);
      toast.error(`Failed to update tournament: ${error.message || 'Unknown error'}`);
    },
  });

  function handleFormSubmit(values: TournamentFormData) {
    if (!tournamentId) {
      toast.error("Cannot update tournament: Invalid ID.");
      return;
    }
    const tournamentUpdatePayload: TournamentUpdatePayload = {
      name: values.name,
      id_category: values.id_category as Uuid,
      id_court: values.id_court as Uuid,
      start_datetime: values.start_datetime,
      end_datetime: values.end_datetime,
    };
    updateMutation.mutate({ id: tournamentId, data: tournamentUpdatePayload });
  }

  const handleCancel = () => {
    onOpenChange(false);
  };

  const renderContent = () => {
    if (!isOpen) return null;

    if (isLoadingTournament || (isFetching && !tournamentData)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      );
    }

    if (isError || !tournamentData) {
      return (
        <Alert variant="destructive" className='my-4'>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Tournament Data</AlertTitle>
          <AlertDescription>{queryError instanceof Error ? queryError.message : "Could not load details."}</AlertDescription>
        </Alert>
      );
    }

    const initialFormData = {
      ...tournamentData,
      id_court: undefined,
    };


    return (
      <TournamentForm
        mode="edit"
        initialData={initialFormData}
        onSubmit={handleFormSubmit}
        isLoading={updateMutation.isLoading}
        onCancel={handleCancel}
        formId="tournament-edit-dialog-form"
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Tournament</DialogTitle>
          <DialogDescription>
            Modify the details for the tournament below.
          </DialogDescription>
        </DialogHeader>

        {renderContent()}

        {!isLoadingTournament && !isError && tournamentData && (
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
              form="tournament-edit-dialog-form"
              disabled={updateMutation.isLoading || isFetching}
            >
              {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        )}
        {(isError && !isLoadingTournament) && (
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>Close</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TournamentEdit;
