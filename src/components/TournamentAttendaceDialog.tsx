// src/components/tournaments/TournamentAttendanceDialog.tsx
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parse, isWithinInterval, isValid, format as formatDateFn, formatDate } from 'date-fns'; // Import date-fns helpers

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
  getTournamentRegistrations, recordAttendance,
  TournamentRegistration, TournamentAttendance,
  Tournament, getTournament,
  getTournamentAttendance
} from '@/backend/tournament_backend'; // Adjust paths
import { Uuid } from '@/backend/common';
import AttendanceUserRow from './AttendanceUserRow';
import { AlertTriangle, Info, CalendarIcon, ListOrdered, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator'; // For visual separation

interface TournamentAttendanceDialogProps {
  tournamentId: Uuid | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CombinedUserData {
  registration: TournamentRegistration;
  attendance?: TournamentAttendance;
}

const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const TournamentAttendanceDialog: React.FC<TournamentAttendanceDialogProps> = ({
  tournamentId,
  isOpen,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<Uuid | null>(null);
  const [attendanceDate, setAttendanceDate] = useState('');
  const [attendancePosition, setAttendancePosition] = useState('');
  const [formError, setFormError] = useState<string | null>(null); // For form-specific errors

  const { data: tournamentDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['tournamentDetails', tournamentId],
    queryFn: () => getTournament(tournamentId!),
    enabled: !!tournamentId && isOpen, // Always fetch details when dialog opens
    staleTime: 5 * 60 * 1000,
  });

  // Registrations Query (unchanged)
  const { data: registrations, isLoading: isLoadingRegs } = useQuery({
    queryKey: ['tournamentRegistrations', tournamentId],
    queryFn: () => getTournamentRegistrations(tournamentId!),
    enabled: !!tournamentId && isOpen, staleTime: 1 * 60 * 1000,
  });

  const { data: attendances, isLoading: isLoadingAtt } = useQuery({
    queryKey: ['tournamentAttendances', tournamentId],
    queryFn: () => getTournamentAttendance(tournamentId!),
    enabled: !!tournamentId && isOpen, staleTime: 1 * 60 * 1000,
  });

  // --- Derived State ---
  const isLoading = isLoadingDetails || isLoadingRegs || isLoadingAtt;
  const tournamentStartDate = tournamentDetails?.start_datetime;
  const tournamentEndDate = tournamentDetails?.end_datetime;
  const effectiveTournamentName = tournamentDetails?.name || 'Tournament';

  // --- Memoized User List (unchanged sorting logic) ---
  const combinedUsers = useMemo<CombinedUserData[]>(() => {
    // ... (same logic as before) ...
    if (!registrations) return [];
    const attendanceMap = new Map<Uuid, TournamentAttendance>();
    attendances?.forEach(att => attendanceMap.set(att.id_user, att));
    return registrations.map(reg => ({
      registration: reg, attendance: attendanceMap.get(reg.id_user),
    })).sort((a, b) => {
      const attendedA = !!a.attendance; const attendedB = !!b.attendance;
      if (attendedA !== attendedB) return attendedA ? 1 : -1;
      return new Date(a.registration.registration_datetime).getTime() - new Date(b.registration.registration_datetime).getTime();
    });
  }, [registrations, attendances]);

  // --- Reset Form on Selection Change or Dialog Close ---
  useEffect(() => {
    if (!isOpen) {
      setSelectedUserId(null); // Reset selection when dialog closes
    }
    // Reset form fields when user selection changes
    setAttendanceDate('');
    setAttendancePosition('');
    setFormError(null);
  }, [selectedUserId, isOpen]);

  // --- Record Attendance Mutation ---
  const recordAttendanceMutation = useMutation({
    mutationFn: recordAttendance,
    onSuccess: (message, variables) => {
      toast.success(message || `Attendance recorded for user ${variables.id_user}`);
      queryClient.invalidateQueries({ queryKey: ['tournamentAttendances', tournamentId] });
      setSelectedUserId(null); // Clear selection and hide form on success
    },
    onError: (error: Error) => {
      console.error("Error recording attendance:", error);
      // Display specific backend error message in the form section
      setFormError(error.message || 'An unknown error occurred.');
      toast.error(`Failed to record attendance: ${error.message || 'Check form details.'}`);
    },
    // onSettled: Not needed here as form hides on success/cancel
  });


  // --- Validation and Submit Handler ---
  const handleSaveAttendance = useCallback(() => {
    setFormError(null); // Clear previous errors
    if (!selectedUserId || !tournamentId || !tournamentStartDate || !tournamentEndDate) {
      setFormError("Cannot save: Missing user selection or tournament details.");
      return;
    }

    // 1. Validate Position Input
    const pos = parseInt(attendancePosition, 10);
    if (isNaN(pos) || pos <= 0 || !Number.isInteger(pos)) {
      setFormError("Position must be a positive whole number.");
      return;
    }

    // 2. Validate Position Uniqueness
    const isPositionTaken = attendances?.some(att => att.position === pos && att.position > 0); // Check only positive positions
    if (isPositionTaken) {
      setFormError(`Position ${pos} is already assigned.`);
      return;
    }

    // 3. Validate Date Format
    if (!DATETIME_REGEX.test(attendanceDate)) {
      setFormError(`Date must be in YYYY-MM-DD HH:MM:SS format.`);
      return;
    }

    // 4. Validate Date Parsability and Range
    let parsedAttendanceDate: Date;
    try {
      // Parse using the specific format string
      parsedAttendanceDate = parse(attendanceDate, DATETIME_FORMAT, new Date());
      if (!isValid(parsedAttendanceDate)) {
        throw new Error("Invalid date value.");
      }
    } catch (e) {
      setFormError("Invalid date value. Could not parse.");
      return;
    }


    const parsedStartDate = new Date(tournamentStartDate.replace(' ', 'T'));
    const parsedEndDate = new Date(tournamentEndDate.replace(' ', 'T'));

    if (!isValid(parsedStartDate) || !isValid(parsedEndDate)) {
      setFormError("Invalid tournament start/end dates.");
      return;
    }

    if (!isWithinInterval(parsedAttendanceDate, { start: parsedStartDate, end: parsedEndDate })) {
      setFormError(`Attendance date must be between ${formatDateFn(parsedStartDate, 'PPp')} and ${formatDateFn(parsedEndDate, 'PPp')}.`);
      return;
    }

    // --- All Validations Passed ---
    const attendanceData: TournamentAttendance = {
      id_tournament: tournamentId,
      id_user: selectedUserId,
      attendance_datetime: attendanceDate, // Use the validated string
      position: pos,
    };
    recordAttendanceMutation.mutate(attendanceData);

  }, [
    selectedUserId, tournamentId, tournamentStartDate, tournamentEndDate,
    attendanceDate, attendancePosition, attendances, recordAttendanceMutation
  ]);

  const handleCancelEdit = () => {
    setSelectedUserId(null); // Simply clear selection
  };


  // --- Render Logic ---
  const renderUserList = () => {
    if (isLoadingRegs || isLoadingAtt) { // Loading specific parts
      return (
        <div className="space-y-3 py-4 min-h-[200px]"> {/* Ensure min height */}
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      );
    }
    if (!registrations) {
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
      <ScrollArea className="max-h-[45vh] border rounded-md"> {/* Adjust max height */}
        <div className="divide-y dark:divide-gray-700">
          {combinedUsers.map(({ registration, attendance }) => (
            <AttendanceUserRow
              key={registration.id_user}
              registration={registration}
              attendance={attendance}
              onSelectUser={setSelectedUserId}
              isSelected={selectedUserId === registration.id_user}
              isAnyUserSelected={!!selectedUserId} // Pass if any user is selected
            />
          ))}
        </div>
      </ScrollArea>
    );
  };

  const renderAttendanceForm = () => {
    if (!selectedUserId) return null; // Don't render form if no user is selected

    const selectedUserName = selectedUserId; // Replace with actual name if fetched

    return (
      <div className="mt-4 p-4 border rounded-lg bg-muted/40">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-md">
            Record Attendance for User: {selectedUserName}
          </h4>
          <Button variant="ghost" size="icon" onClick={handleCancelEdit} aria-label="Cancel attendance entry">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          {/* Date Input */}
          <div className="space-y-1.5">
            <Label htmlFor="attendance-date">Attendance Date & Time</Label>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input
                id="attendance-date"
                type="text" // Keep as text for specific format
                placeholder="YYYY-MM-DD HH:MM:SS"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                disabled={recordAttendanceMutation.isLoading}
                className={formError && (!DATETIME_REGEX.test(attendanceDate) || formError.includes("date")) ? "border-destructive" : ""}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Must be between tournament start and end times.
            </p>
          </div>

          {/* Position Input */}
          <div className="space-y-1.5">
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
        </div>

        {/* Form Error Display */}
        {formError && (
          <Alert variant="destructive" className="mb-3 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Validation Error</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        {/* Save Button */}
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
      <DialogContent className="sm:max-w-[700px]"> {/* Wider dialog */}
        <DialogHeader>
          <DialogTitle>Manage Attendance: {effectiveTournamentName}</DialogTitle>
          <DialogDescription>
            Select a user without attendance and enter their attendance date and final position.
            {tournamentStartDate && tournamentEndDate && (
              <span className="block text-xs mt-1">
                Tournament runs from {formatDate(tournamentStartDate, 'PPp')} to {formatDate(tournamentEndDate, 'PPp')}.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading && !tournamentDetails ? ( // Show main skeleton only if tournament details are loading
          <div className="space-y-4 py-6"> <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" /></div>
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
