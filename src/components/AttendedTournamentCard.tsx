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
import { Tournament, TournamentAttendance } from '@/backend/tournament_backend';
import { CalendarDays, Trophy, Medal, Clock } from 'lucide-react';

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

interface AttendedTournamentCardProps {
  tournament: Tournament;
  attendance: TournamentAttendance;
}

const AttendedTournamentCard: React.FC<AttendedTournamentCardProps> = ({
  tournament,
  attendance,
}) => {
  const positionDisplay = attendance.position > 0 ? `#${attendance.position}` : 'N/A';

  return (
    <Card className="w-full max-w-md mb-4 shadow-sm dark:border-gray-700 border-l-4 border-blue-500">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center">
          <Trophy className="mr-2 h-4 w-4 text-yellow-500" /> {tournament.name}
        </CardTitle>
        <CardDescription className="text-xs">
          {formatDate(tournament.start_datetime, 'P')} - {formatDate(tournament.end_datetime, 'P')}
        </CardDescription>
      </CardHeader>
      {/* <CardContent className="text-sm text-gray-700 dark:text-gray-400 space-y-1 pb-2">
                <div className="flex items-center text-xs">
                    <CalendarDays className="mr-1.5 h-3 w-3" />
                    <span>Starts: {formatDate(tournament.start_datetime)}</span>
                </div>
                <div className="flex items-center text-xs">
                    <CalendarDays className="mr-1.5 h-3 w-3" />
                    <span>Ends: {formatDate(tournament.end_datetime)}</span>
                </div>
            </CardContent> */}
      <CardFooter className="text-sm text-gray-700 dark:text-gray-300 font-medium p-3 flex flex-col items-start space-y-1 bg-blue-500/10">
        <div className="flex items-center">
          <Clock className="mr-1.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>Attended: {formatDate(attendance.attendance_datetime, 'PPp')}</span>
        </div>
        <div className="flex items-center font-semibold">
          <Medal className="mr-1.5 h-4 w-4 text-orange-500" />
          <span>Position: {positionDisplay}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AttendedTournamentCard;
