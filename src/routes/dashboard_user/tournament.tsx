import React, { useMemo, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router'; // Added redirect
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  listTournaments,
  Tournament,
  TournamentRegistration, // This is the returned type from registration
  TournamentAttendance,
  getEligibleTournamentsForUser,      // UPDATED function name
  getUserTournamentRegistrations,
  getUserTournamentAttendanceList,     // CORRECTED function name for user's attendance
  registerUserForTournament,          // UPDATED function name
  TournamentRegistrationPayload,      // UPDATED type for payload
} from '@/backend/tournament_backend'; // Ensure path is correct
import { Uuid } from '@/backend/common';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import UserTournamentCard from '@/components/UserTournamentCard';
import RegisteredTournamentCard from '@/components/RegisteredTournamentCard';
import AttendedTournamentCard from '@/components/AttendedTournamentCard';
import { AuthManager } from '@/backend/auth';

export const Route = createFileRoute('/dashboard_user/tournament')({
  component: TournamentPageComponent,
  loader: async () => {
    const userId = AuthManager.getUserId();
    if (!userId) {
      console.warn("User not authenticated, redirecting to login from tournament loader.");
      throw redirect({
        to: '/auth/login',
        search: { redirect: Route.fullPath },
      });
    }
    return { userId };
  }
});

interface CombinedRegistration {
  tournament: Tournament;
  registration_datetime: string;
}

interface CombinedAttendance {
  tournament: Tournament;
  attendance: TournamentAttendance;
}

