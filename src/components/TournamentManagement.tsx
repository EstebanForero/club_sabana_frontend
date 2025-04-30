import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listTournaments } from '@/backend/tournament_backend'; // Adjust path
import TournamentComponent from './TournamentComponent'; // Adjust path
import TournamentCreation from './TournamentCreation'; // Adjust path
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error state
import { Terminal } from "lucide-react";

const TournamentManagement = () => {
  const queryClient = useQueryClient(); // Needed if TournamentComponent needs to invalidate on edit/other actions

  const { data: tournaments, isLoading, isError, error } = useQuery({
    queryFn: listTournaments,
    queryKey: ['tournaments'], // React Query key for caching and invalidation
  });

  // Placeholder for edit functionality - could open a different dialog/modal
  const handleEditTournament = (tournamentId: string) => {
    console.log("Edit tournament:", tournamentId);
    // Implementation: Fetch tournament details, open an edit form/dialog
    alert(`Edit action triggered for tournament ID: ${tournamentId}. Implement edit logic.`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6"> {/* Add container and padding */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mr-12">Tournament Management</h1>
        {/* Place the creation button/dialog trigger here */}
        <TournamentCreation />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Show Skeleton loaders */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Tournaments</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'An unknown error occurred.'}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && tournaments && tournaments.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No tournaments found.</p>
      )}

      {!isLoading && !isError && tournaments && tournaments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Use grid layout */}
          {tournaments.map(tournament => (
            <TournamentComponent
              key={tournament.id_tournament}
              tournament={tournament}
              enableAdminControls={true} // Assuming this view is for admins
              onEdit={handleEditTournament}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentManagement;
