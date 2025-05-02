import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { TournamentAttendance, TournamentRegistration } from '@/backend/tournament_backend'; // Adjust path
import { Uuid } from '@/backend/common';
import { Check, Clock, UserCircle, Loader2, AlertCircle } from 'lucide-react';

const formatDate = (dateString: string | null | undefined, formatString = 'Pp'): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) return dateString;
    return format(date, formatString);
  } catch (error) { return dateString; }
};


interface AttendanceUserRowProps {
  registration: TournamentRegistration;
  attendance: TournamentAttendance | undefined; // Will be undefined if user hasn't attended yet
  onMarkAttended: (userId: Uuid) => void; // Callback to trigger mutation
  isAttending: boolean; // Is the mutation pending for *this* user?
  mutationError: Error | null; // Any error from the last mutation attempt for *this* user
}

const AttendanceUserRow: React.FC<AttendanceUserRowProps> = ({
  registration,
  attendance,
  onMarkAttended,
  isAttending,
  mutationError,
}) => {
  const hasAttended = !!attendance;
  const positionDisplay = hasAttended && attendance.position > 0 ? `#${attendance.position}` : (hasAttended ? 'Attended' : '');

  return (
    <div className={`flex items-center justify-between p-3 border-b dark:border-gray-700 ${hasAttended ? 'opacity-70 bg-green-500/5 dark:bg-green-500/10' : ''}`}>
      <div className="flex items-center space-x-3">
        <UserCircle className="h-6 w-6 text-gray-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">{registration.id_user}</p> {/* TODO: Fetch User Name if possible */}
          <p className="text-xs text-muted-foreground">
            Registered: {formatDate(registration.registration_datetime)}
          </p>
        </div>
      </div>

      <div className="text-right space-y-1">
        {hasAttended ? (
          <>
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center justify-end">
              <Clock className="h-3 w-3 mr-1" /> Attended: {formatDate(attendance.attendance_datetime)}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Position: {positionDisplay}
            </p>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkAttended(registration.id_user)}
            disabled={isAttending}
          >
            {isAttending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Mark Attended
          </Button>
        )}
        {mutationError && !hasAttended && ( // Show error only if trying to mark and failed
          <p className="text-xs text-destructive flex items-center justify-end">
            <AlertCircle className="h-3 w-3 mr-1" /> {mutationError.message || 'Failed'}
          </p>
        )}
      </div>
    </div>
  );
};

export default AttendanceUserRow;
