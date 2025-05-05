import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { TournamentAttendance } from '@/backend/tournament_backend';
import { Uuid } from '@/backend/common';
import { UserCircle, CalendarCheck, Medal, Trash2, Loader2, AlertCircle } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formatDate = (dateString: string | null | undefined, formatString = 'Pp'): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) return dateString;
    return format(date, formatString);
  } catch (error) { return dateString; }
};

interface AttendanceRowProps {
  attendance: TournamentAttendance;
  onDelete: (userId: Uuid) => void;
  isDeleting: boolean;
  deleteError: Error | null;
}

const AttendanceRow: React.FC<AttendanceRowProps> = ({
  attendance,
  onDelete,
  isDeleting,
  deleteError,
}) => {
  const positionDisplay = attendance.position > 0 ? `#${attendance.position}` : 'N/A';

  return (
    <div className="flex items-center justify-between p-3 border-b dark:border-gray-700 hover:bg-muted/30 transition-colors">
      <div className="flex items-center space-x-3">
        <UserCircle className="h-5 w-5 text-gray-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">{attendance.id_user}</p>
          <p className="text-xs text-muted-foreground flex items-center">
            <CalendarCheck className="h-3 w-3 mr-1" />
            Attended: {formatDate(attendance.attendance_datetime)}
          </p>
          <p className="text-xs text-muted-foreground flex items-center">
            <Medal className="h-3 w-3 mr-1" />
            Position: {positionDisplay}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-1">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Delete Att
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Attendance Record?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the attendance record (including position) for user {attendance.id_user} from this tournament. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => onDelete(attendance.id_user)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {deleteError && (
          <p className="text-xs text-destructive flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" /> {deleteError.message || 'Failed'}
          </p>
        )}
      </div>
    </div>
  );
};

export default AttendanceRow;
