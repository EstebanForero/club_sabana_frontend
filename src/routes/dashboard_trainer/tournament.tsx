import TournamentAttendanceDialog from '@/components/TournamentAttendaceDialog';
import TrainerTournamentCard from '@/components/TrainerTournamentCard';
import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Uuid } from '@/backend/common';
import { useQuery } from '@tanstack/react-query';
import { listTournaments } from '@/backend/tournament_backend';

export const Route = createFileRoute('/dashboard_trainer/tournament')({
  component: TrainerTournamentPageComponent,
})

function TrainerTournamentPageComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<Uuid | null>(null);
  const [selectedTournamentName, setSelectedTournamentName] = useState<string | undefined>(undefined); // For dialog title


  const { data: tournaments, isLoading, isError, error } = useQuery({
    queryKey: ['allTournamentsTrainer'], // Different key from user view if needed
    queryFn: listTournaments,
    staleTime: 5 * 60 * 1000,
  });

  const handleManageClick = (tournamentId: Uuid, tournamentName?: string) => {
    setSelectedTournamentId(tournamentId);
    setSelectedTournamentName(tournamentName);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedTournamentId(null);
      setSelectedTournamentName(undefined);
    }
  };


  const renderTournamentList = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={`trainer-skel-${i}`} className="space-y-3 p-4 border rounded-lg dark:border-gray-700">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2 pt-2"> <Skeleton className="h-4 w-full" /> <Skeleton className="h-4 w-5/6" /> </div>
              <div className="flex justify-end pt-2"> <Skeleton className="h-9 w-40" /> </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Tournaments</AlertTitle>
          <AlertDescription>
            Could not fetch the list of tournaments.
          </AlertDescription>
        </Alert>
      );
    }

    if (!tournaments || tournaments.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-8">
          No tournaments found.
        </p>
      );
    }

    const sortedTournaments = [...tournaments].sort((a, b) =>
      new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime()
    );


    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTournaments.map((tournament) => (
          <TrainerTournamentCard
            key={tournament.id_tournament}
            tournament={tournament}
            onManageClick={(id) => handleManageClick(id, tournament.name)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Tournament Attendance</h1>

      {renderTournamentList()}

      <TournamentAttendanceDialog
        tournamentId={selectedTournamentId}
        isOpen={isDialogOpen}
        onOpenChange={handleDialogClose}
        tournamentName={selectedTournamentName}
      />
    </div>
  );
}
