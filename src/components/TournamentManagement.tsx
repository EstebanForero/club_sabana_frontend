import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listTournaments } from '@/backend/tournament_backend';
import TournamentComponent from './TournamentComponent';
import TournamentCreation from './TournamentCreation';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Terminal } from "lucide-react";

const TournamentManagement = () => {
  const { data: tournaments, isLoading, isError, error } = useQuery({
    queryKey: ['tournaments'], // Use the shared key if admin sees all
    queryFn: listTournaments,
    staleTime: 2 * 60 * 1000, // Keep somewhat fresh
  });

  // Render Loading
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Tournaments</h1>
          <Skeleton className="h-10 w-36" /> {/* Skeleton for create button */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  // Render Error
  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Manage Tournaments</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load tournaments</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Tournaments</h1>
        <TournamentCreation /> {/* Add the creation button/dialog */}
      </div>

      {tournaments && tournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map((tournament) => (
            <TournamentComponent
              key={tournament.id_tournament}
              tournament={tournament}
              enableAdminControls={true} // <-- Ensure controls are enabled
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8">
          No tournaments found. Create one to get started!
        </p>
      )}
    </div>
  );
};

export default TournamentManagement;
