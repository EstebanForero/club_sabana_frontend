import React, { useState, useMemo } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getEligibleTrainingsForUser,
  getUserTrainingRegistrations,
  listTrainings,
  registerUserForTraining,
  Training,
  TrainingRegistration,
  TrainingRegistrationPayload,
} from '@/backend/training_backend';
import { Uuid } from '@/backend/common';

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from 'lucide-react';
import { AuthManager } from '@/backend/auth';
import AvailableTrainingCard from '@/components/AvailableTrainingCard';
import RegisteredTrainingCard from '@/components/RegisteredTrainingCard';

export const Route = createFileRoute('/dashboard_user/training')({
  component: UserTrainingPageComponent,
  loader: async () => {
    const userId = AuthManager.getUserId();
    if (!userId) {
      console.warn("User not authenticated, redirecting to login from training loader.");
      throw redirect({
        to: '/auth/login',
        search: { redirect: Route.fullPath },
      });
    }
    return { userId };
  }
});

interface RegisteredTrainingDetail {
  training: Training;
  registration: TrainingRegistration;
}

function UserTrainingPageComponent() {
  const { userId } = Route.useLoaderData();
  const queryClient = useQueryClient();
  const [registeringTrainingId, setRegisteringTrainingId] = useState<Uuid | null>(null);

  const {
    data: eligibleTrainings,
    isLoading: isLoadingEligible,
    isError: isErrorEligible,
    error: errorEligible
  } = useQuery({
    queryKey: ['eligibleTrainings', userId],
    queryFn: () => getEligibleTrainingsForUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: userRegistrations,
    isLoading: isLoadingRegistrations,
    isError: isErrorRegistrations,
    error: errorRegistrations
  } = useQuery({
    queryKey: ['userTrainingRegistrations', userId],
    queryFn: () => getUserTrainingRegistrations(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: allTrainingsData,
    isLoading: isLoadingAllTrainings,
    isError: isErrorAllTrainings,
    error: errorAllTrainings
  } = useQuery({
    queryKey: ['allTrainings'],
    queryFn: listTrainings,
    staleTime: 10 * 60 * 1000,
  });

  const isLoading = isLoadingEligible || isLoadingRegistrations || isLoadingAllTrainings;
  const isError = isErrorEligible || isErrorRegistrations || isErrorAllTrainings;
  const error = errorEligible || errorRegistrations || errorAllTrainings;

  // --- useMemo for processing data (remains the same) ---
  const { availableTrainings, registeredTrainingDetails } = useMemo(() => {
    const validUserRegistrations = Array.isArray(userRegistrations) ? userRegistrations : [];
    const validEligibleTrainings = Array.isArray(eligibleTrainings) ? eligibleTrainings : [];

    if (!allTrainingsData || !validEligibleTrainings || !validUserRegistrations) { // Check all necessary data
      return { availableTrainings: [], registeredTrainingDetails: [] };
    }

    const trainingsMap = new Map<Uuid, Training>();
    allTrainingsData.forEach(t => trainingsMap.set(t.id_training, t));

    const registeredDetails: RegisteredTrainingDetail[] = [];
    const registeredIds = new Set<Uuid>();

    validUserRegistrations.forEach(reg => {
      const trainingDetails = trainingsMap.get(reg.id_training);
      if (trainingDetails) {
        registeredDetails.push({ training: trainingDetails, registration: reg });
        registeredIds.add(reg.id_training);
      } else {
        console.warn(`Training details not found for user registration ID: ${reg.id_training}`);
      }
    });

    const available = validEligibleTrainings.filter(t => !registeredIds.has(t.id_training));

    registeredDetails.sort((a, b) =>
      new Date(b.registration.registration_datetime).getTime() - new Date(a.registration.registration_datetime).getTime()
    );

    return { availableTrainings: available, registeredTrainingDetails: registeredDetails };
  }, [allTrainingsData, eligibleTrainings, userRegistrations]);
  // --- End useMemo ---


  // --- registerMutation ---
  const registerMutation = useMutation({
    // UPDATED mutationFn to match new backend signature
    mutationFn: (variables: { idTraining: Uuid; payload: TrainingRegistrationPayload }) =>
      registerUserForTraining(variables.idTraining, variables.payload),
    onMutate: (variables) => {
      // Use variables.idTraining because that's what's passed now
      setRegisteringTrainingId(variables.idTraining);
    },
    onSuccess: (createdRegistration) => { // Backend now returns the created registration
      toast.success(`Successfully registered! Registered on: ${createdRegistration.registration_datetime}`);
      queryClient.invalidateQueries({ queryKey: ['eligibleTrainings', userId] });
      queryClient.invalidateQueries({ queryKey: ['userTrainingRegistrations', userId] });
    },
    onError: (error: Error, variables) => {
      console.error("Training Registration Error:", error);
      toast.error(`Registration failed: ${error.message || 'Please check requirements or contact support.'}`);
    },
    onSettled: () => {
      setRegisteringTrainingId(null);
    }
  });

  // UPDATED handleRegister to accept trainingId and construct payload
  const handleRegister = (trainingId: Uuid) => { // Now only needs trainingId
    if (!userId) {
      toast.error("User not identified. Cannot register.");
      return;
    }
    setRegisteringTrainingId(trainingId);
    const payload: TrainingRegistrationPayload = { id_user: userId };
    registerMutation.mutate({ idTraining: trainingId, payload }); // Pass correct variables
  };
  // --- End registerMutation and handleRegister ---


  if (isLoading) {
    return <LoadingSkeletons />;
  }

  if (isError) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Available Trainings</h1>
        {availableTrainings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTrainings.map((training) => (
              <AvailableTrainingCard
                key={training.id_training}
                training={training}
                userId={userId}
                onRegister={handleRegister}
                isRegistering={registeringTrainingId === training.id_training}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No new training sessions available for registration right now.
          </p>
        )}
      </div>

      <Separator />

      <div>
        <h1 className="text-2xl font-bold mb-4">My Training Registrations</h1>
        {registeredTrainingDetails.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredTrainingDetails.map(({ training, registration }) => (
              <RegisteredTrainingCard
                key={registration.id_training + '-' + registration.id_user} // Ensure a unique key
                training={training}
                registration={registration}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            You haven't registered for any training sessions yet.
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
          <div key={`avail-tr-skel-${i}`} className="space-y-3 p-4 border rounded-lg dark:border-gray-700">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex justify-end pt-2">
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>

    <Separator />

    {/* Skeletons for Registered Section */}
    <div>
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1].map((i) => (
          <div key={`reg-tr-skel-${i}`} className="space-y-3 p-4 border rounded-lg dark:border-gray-700">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-1/3" />
            </div>
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

const ErrorDisplay: React.FC<{ error: Error | null | unknown }> = ({ error }) => (
  <div className="container mx-auto p-4">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error Loading Training Data</AlertTitle>
      <AlertDescription>
        There was a problem fetching training information. Please try again later.
        {error instanceof Error && error.message && <p className="mt-2 text-xs">Details: {error.message}</p>}
      </AlertDescription>
    </Alert>
  </div>
);
