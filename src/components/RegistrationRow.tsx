// src/components/tournaments/admin/RegistrationRow.tsx
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { TournamentRegistration } from '@/backend/tournament_backend'; // Adjust path
import { Uuid } from '@/backend/common';
import { UserCircle, CalendarClock, Trash2, Loader2, AlertCircle } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Helper (if not global)
const formatDate = (dateString: string | null | undefined, formatString = 'Pp'): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) return dateString;
    return format(date, formatString);
  } catch (error) { return dateString; }
};

interface RegistrationRowProps {
  registration: TournamentRegistration;
  onDelete: (userId: Uuid) => void;
  isDeleting: boolean; // Is deletion pending for *this* row?
  deleteError: Error | null; // Any error from the last delete attempt for *this* row
}

const RegistrationRow: React.FC<RegistrationRowProps> = ({
  registration,
  onDelete,
  isDeleting,
  deleteError,
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b dark:border-gray-700 hover:bg-muted/30 transition-colors">
      <div className="flex items-center space-x-3">
        <UserCircle className="h-5 w-5 text-gray-500 flex-shrink-0" />
        <div>
          {/* TODO: Fetch and display user's actual name */}
          <p className="text-sm font-medium">{registration.id_user}</p>
          <p className="text-xs text-muted-foreground flex items-center">
            <CalendarClock className="h-3 w-3 mr-1" />
            Registered: {formatDate(registration.registration_datetime)}
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
              Delete Reg
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Registration?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the registration for user {registration.id_user} from this tournament. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => onDelete(registration.id_user)}
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

export default RegistrationRow;