function TournamentPageComponent() {
  const { userId } = Route.useLoaderData();

  const queryClient = useQueryClient();
  const [registeringTournamentId, setRegisteringTournamentId] = useState<Uuid | null>(null);

  const {
    data: eligibleTournaments,
    isLoading: isLoadingEligible,
    isError: isErrorEligible,
    error: errorEligible
  } = useQuery({
    queryKey: ['eligibleTournaments', userId],
    queryFn: () => getEligibleTournamentsForUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: registrationsData,
    isLoading: isLoadingRegistrations,
    isError: isErrorRegistrations,
    error: errorRegistrations
  } = useQuery({
    queryKey: ['userTournamentRegistrations', userId],
    queryFn: () => getUserTournamentRegistrations(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: allTournamentsData,
    isLoading: isLoadingAllTournaments,
    isError: isErrorAllTournaments,
    error: errorAllTournaments
  } = useQuery({
    queryKey: ['allTournaments'],
    queryFn: listTournaments,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: attendanceData,
    isLoading: isLoadingAttendance,
    isError: isErrorAttendance,
    error: errorAttendance,
  } = useQuery({
    queryKey: ['userTournamentAttendance', userId],
    queryFn: () => getUserTournamentAttendanceList(userId),
    enabled: !!userId,
    staleTime: 15 * 60 * 1000,
  });


  const isLoading = isLoadingEligible || isLoadingRegistrations || isLoadingAllTournaments || isLoadingAttendance;
  const isError = isErrorEligible || isErrorRegistrations || isErrorAllTournaments || isErrorAttendance;
  const error = errorEligible || errorRegistrations || errorAllTournaments || errorAttendance;


  const registeredTournamentsList = useMemo<CombinedRegistration[]>(() => {
    const validRegistrations = Array.isArray(registrationsData) ? registrationsData : [];
    if (validRegistrations.length === 0 || !allTournamentsData) return [];

    const tournamentsMap = new Map<Uuid, Tournament>();
    allTournamentsData.forEach(t => tournamentsMap.set(t.id_tournament, t));
    const combined: CombinedRegistration[] = [];

    validRegistrations.forEach(reg => {
      const tournamentDetails = tournamentsMap.get(reg.id_tournament);
      if (tournamentDetails) {
        combined.push({ tournament: tournamentDetails, registration_datetime: reg.registration_datetime });
      } else {
        console.warn(`Tournament details not found for registered ID: ${reg.id_tournament}`);
      }
    });
    return combined;
  }, [registrationsData, allTournamentsData]);

  const attendedTournamentsList = useMemo<CombinedAttendance[]>(() => {
    const validAttendance = Array.isArray(attendanceData) ? attendanceData : [];
    if (validAttendance.length === 0 || !allTournamentsData) {
      return [];
    }

    const tournamentsMap = new Map<Uuid, Tournament>();
    allTournamentsData.forEach(t => tournamentsMap.set(t.id_tournament, t));

    const combined: CombinedAttendance[] = [];
    validAttendance.forEach(att => {
      const tournamentDetails = tournamentsMap.get(att.id_tournament);
      if (tournamentDetails) {
        combined.push({
          tournament: tournamentDetails,
          attendance: att,
        });
      } else {
        console.warn(`Tournament details not found for attended ID: ${att.id_tournament}`);
      }
    });

    combined.sort((a, b) =>
      new Date(b.attendance.attendance_datetime).getTime() - new Date(a.attendance.attendance_datetime).getTime()
    );
    return combined;
  }, [attendanceData, allTournamentsData]);


  const registerMutation = useMutation({
    mutationFn: (variables: { tournamentId: Uuid; payload: TournamentRegistrationPayload }) =>
      registerUserForTournament(variables.tournamentId, variables.payload),
    onSuccess: (createdRegistration) => {
      toast.success(`Successfully registered for tournament! Registered on: ${createdRegistration.registration_datetime}`);
      queryClient.invalidateQueries({ queryKey: ['eligibleTournaments', userId] });
      queryClient.invalidateQueries({ queryKey: ['userTournamentRegistrations', userId] });
    },
    onError: (error: Error) => {
      console.error("Registration Error:", error);
      toast.error(`Registration failed: ${error.message || 'Unknown error'}`);
    },
    onSettled: () => {
      setRegisteringTournamentId(null);
    }
  });

  const handleRegister = (tournamentId: Uuid) => {
    if (!userId) {
      toast.error("User not identified. Cannot register.");
      return;
    }
    setRegisteringTournamentId(tournamentId);
    const payload: TournamentRegistrationPayload = { id_user: userId };
    registerMutation.mutate({ tournamentId, payload });
  };


  if (isLoading) {
    return <LoadingSkeletons />;
  }

  if (isError) {
    return <ErrorDisplay error={error instanceof Error ? error : new Error(String(error) || "An unknown error occurred")} />;
  }

  const registeredIds = new Set(registeredTournamentsList.map(r => r.tournament.id_tournament));
  const trulyEligibleTournaments = eligibleTournaments?.filter(t => !registeredIds.has(t.id_tournament)) ?? [];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Available Tournaments</h1>
        {trulyEligibleTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trulyEligibleTournaments.map((tournament) => (
              <UserTournamentCard
                key={tournament.id_tournament}
                tournament={tournament}
                userId={userId}
                onRegister={() => handleRegister(tournament.id_tournament)}
                isRegistering={registeringTournamentId === tournament.id_tournament}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No new tournaments available for registration right now.
          </p>
        )}
      </div>

      <Separator />

      <div>
        <h1 className="text-2xl font-bold mb-4">My Registrations</h1>
        {registeredTournamentsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredTournamentsList.map(({ tournament, registration_datetime }) => (
              <RegisteredTournamentCard
                key={tournament.id_tournament + '-reg'}
                tournament={tournament}
                registrationDate={registration_datetime}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            You haven't registered for any tournaments yet.
          </p>
        )}
      </div>

      <Separator />

      <div>
        <h1 className="text-2xl font-bold mb-4">Attended Tournaments</h1>
        {attendedTournamentsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendedTournamentsList.map(({ tournament, attendance }) => (
              <AttendedTournamentCard
                key={tournament.id_tournament + '-att'}
                tournament={tournament}
                attendance={attendance}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            You haven't attended any recorded tournaments yet.
          </p>
        )}
      </div>
    </div>
  );
}

const LoadingSkeletons: React.FC = () => (
  <div className="container mx-auto p-4 space-y-8">
    <div>
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2].map((i) => (
          <div key={`eligible-skel-${i}`} className="space-y-3 p-4 border rounded-lg dark:border-gray-700">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-2"> <Skeleton className="h-4 w-full" /> <Skeleton className="h-4 w-5/6" /> </div>
            <div className="flex justify-end pt-2"> <Skeleton className="h-9 w-24" /> </div>
          </div>
        ))}
      </div>
    </div>
    <Separator />

    <div>
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1].map((i) => (
          <div key={`registered-skel-${i}`} className="space-y-3 p-4 border rounded-lg dark:border-gray-700">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-2"> <Skeleton className="h-4 w-full" /> <Skeleton className="h-4 w-5/6" /> </div>
            <div className="flex justify-end pt-2"> <Skeleton className="h-5 w-40" /> </div>
          </div>
        ))}
      </div>
    </div>
    <Separator />

    <div>
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1].map((i) => (
          <div key={`attended-skel-${i}`} className="space-y-3 p-4 border rounded-lg dark:border-gray-700">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex flex-col space-y-2 pt-3 border-t mt-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ error: Error | null }> = ({ error }) => (
  <div className="container mx-auto p-4">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error Loading Tournament Data</AlertTitle>
      <AlertDescription>
        There was a problem fetching some tournament information. Please try again later.
        {error?.message && <p className="mt-2 text-xs">Details: {error.message}</p>}
      </AlertDescription>
    </Alert>
  </div>
);
