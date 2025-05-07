import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  getTournament,
  getTournamentRegistrations,
  getTournamentAttendanceList,
  deleteUserRegistrationFromTournament,
  deleteUserAttendanceFromTournament,
  Tournament, TournamentRegistration, TournamentAttendance,
} from '@/backend/tournament_backend';
import { Uuid } from '@/backend/common';
import RegistrationRow from './RegistrationRow';
import AttendanceRow from './AttendanceRow';

import { formatDate } from '@/lib/utils';

interface AdminTournamentDetailsDialogProps {
  tournamentId: Uuid | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminTournamentDetailsDialog: React.FC<AdminTournamentDetailsDialogProps> = ({
  tournamentId,
  isOpen,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const [deletingUserId, setDeletingUserId] = useState<Uuid | null>(null);
  const [rowError, setRowError] = useState<{ userId: Uuid, error: Error } | null>(null);

  const { data: tournament, isLoading: isLoadingDetails, isError: isErrorDetails } = useQuery({
    queryKey: ['adminTournamentDetails', tournamentId],
    queryFn: () => getTournament(tournamentId!),
    enabled: !!tournamentId && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const { data: registrationsData, isLoading: isLoadingRegs, isError: isErrorRegs } = useQuery({
    queryKey: ['adminTournamentRegistrations', tournamentId],
    queryFn: () => getTournamentRegistrations(tournamentId!),
    enabled: !!tournamentId && isOpen,
    staleTime: 30 * 1000,
  });
  const registrations = Array.isArray(registrationsData) ? registrationsData : [];


  const { data: attendancesData, isLoading: isLoadingAtt, isError: isErrorAtt } = useQuery({
    queryKey: ['adminTournamentAttendances', tournamentId],
    queryFn: () => getTournamentAttendanceList(tournamentId!),
    enabled: !!tournamentId && isOpen,
    staleTime: 30 * 1000,
  });
  const attendances = Array.isArray(attendancesData) ? attendancesData : [];

  const isLoading = isLoadingDetails || isLoadingRegs || isLoadingAtt;

  const hasFetchError = isErrorDetails || isErrorRegs || isErrorAtt;


  const deleteRegMutation = useMutation({
    mutationFn: ({ tournamentId, userId }: { tournamentId: Uuid, userId: Uuid }) =>
      deleteUserRegistrationFromTournament(tournamentId, userId),
    onSuccess: (response, variables) => {
      toast.success(typeof response === 'string' && response ? response : `Registration deleted for ${variables.userId}`);
      setRowError(null);
      queryClient.invalidateQueries({ queryKey: ['adminTournamentRegistrations', tournamentId] });
      queryClient.invalidateQueries({ queryKey: ['adminTournamentAttendances', tournamentId] });
    },
    onError: (error: Error, variables) => {
      setRowError({ userId: variables.userId, error });
      toast.error(`Failed to delete registration: ${error.message || 'Unknown error'}`);
    },
    onSettled: () => {
      setDeletingUserId(null);
    }
  });

  const deleteAttMutation = useMutation({
    mutationFn: ({ tournamentId, userId }: { tournamentId: Uuid, userId: Uuid }) =>
      deleteUserAttendanceFromTournament(tournamentId, userId),
    onSuccess: (response, variables) => {
      toast.success(typeof response === 'string' && response ? response : `Attendance deleted for ${variables.userId}`);
      setRowError(null);
      queryClient.invalidateQueries({ queryKey: ['adminTournamentAttendances', tournamentId] });
    },
    onError: (error: Error, variables) => {
      setRowError({ userId: variables.userId, error });
      toast.error(`Failed to delete attendance: ${error.message || 'Unknown error'}`);
    },
    onSettled: () => {
      setDeletingUserId(null);
    }
  });

  const handleDeleteRegistration = (userId: Uuid) => {
    if (!tournamentId || deleteRegMutation.isLoading || deleteAttMutation.isLoading) return;
    setRowError(null);
    setDeletingUserId(userId);
    deleteRegMutation.mutate({ tournamentId, userId });
  };

  const handleDeleteAttendance = (userId: Uuid) => {
    if (!tournamentId || deleteRegMutation.isLoading || deleteAttMutation.isLoading) return;
    setRowError(null);
    setDeletingUserId(userId);
    deleteAttMutation.mutate({ tournamentId, userId });
  };

  const renderTabContent = (
    data: TournamentRegistration[] | TournamentAttendance[],
    RowComponent: React.FC<any>,
    type: 'registration' | 'attendance',
    isLoadingData: boolean,
    hasErrorData: boolean
  ) => {
    if (isLoadingData) {
      return (
        <div className="space-y-2 py-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      );
    }
    if (hasErrorData) {
      return <p className="text-center text-destructive py-6">Error loading {type} data.</p>;
    }
    if (data.length === 0) {
      return <p className="text-center text-muted-foreground py-6">No {type} records found.</p>;
    }
    return (
      <ScrollArea className="max-h-[50vh] border rounded-md mt-2">
        <div className="divide-y dark:divide-gray-700">
          {data.map((item: any) => {
            const userId = item.id_user;
            const key = `${type}-${userId}`;
            const isDeletingThisUserAndType = deletingUserId === userId &&
              ((type === 'registration' && deleteRegMutation.isLoading) || (type === 'attendance' && deleteAttMutation.isLoading));

            const currentError = rowError?.userId === userId ? rowError?.error : null;
            const deleteHandler = type === 'registration' ? handleDeleteRegistration : handleDeleteAttendance;

            const rowProps = {
              key: key,
              onDelete: deleteHandler,
              isDeleting: isDeletingThisUserAndType,
              deleteError: currentError,
              ...(type === 'registration' && { registration: item as TournamentRegistration }),
              ...(type === 'attendance' && { attendance: item as TournamentAttendance }),
            };

            return React.createElement(RowComponent, rowProps);
          })}
        </div>
      </ScrollArea>
    );
  };

  // Overall loading/error for the dialog content before tabs are shown
  if (isLoadingDetails && !tournament) { // Initial loading for tournament details
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </DialogHeader>
          <div className="space-y-4 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (isErrorDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Error Loading Tournament</DialogTitle>
            <DialogDescription>Could not fetch tournament details.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6"> <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button> </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Details: {tournament?.name || 'Loading...'}</DialogTitle>
          <DialogDescription>
            View and manage registrations and attendance records.
            {tournament && (
              <span className="block text-xs mt-1 text-muted-foreground">
                ID: {tournament.id_tournament} | Runs: {formatDate(tournament.start_datetime)} - {formatDate(tournament.end_datetime)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {tournament && (
          <Tabs defaultValue="registrations" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="registrations">Registrations ({registrations.length})</TabsTrigger>
              <TabsTrigger value="attendances">Attendances ({attendances.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="registrations" className="mt-2">
              {renderTabContent(registrations, RegistrationRow, 'registration', isLoadingRegs, isErrorRegs)}
            </TabsContent>
            <TabsContent value="attendances" className="mt-2">
              {renderTabContent(attendances, AttendanceRow, 'attendance', isLoadingAtt, isErrorAtt)}
            </TabsContent>
          </Tabs>
        )}
        {isLoading && tournament && <p className="text-center py-4">Loading records...</p>}
        {hasFetchError && tournament && <p className="text-center text-destructive py-4">Error loading some records.</p>}


        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTournamentDetailsDialog;
