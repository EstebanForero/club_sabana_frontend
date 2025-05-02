// src/components/tournaments/TournamentAttendanceDialog.tsx
import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  // DialogTrigger, // Trigger is handled externally
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area"; // To handle potentially long lists

import {
  getTournamentRegistrations,
  getTournamentAttendances,
  recordAttendance,
  getCurrentDateTimeString,
  TournamentRegistration,
  TournamentAttendance,
  Tournament, // Import if displaying tournament details
  getTournament // Import if fetching details here
} from '@/backend/tournament_backend'; // Adjust paths
import { Uuid } from '@/backend/common';
import AttendanceUserRow from './AttendanceUserRow';
import { AlertTriangle, Info } from 'lucide-react';

interface TournamentAttendanceDialogProps {
  tournamentId: Uuid | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // Optional: Pass tournament basic details to avoid refetching if already available
  tournamentName?: string;
}

// Combined data structure for easier rendering
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
  // State to track which user's attendance marking is in progress
  const [attendingUserId, setAttendingUserId] = useState<Uuid | null>(null);
  // State to track the last error specifically for a user row
  const [rowError, setRowError] = useState<{ userId: Uuid, error: Error } | null>(null);


  // --- Data Fetching ---

  // Optional: Fetch full tournament details if needed and not passed
  const { data: tournamentDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['tournamentDetails', tournamentId],
    queryFn: () => getTournament(tournamentId!),
    enabled: !!tournamentId && isOpen && !tournamentName, // Fetch only if needed
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: registrations,
    isLoading: isLoadingRegs,
    isError: isErrorRegs,
    error: errorRegs,
  } = useQuery({
    queryKey: ['tournamentRegistrations', tournamentId],
    queryFn: () => getTournamentRegistrations(tournamentId!),
    enabled: !!tournamentId && isOpen,
    staleTime: 1 * 60 * 1000, // Keep relatively fresh
  });

  const {
    data: attendances,
    isLoading: isLoadingAtt,
    isError: isErrorAtt,
    error: errorAtt,
  } = useQuery({
    queryKey: ['tournamentAttendances', tournamentId],
    queryFn: () => getTournamentAttendances(tournamentId!),
    enabled: !!tournamentId && isOpen,
    staleTime: 1 * 60 * 1000, // Keep relatively fresh
  });

  // --- Combined Loading & Error States ---
  const isLoading = isLoadingRegs || isLoadingAtt || (isLoadingDetails && !tournamentName);
  const isError = isErrorRegs || isErrorAtt;
  const queryError = errorRegs || errorAtt; // Show first query error


  // --- Memoize Combined User Data ---
  const combinedUsers = useMemo<CombinedUserData[]>(() => {
    if (!registrations) return [];

    const attendanceMap = new Map<Uuid, TournamentAttendance>();
    attendances?.forEach(att => attendanceMap.set(att.id_user, att));

    return registrations.map(reg => ({
      registration: reg,
      attendance: attendanceMap.get(reg.id_user),
    })).sort((a, b) => { // Sort by attended status (not attended first), then registration date
      const attendedA = !!a.attendance;
      const attendedB = !!b.attendance;
      if (attendedA !== attendedB) return attendedA ? 1 : -1; // Not attended first
      // If both attended or both not attended, sort by registration time (optional)
      return new Date(a.registration.registration_datetime).getTime() - new Date(b.registration.registration_datetime).getTime();
    });

  }, [registrations, attendances]);


  // --- Record Attendance Mutation ---
  const recordAttendanceMutation = useMutation({
    mutationFn: recordAttendance,
    onSuccess: (message, variables) => {
      toast.success(message || `Attendance recorded for user ${variables.id_user}`);
      setRowError(null); // Clear specific row error on success
      // Invalidate both registrations and attendances to refresh the list
      queryClient.invalidateQueries({ queryKey: ['tournamentRegistrations', tournamentId] });
      queryClient.invalidateQueries({ queryKey: ['tournamentAttendances', tournamentId] });
    },
    onError: (error: Error, variables) => {
      console.error("Error recording attendance:", error);
      toast.error(`Failed to record attendance: ${error.message || 'Unknown error'}`);
      // Store error associated with the user ID for display on the row
      setRowError({ userId: variables.id_user, error });
    },
    onSettled: () => {
      setAttendingUserId(null); // Clear loading state regardless of outcome
    }
  });

  // --- Handler for Marking Attendance ---
  const handleMarkAttended = (userId: Uuid) => {
    if (!tournamentId) return;
    setRowError(null); // Clear previous errors for this row
    setAttendingUserId(userId); // Set loading state for this specific user

    // *** IMPORTANT: Handling Position ***
    // The backend `recordAttendance` requires a `position`.
    // We don't have an input for it here during simple check-in.
    // Assumption: We send position 0 initially, and it can be updated later.
    // Discuss with backend team if this assumption is correct.
    const attendanceData: TournamentAttendance = {
      id_tournament: tournamentId,
      id_user: userId,
      attendance_datetime: getCurrentDateTimeString(),
      position: 0, // Defaulting position to 0
    };
    recordAttendanceMutation.mutate(attendanceData);
  };


  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3 py-4 max-h-[60vh]">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 border-b">
              <div className='flex items-center space-x-3'>
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className='space-y-1.5'>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      );
    }

    if (isError || !registrations) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>
            Could not load registration or attendance data. {queryError?.message}
          </AlertDescription>
        </Alert>
      );
    }

    if (combinedUsers.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-8">
          No users registered for this tournament yet.
        </p>
      );
    }

    return (
      <ScrollArea className="max-h-[60vh] border-t mt-4"> {/* Use ScrollArea */}
        <div className="divide-y dark:divide-gray-700">
          {combinedUsers.map(({ registration, attendance }) => (
            <AttendanceUserRow
              key={registration.id_user} // Assuming user+tournament is unique key
              registration={registration}
              attendance={attendance}
              onMarkAttended={handleMarkAttended}
              isAttending={attendingUserId === registration.id_user}
              mutationError={
                rowError?.userId === registration.id_user ? rowError.error : null
              }
            />
          ))}
        </div>
      </ScrollArea>
    );
  };

  const effectiveTournamentName = tournamentName || tournamentDetails?.name || 'Tournament';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]"> {/* Wider dialog */}
        <DialogHeader>
          <DialogTitle>Manage Attendance: {effectiveTournamentName}</DialogTitle>
          <DialogDescription>
            View registered users and mark their attendance.
            {/* TODO: Display tournament dates if available */}
          </DialogDescription>
        </DialogHeader>

        {/* Render loading, error, or user list */}
        {renderContent()}

        <DialogFooter className="mt-4">
          <p className="text-xs text-muted-foreground mr-auto flex items-center">
            <Info className="h-3 w-3 mr-1" /> Position defaults to 0 upon marking attendance.
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentAttendanceDialog;
