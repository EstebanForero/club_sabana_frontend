// src/components/tournaments/TournamentAttendanceDialog.tsx (or your path to it)
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parse, isWithinInterval, isValid, format as formatDateFn } from 'date-fns'; // Removed formatDate as it's a local var

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  getTournamentRegistrations,
  recordTournamentAttendance,
  TournamentRegistration,
  TournamentAttendance,
  TournamentAttendancePayload,
  Tournament,
  getTournament,
  getTournamentAttendanceList,
} from '@/backend/tournament_backend';
import { Uuid } from '@/backend/common';
import AttendanceUserRow from './AttendanceUserRow';
import { AlertTriangle, ListOrdered, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatDate as formatDateUtil, getCurrentDateTimeString } from '@/lib/utils';

interface TournamentAttendanceDialogProps {
  tournamentId: Uuid | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentName?: string;
}

interface CombinedUserData {
  registration: TournamentRegistration;
  attendance?: TournamentAttendance;
}

const TournamentAttendanceDialog: React.FC<TournamentAttendanceDialogProps> = ({
  tournamentId,
  isOpen,
  onOpenChange,
  tournamentName,
}) => {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<Uuid | null>(null);
  const [attendancePosition, setAttendancePosition] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { data: tournamentDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['tournamentDetailsDialog', tournamentId],
    queryFn: () => getTournament(tournamentId!),
    enabled: !!tournamentId && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const { data: registrations, isLoading: isLoadingRegs } = useQuery({
    queryKey: ['tournamentRegistrationsDialog', tournamentId],
    queryFn: () => getTournamentRegistrations(tournamentId!),
    enabled: !!tournamentId && isOpen, staleTime: 1 * 60 * 1000,
  });

  const { data: attendances, isLoading: isLoadingAtt } = useQuery({
    queryKey: ['tournamentAttendanceListDialog', tournamentId],
    queryFn: () => getTournamentAttendanceList(tournamentId!),
    enabled: !!tournamentId && isOpen, staleTime: 1 * 60 * 1000,
  });

  const isLoading = isLoadingDetails || isLoadingRegs || isLoadingAtt;
  const effectiveTournamentName = tournamentName || tournamentDetails?.name || 'Tournament';

  const combinedUsers = useMemo<CombinedUserData[]>(() => {
    const validRegistrations = Array.isArray(registrations) ? registrations : [];
    const validAttendances = Array.isArray(attendances) ? attendances : [];
    if (validRegistrations.length === 0) return [];

    const attendanceMap = new Map<Uuid, TournamentAttendance>();
    validAttendances.forEach(att => attendanceMap.set(att.id_user, att));

    return validRegistrations.map(reg => ({
      registration: reg, attendance: attendanceMap.get(reg.id_user),
    })).sort((a, b) => {
      const attendedA = !!a.attendance; const attendedB = !!b.attendance;
      if (attendedA !== attendedB) return attendedA ? 1 : -1;
      if (a.attendance && b.attendance) {
        return a.attendance.position - b.attendance.position;
      }
      return new Date(a.registration.registration_datetime).getTime() - new Date(b.registration.registration_datetime).getTime();
    });
  }, [registrations, attendances]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedUserId(null);
      setAttendancePosition('');
      setFormError(null);
    }

    if (isOpen) {
      setAttendancePosition('');
      setFormError(null);
    }
  }, [selectedUserId, isOpen]);

  const recordAttendanceMutation = useMutation({
    mutationFn: (variables: { idTournament: Uuid; payload: TournamentAttendancePayload }) =>
      recordTournamentAttendance(variables.idTournament, variables.payload),
    onSuccess: (createdAttendance, variables) => {
      toast.success(`Attendance recorded for user ${variables.payload.id_user}. Position: ${createdAttendance.position}`);
      queryClient.invalidateQueries({ queryKey: ['tournamentAttendanceListDialog', tournamentId] });
      queryClient.invalidateQueries({ queryKey: ['tournamentAttendances', tournamentId] }); // If used elsewhere
      setSelectedUserId(null);
    },
    onError: (error: Error, variables) => {
      console.error("Error recording attendance:", error);
      setFormError(error.message || 'An unknown error occurred.');
      toast.error(`Failed to record for ${variables.payload.id_user}: ${error.message || 'Check form details.'}`);
    },
  });


  const handleSaveAttendance = useCallback(() => {
    setFormError(null);
    if (!selectedUserId || !tournamentId) {
      setFormError("Cannot save: Missing user selection or tournament ID.");
      return;
    }

    const pos = parseInt(attendancePosition, 10);
    if (isNaN(pos) || pos <= 0 || !Number.isInteger(pos)) {
      setFormError("Position must be a positive whole number.");
      return;
    }

    const isPositionTaken = attendances?.some(att => att.id_user !== selectedUserId && att.position === pos && att.position > 0);
    if (isPositionTaken) {
      setFormError(`Position ${pos} is already assigned to another user.`);
      return;
    }

    const payload: TournamentAttendancePayload = {
      id_user: selectedUserId,
      position: pos,
    };

    recordAttendanceMutation.mutate({ idTournament: tournamentId, payload });

  }, [
    selectedUserId, tournamentId, attendancePosition, attendances, recordAttendanceMutation
  ]);

  const handleCancelEdit = () => {
    setSelectedUserId(null);
    setAttendancePosition('');
    setFormError(null);
  };


  const renderUserList = () => {
    if (isLoadingRegs || isLoadingAtt) {
      return (
        <div className="space-y-3 py-4 min-h-[200px]">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      )
    }
    if (!registrations || !attendances) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Could not load registration data.</AlertDescription>
        </Alert>
      );
    }
    if (combinedUsers.length === 0) {
      return <p className="text-center text-muted-foreground py-8">No users registered.</p>;
    }

    return (
      <ScrollArea className="max-h-[45vh] border rounded-md">
        <div className="divide-y dark:divide-gray-700">
          {combinedUsers.map(({ registration, attendance }) => (
            <AttendanceUserRow
              key={registration.id_user}
              registration={registration}
              attendance={attendance}
              onSelectUser={() => setSelectedUserId(registration.id_user)}
              isSelected={selectedUserId === registration.id_user}
              isAnyUserSelected={!!selectedUserId}
            />
          ))}
        </div>
      </ScrollArea>
    );
  };

  const renderAttendanceForm = () => {
    if (!selectedUserId) return null;

    const selectedUserRegistration = registrations?.find(reg => reg.id_user === selectedUserId);
    const selectedUserName = selectedUserRegistration ? `User ID: ${selectedUserRegistration.id_user}` : `User ID: ${selectedUserId}`; // Fallback

    return (
      <div className="mt-4 p-4 border rounded-lg bg-muted/40">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-md">
            Record Attendance for: {selectedUserName}
          </h4>
          <Button variant="ghost" size="icon" onClick={handleCancelEdit} aria-label="Cancel attendance entry">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1.5 mb-3">
          <Label htmlFor="attendance-position">Position</Label>
          <div className="flex items-center">
            <ListOrdered className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              id="attendance-position"
              type="number"
              placeholder="e.g., 1"
              min="1"
              step="1"
              value={attendancePosition}
              onChange={(e) => setAttendancePosition(e.target.value)}
              disabled={recordAttendanceMutation.isLoading}
              className={formError && (formError.includes("Position") || formError.includes("positive")) ? "border-destructive" : ""}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Must be a unique positive whole number.
          </p>
        </div>

        {formError && (
          <Alert variant="destructive" className="mb-3 text-sm">
          </Alert>
        )}

        <Button
          onClick={handleSaveAttendance}
          disabled={recordAttendanceMutation.isLoading}
          className="w-full sm:w-auto"
        >
          {recordAttendanceMutation.isLoading ? 'Saving...' : 'Save Attendance'}
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Manage Attendance: {effectiveTournamentName}</DialogTitle>
          <DialogDescription>
            Select a user and enter their final position. Attendance date is recorded automatically.
            {tournamentDetails?.start_datetime && tournamentDetails?.end_datetime && (
              <span className="block text-xs mt-1">
                Tournament: {formatDateUtil(tournamentDetails.start_datetime, 'PPp')} to {formatDateUtil(tournamentDetails.end_datetime, 'PPp')}.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetails ? (
          <div className="space-y-4 py-6">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            {renderUserList()}
            <Separator className="my-4" />
            {renderAttendanceForm()}
          </>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentAttendanceDialog;
