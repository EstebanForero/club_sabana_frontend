import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listTournaments } from '@/backend/tournament_backend';
import TournamentComponent from './TournamentComponent';
import TournamentCreation from './TournamentCreation';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const TournamentManagement = () => {
  const queryClient = useQueryClient();

  const { data: tournaments, isLoading, isError, error } = useQuery({
    queryFn: listTournaments,
    queryKey: ['tournaments'],
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold mr-4">Tournament Management</h1>
        <TournamentCreation />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map(tournament => (
            <TournamentComponent
              key={tournament.id_tournament}
              tournament={tournament}
              enableAdminControls={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentManagement;
