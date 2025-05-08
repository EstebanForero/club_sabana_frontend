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
import { Tournament } from '@/backend/tournament_backend';
import { Uuid } from '@/backend/common';
import { CalendarDays, Trophy, CheckSquare } from 'lucide-react';
import EventCourtBadge from './EventCourtBadge';

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string received:", dateString);
      return dateString;
    }
    return format(date, 'PPp');
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

interface UserTournamentCardProps {
  tournament: Tournament;
  userId: Uuid;
  onRegister: (tournamentId: Uuid) => void;
  isRegistering: boolean;
}

const UserTournamentCard: React.FC<UserTournamentCardProps> = ({
  tournament,
  userId,
  onRegister,
  isRegistering,
}) => {

  const handleRegisterClick = () => {
    onRegister(tournament.id_tournament);
  };

  return (
    <Card className="w-full max-w-md mb-4 shadow-md transition-shadow hover:shadow-lg dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" /> {tournament.name}
        </CardTitle>
        <CardDescription>Category ID: {tournament.id_category}</CardDescription>
        <EventCourtBadge eventId={tournament.id_tournament} eventType="tournament" className="mt-1 text-xs" />
      </CardHeader>
      <CardContent className="text-sm text-gray-700 dark:text-gray-400 space-y-2">
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
        <Button
          onClick={handleRegisterClick}
          disabled={isRegistering}
          size="sm"
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          {isRegistering ? 'Registering...' : 'Register'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserTournamentCard;
