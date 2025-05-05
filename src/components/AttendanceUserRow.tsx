import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { TournamentAttendance, TournamentRegistration } from '@/backend/tournament_backend';
import { Uuid } from '@/backend/common';
import { Clock, UserCircle, Edit3, CheckCircle } from 'lucide-react';

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
  attendance: TournamentAttendance | undefined;
  onSelectUser: (userId: Uuid) => void;
  isSelected: boolean;
  isAnyUserSelected: boolean;
}

const AttendanceUserRow: React.FC<AttendanceUserRowProps> = ({
  registration,
  attendance,
  onSelectUser,
  isSelected,
  isAnyUserSelected,
}) => {
  const hasAttended = !!attendance;
  const positionDisplay = hasAttended && attendance.position > 0 ? `#${attendance.position}` : (hasAttended ? 'Attended (No Pos)' : ''); // Indicate if pos is 0/missing

  return (
    <div className={`flex items-center justify-between p-3 border-b dark:border-gray-700 transition-colors ${isSelected ? 'bg-blue-500/10' : ''} ${hasAttended ? 'opacity-70' : ''}`}>
      <div className="flex items-center space-x-3">
        <UserCircle className="h-6 w-6 text-gray-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">{registration.id_user}</p>
          <p className="text-xs text-muted-foreground">
            Registered: {formatDate(registration.registration_datetime)}
          </p>
        </div>
      </div>

      <div className="text-right space-y-1 min-w-[150px]">
        {hasAttended ? (
          <>
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center justify-end">
              <CheckCircle className="h-3 w-3 mr-1" /> Attended: {formatDate(attendance.attendance_datetime)}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Position: {positionDisplay}
            </p>
          </>
        ) : (
          <Button
            variant={isSelected ? "secondary" : "outline"}
            size="sm"
            onClick={() => onSelectUser(registration.id_user)}
            disabled={hasAttended || (isAnyUserSelected && !isSelected)}
            aria-label={`Set attendance details for user ${registration.id_user}`}
          >
            <Edit3 className="mr-2 h-4 w-4" />
            {isSelected ? 'Selected' : 'Set Details'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AttendanceUserRow;
