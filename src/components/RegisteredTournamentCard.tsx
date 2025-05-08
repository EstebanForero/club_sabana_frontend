import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tournament } from '@/backend/tournament_backend';
import { CalendarDays, Trophy, CheckCircle } from 'lucide-react';
import EventCourtBadge from './EventCourtBadge';

const formatDate = (dateString: string | null | undefined, formatString = 'PPp'): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string received:", dateString);
      return dateString;
    }
    return format(date, formatString);
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

interface RegisteredTournamentCardProps {
  tournament: Tournament;
  registrationDate: string; // YYYY-MM-DD HH:MM:SS from TournamentRegistration
}

const RegisteredTournamentCard: React.FC<RegisteredTournamentCardProps> = ({
  tournament,
  registrationDate,
}) => {
  return (
    <Card className="w-full max-w-md mb-4 shadow-md dark:border-gray-700">
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
      <CardFooter className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center justify-end">
        <CheckCircle className="mr-2 h-4 w-4" />
        Registered on: {formatDate(registrationDate, 'PPp')}
      </CardFooter>
    </Card>
  );
};

export default RegisteredTournamentCard;
