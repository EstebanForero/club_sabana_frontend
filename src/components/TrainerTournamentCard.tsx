import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tournament } from '@/backend/tournament_backend'; // Adjust path
import { CalendarDays, Users } from 'lucide-react'; // Icons
import EventCourtBadge from './EventCourtBadge';

const formatDate = (dateString: string | null | undefined, formatString = 'PPp'): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) return dateString;
    return format(date, formatString);
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

interface TrainerTournamentCardProps {
  tournament: Tournament;
  onManageClick: (tournamentId: string) => void; // Callback to open dialog
}

const TrainerTournamentCard: React.FC<TrainerTournamentCardProps> = ({
  tournament,
  onManageClick,
}) => {
  return (
    <Card className="w-full max-w-md mb-4 shadow-md dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{tournament.name}</CardTitle>
        <CardDescription>Category ID: {tournament.id_category}</CardDescription>
        <EventCourtBadge eventId={tournament.id_tournament} eventType="tournament" className="mt-1 text-xs" />
      </CardHeader>
      <CardContent className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
          <span>Starts: {formatDate(tournament.start_datetime)}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
          <span>Ends: {formatDate(tournament.end_datetime)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => onManageClick(tournament.id_tournament)} size="sm">
          <Users className="mr-2 h-4 w-4" />
          Manage Attendance
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrainerTournamentCard;
