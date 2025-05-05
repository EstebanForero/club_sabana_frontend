import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  getTournament,
  getTournamentRegistrations,
  getTournamentAttendance,
  deleteTournamentRegistration,
  deleteTournamentAttendance,
  Tournament, TournamentRegistration, TournamentAttendance,
} from '@/backend/tournament_backend';
import { Uuid } from '@/backend/common';
import RegistrationRow from './RegistrationRow';
import AttendanceRow from './AttendanceRow';
import { AlertTriangle, Info } from 'lucide-react';
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

  const { data: tournament, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['adminTournamentDetails', tournamentId],
    queryFn: () => getTournament(tournamentId!),
    enabled: !!tournamentId && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const { data: registrations, isLoading: isLoadingRegs } = useQuery({
    queryKey: ['adminTournamentRegistrations', tournamentId],
    queryFn: () => getTournamentRegistrations(tournamentId!),
    enabled: !!tournamentId && isOpen,
    staleTime: 30 * 1000,
  });

  const { data: attendances, isLoading: isLoadingAtt } = useQuery({
    queryKey: ['adminTournamentAttendances', tournamentId],
    queryFn: () => getTournamentAttendance(tournamentId!),
    enabled: !!tournamentId && isOpen,
    staleTime: 30 * 1000,
  });

  const isLoading = isLoadingDetails || isLoadingRegs || isLoadingAtt;

  const deleteRegMutation = useMutation({
    mutationFn: ({ tournamentId, userId }: { tournamentId: Uuid, userId: Uuid }) =>
      deleteTournamentRegistration(tournamentId, userId),
    onSuccess: (message, variables) => {
      toast.success(message || `Registration deleted for ${variables.userId}`);
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
      deleteTournamentAttendance(tournamentId, userId),
    onSuccess: (message, variables) => {
      toast.success(message || `Attendance deleted for ${variables.userId}`);
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
    if (!tournamentId) return;
    setRowError(null);
    setDeletingUserId(userId);
    deleteRegMutation.mutate({ tournamentId, userId });
  };

  const handleDeleteAttendance = (userId: Uuid) => {
    if (!tournamentId) return;
    setRowError(null);
    setDeletingUserId(userId);
    deleteAttMutation.mutate({ tournamentId, userId });
  };

  const renderTabContent = (
    data: TournamentRegistration[] | TournamentAttendance[] | undefined,
    RowComponent: React.FC<any>,
    type: 'registration' | 'attendance',
    isLoadingData: boolean
  ) => {
    if (isLoadingData) {
      return (
        <div className="space-y-2 py-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      );
    }
    if (!data || data.length === 0) {
      return <p className="text-center text-muted-foreground py-6">No {type} records found.</p>;
    }
    return (
      <ScrollArea className="max-h-[50vh] border rounded-md mt-2">
        <div className="divide-y dark:divide-gray-700">
          {data.map((item: any) => {
            const userId = item.id_user;
            const key = `${type}-${userId}`;
            const isDeleting = deletingUserId === userId;
            const currentError = rowError?.userId === userId ? rowError?.error : null;
            const deleteHandler = type === 'registration' ? handleDeleteRegistration : handleDeleteAttendance;

            return (
              <RowComponent
                key={key}
                registration={type === 'registration' ? item : undefined}
                attendance={type === 'attendance' ? item : undefined}
                onDelete={deleteHandler}
                isDeleting={isDeleting}
                deleteError={currentError}
              />
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          {isLoadingDetails || !tournament ? (
            <Skeleton className="h-6 w-3/4" />
          ) : (
            <DialogTitle>Details: {tournament.name}</DialogTitle>
          )}
          <DialogDescription>
            View and manage registrations and attendance records.
            {tournament && (
              <span className="block text-xs mt-1 text-muted-foreground">
                ID: {tournament.id_tournament} | Runs: {formatDate(tournament.start_datetime)} - {formatDate(tournament.end_datetime)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading && !tournament ? (
          <div className="space-y-4 py-6"> <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" /></div>
        ) : (
          <Tabs defaultValue="registrations" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="registrations">Registrations ({registrations?.length ?? 0})</TabsTrigger>
              <TabsTrigger value="attendances">Attendances ({attendances?.length ?? 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="registrations" className="mt-2">
              {renderTabContent(registrations, RegistrationRow, 'registration', isLoadingRegs)}
            </TabsContent>
            <TabsContent value="attendances" className="mt-2">
              {renderTabContent(attendances, AttendanceRow, 'attendance', isLoadingAtt)}
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTournamentDetailsDialog;
