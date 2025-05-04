import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTrainingRegistrations, markAttendance, TrainingRegistration } from '@/backend/training_backend';
import { Uuid } from '@/backend/common';
import { formatDate } from '@/lib/utils';
import { AlertTriangle, UserCheck, UserX } from 'lucide-react';

interface TrainingManagementDialogProps {
  trainingId: Uuid | null;
  trainingName?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrainingManagementDialog: React.FC<TrainingManagementDialogProps> = ({
  trainingId,
  trainingName,
  isOpen,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const [updatingAttendanceUserId, setUpdatingAttendanceUserId] = useState<Uuid | null>(null);

  const {
    data: registrations,
    isLoading: isLoadingRegistrations,
    isError: isErrorRegistrations,
    error: errorRegistrations,
  } = useQuery({
    queryKey: ['trainingRegistrations', trainingId],
    queryFn: () => getTrainingRegistrations(trainingId!),
    enabled: !!trainingId && isOpen,
    staleTime: 1 * 60 * 1000,
  });

  const markAttendanceMutation = useMutation({
    mutationFn: (variables: { trainingId: Uuid; userId: Uuid; attended: boolean }) =>
      markAttendance(variables.trainingId, variables.userId, variables.attended),
    onMutate: (variables) => {
      setUpdatingAttendanceUserId(variables.userId);
    },
    onSuccess: (message, variables) => {
      toast.success(message || `Attendance updated for user ${variables.userId}.`);
      queryClient.invalidateQueries({ queryKey: ['trainingRegistrations', variables.trainingId] });
    },
    onError: (error: Error, variables) => {
      console.error("Error marking attendance:", error);
      toast.error(`Failed to update attendance for user ${variables.userId}: ${error.message || 'Unknown error'}`);
    },
    onSettled: () => {
      setUpdatingAttendanceUserId(null);
    }
  });

  const handleAttendanceChange = (userId: Uuid, currentAttendedStatus: boolean) => {
    if (!trainingId || markAttendanceMutation.isLoading) return;

    markAttendanceMutation.mutate({
      trainingId,
      userId,
      attended: !currentAttendedStatus,
    });
  };

  const renderContent = () => {
    if (isLoadingRegistrations) {
      return (
        <div className="space-y-3 py-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex justify-between items-center">
              <div className='w-2/5'><Skeleton className="h-5 w-full" /></div>
              <div className='w-1/3'><Skeleton className="h-5 w-full" /></div>
              <div className='w-1/6'><Skeleton className="h-8 w-full" /></div>
            </div>
          ))}
        </div>
      );
    }

    if (isErrorRegistrations) {
      return (
        <Alert variant="destructive" className='my-4'>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Registrations</AlertTitle>
          <AlertDescription>
            Could not fetch registrations for this training.
          </AlertDescription>
        </Alert>
      );
    }

    if (!registrations || registrations.length === 0) {
      return <p className="text-muted-foreground text-center py-6">No users registered for this training yet.</p>;
    }

    return (
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Registered On</TableHead>
            <TableHead className="text-right">Attended</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((reg) => {
            const isUpdatingThisUser = updatingAttendanceUserId === reg.id_user;
            return (
              <TableRow key={reg.id_user}>
                <TableCell className="font-medium">{reg.id_user}</TableCell>
                <TableCell>{formatDate(reg.registration_datetime, 'PPp')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Label htmlFor={`attendance-${reg.id_user}`} className="sr-only">
                      Mark Attendance for {reg.id_user}
                    </Label>
                    <Switch
                      id={`attendance-${reg.id_user}`}
                      checked={reg.attended}
                      onCheckedChange={() => handleAttendanceChange(reg.id_user, reg.attended)}
                      disabled={isUpdatingThisUser} // Disable while this user's attendance is being updated
                      aria-label={`Mark attendance for user ${reg.id_user}`}
                    />
                    {reg.attended
                      ? <UserCheck className="h-5 w-5 text-green-600" />
                      : <UserX className="h-5 w-5 text-muted-foreground" />
                    }
                  </div>
                  {isUpdatingThisUser && <p className="text-xs text-muted-foreground text-right mt-1">Updating...</p>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg"> {/* Adjust width if needed */}
        <DialogHeader>
          <DialogTitle>Manage Registrations</DialogTitle>
          <DialogDescription>
            Training: {trainingName || trainingId || 'N/A'}. Toggle switch to mark attendance.
          </DialogDescription>
        </DialogHeader>

        {renderContent()}

        {/* Optional Footer with Close Button */}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default TrainingManagementDialog;
