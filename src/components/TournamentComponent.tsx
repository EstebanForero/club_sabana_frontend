import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Tournament, deleteTournament } from '@/backend/tournament_backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Uuid } from '@/backend/common';
import TournamentEdit from './TournamentEdit';
import AdminTournamentDetailsDialog from './AdminTournamentDetailsDialog';
import { formatDate } from '@/lib/utils';

type Props = {
  tournament: Tournament;
  enableAdminControls?: boolean;
};

const TournamentComponent = ({ tournament, enableAdminControls = false }: Props) => {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteTournament,
    onSuccess: (message) => {
      toast.success(message || 'Tournament deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
    onError: (error: Error) => {
      console.error("Error deleting tournament:", error);
      toast.error(`Failed to delete tournament: ${error.message || 'Unknown error'}`);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(tournament.id_tournament);
  };
  const handleEdit = () => setIsEditDialogOpen(true);

  const handleViewDetails = () => {
    setIsDetailsDialogOpen(true);
  };

  return (
    <>
      <Card className="w-full max-w-md mb-4 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{tournament.name}</CardTitle>
          <CardDescription>Category ID: {tournament.id_category}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
          <p><span className="font-medium">Starts:</span> {formatDate(tournament.start_datetime)}</p>
          <p><span className="font-medium">Ends:</span> {formatDate(tournament.end_datetime)}</p>
        </CardContent>

        {enableAdminControls && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleViewDetails}>
              <Eye className="mr-2 h-4 w-4" /> Details
            </Button>

            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={deleteMutation.isLoading}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>
                  Delete tournament
                </AlertDialogTitle>
                you are sure, you want to delete the "{tournament.name}" tournament?
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, delete it
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        )}
      </Card>

      <TournamentEdit
        tournamentId={tournament.id_tournament}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <AdminTournamentDetailsDialog
        tournamentId={tournament.id_tournament}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </>
  );
};

export default TournamentComponent;
