// src/components/tournaments/AttendanceUserRow.tsx
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { TournamentAttendance, TournamentRegistration } from '@/backend/tournament_backend'; // Adjust path
import { Uuid } from '@/backend/common';
import { Clock, UserCircle, Edit3, CheckCircle } from 'lucide-react'; // Changed icon

// Reusable date formatting helper (if not globally available)
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
  attendance: TournamentAttendance | undefined; // Undefined if not attended yet
  onSelectUser: (userId: Uuid) => void; // Callback to select this user for attendance entry
  isSelected: boolean; // Is this user currently selected in the parent form?
  isAnyUserSelected: boolean; // Is *any* user selected in the parent form?
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
      {/* User Info Section (Left) */}
      <div className="flex items-center space-x-3">
        <UserCircle className="h-6 w-6 text-gray-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">{registration.id_user}</p> {/* TODO: Fetch User Name */}
          <p className="text-xs text-muted-foreground">
            Registered: {formatDate(registration.registration_datetime)}
          </p>
        </div>
      </div>

      {/* Attendance/Action Section (Right) */}
      <div className="text-right space-y-1 min-w-[150px]"> {/* Ensure minimum width */}
        {hasAttended ? (
          <>
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center justify-end">
              <CheckCircle className="h-3 w-3 mr-1" /> Attended: {formatDate(attendance.attendance_datetime)}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Position: {positionDisplay}
            </p>
            {/* Optional: Add an edit button here later if needed */}
          </>
        ) : (
          <Button
            variant={isSelected ? "secondary" : "outline"} // Highlight if selected
            size="sm"
            onClick={() => onSelectUser(registration.id_user)}
            // Disable if this user has attended OR if another user is currently selected for editing
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
