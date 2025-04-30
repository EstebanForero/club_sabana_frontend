import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns'; // For better date formatting

import { Tournament, deleteTournament } from '@/backend/tournament_backend'; // Adjust path
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from 'lucide-react'; // Icons
import { Uuid } from '@/backend/common';

type Props = {
  tournament: Tournament;
  // Prop to enable/disable admin actions like delete/edit
  enableAdminControls?: boolean;
  // Optional: Callback when edit is clicked
  onEdit?: (tournamentId: Uuid) => void;
};

// Helper to safely format dates, handling potential invalid input
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    // Assuming input is 'YYYY-MM-DD HH:MM:SS'
    // Parse it carefully if needed, or directly format if date-fns handles it
    const date = new Date(dateString.replace(' ', 'T')); // Try to make it ISO-like for parsing
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if parsing fails
    }
    return format(date, 'PPpp'); // Format: Sep 21, 2023, 4:30:00 PM
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString; // Fallback to original string on error
  }
};


const TournamentComponent = ({ tournament, enableAdminControls = false, onEdit }: Props) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTournament,
    onSuccess: (message) => {
      toast.success(message || 'Tournament deleted successfully!');
      // Invalidate the query to refetch the list
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(tournament.id_tournament);
    } else {
      // Placeholder for future edit functionality (e.g., open modal/navigate)
      toast.info(`Edit functionality for ${tournament.name} not implemented yet.`);
    }
  };

  return (
    <Card className="w-full max-w-md mb-4 shadow-md"> {/* Added margin bottom and shadow */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{tournament.name}</CardTitle>
        <CardDescription>Category ID: {tournament.id_category}</CardDescription>
        {/* Could add more description like status (Upcoming, Ongoing, Finished) based on dates */}
      </CardHeader>
      <CardContent className="text-sm text-gray-400"> {/* Use Tailwind text utilities */}
        <p>Starts: {formatDate(tournament.start_datetime)}</p>
        <p>Ends: {formatDate(tournament.end_datetime)}</p>
        {/* Add more content if needed, e.g., number of registered players */}
      </CardContent>
      {enableAdminControls && (
        <CardFooter className="flex justify-end gap-2"> {/* Use flex and gap for button spacing */}
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
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  tournament "{tournament.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
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
  );
};

export default TournamentComponent;
