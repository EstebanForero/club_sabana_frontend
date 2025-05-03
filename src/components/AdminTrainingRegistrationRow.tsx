// src/components/trainings/admin/AdminTrainingRegistrationRow.tsx
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { TrainingRegistration } from '@/backend/training_backend'; // Adjust path
import { Uuid } from '@/backend/common';
import { UserCircle, CalendarClock, CheckSquare, Square, Trash2, Loader2, AlertCircle, CalendarCheck } from 'lucide-react'; // Added icons
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Helper
const formatDate = (dateString: string | null | undefined, formatString = 'Pp'): string => {
  if (!dateString) return 'N/A';
  try { const date = new Date(dateString.replace(' ', 'T')); return format(date, formatString); } catch { return dateString; }
};

interface AdminTrainingRegistrationRowProps {
  registration: TrainingRegistration;
  onDelete: (userId: Uuid) => void;
  isDeleting: boolean;
  deleteError: Error | null;
}

const AdminTrainingRegistrationRow: React.FC<AdminTrainingRegistrationRowProps> = ({
  registration,
  onDelete,
  isDeleting,
  deleteError,
}) => {
  const AttendedIcon = registration.attended ? CheckSquare : Square;
  const attendedColor = registration.attended ? "text-green-600 dark:text-green-400" : "text-muted-foreground";

  return (
    <div className="flex items-center justify-between p-3 border-b dark:border-gray-700 hover:bg-muted/30 transition-colors">
      {/* Left: User Info & Reg Date */}
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

      <div className={`flex items-center text-xs font-medium ${attendedColor}`}>
        <AttendedIcon className="h-4 w-4 mr-1.5" />
        {registration.attended ? `Attended: ${formatDate(registration.attendance_datetime)}` : 'Not Attended'}
      </div>

      <div className="flex flex-col items-end space-y-1">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />} Delete Reg
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Training Registration?</AlertDialogTitle>
              <AlertDialogDescription>
                Remove registration for user {registration.id_user}? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => onDelete(registration.id_user)} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Yes, delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {deleteError && (
          <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> {deleteError.message || 'Failed'}</p>
        )}
      </div>
    </div>
  );
};

export default AdminTrainingRegistrationRow;
