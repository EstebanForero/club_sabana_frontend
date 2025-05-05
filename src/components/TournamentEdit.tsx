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

import { getTournament, updateTournament, Tournament } from '@/backend/tournament_backend';
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

  const { data: tournamentData, isLoading: isLoadingTournament, isError } = useQuery({
    queryKey: ['tournaments', tournamentId],
    queryFn: () => getTournament(tournamentId!),
    enabled: !!tournamentId && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: updateTournament,
    onSuccess: (_, updatedTournament) => {
      toast.success(`Tournament "${updatedTournament.name}" updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournaments', updatedTournament.id_tournament] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      console.error("Error updating tournament:", error);
      toast.error(`Failed to update tournament: ${error.message || 'Unknown error'}`);
    },
  });

  function handleFormSubmit(values: TournamentFormData) {
    if (!tournamentId) {
      toast.error("Cannot update tournament: Invalid ID.");
      return;
    }
    console.log("Submitting Tournament Update:", values);
    const updatedTournamentData: Tournament = {
      id_tournament: tournamentId,
      name: values.name,
      id_category: values.id_category as Uuid,
      start_datetime: values.start_datetime,
      end_datetime: values.end_datetime,
    };
    updateMutation.mutate(updatedTournamentData);
  }

  const handleCancel = () => {
    onOpenChange(false);
  };

  const renderContent = () => {
    if (!isOpen) return null;

    if (isLoadingTournament) {
      return (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Skeleton className="h-4 w-16 justify-self-end" />
            <Skeleton className="h-10 w-full col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Skeleton className="h-4 w-16 justify-self-end" />
            <Skeleton className="h-10 w-full col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Skeleton className="h-4 w-16 justify-self-end" />
            <Skeleton className="h-10 w-full col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Skeleton className="h-4 w-16 justify-self-end" />
            <Skeleton className="h-10 w-full col-span-3" />
          </div>
        </div>
      );
    }

    if (isError || !tournamentData) {
      return (
        <p className="text-destructive py-4">
          Error loading tournament data
        </p>
      );
    }

    return (
      <TournamentForm
        mode="edit"
        initialData={tournamentData}
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
              form="tournament-form-edit"
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        )}
        {(isError || !tournamentData && !isLoadingTournament) && (
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
            >
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TournamentEdit;
