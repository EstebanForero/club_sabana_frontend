import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { listTrainings } from '@/backend/training_backend'; // Adjust path
import { Uuid } from '@/backend/common'; // Adjust path
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import TrainerTrainingCard from '@/components/TrainerTrainingCard';
import TrainingManagementDialog from '@/components/TrainingManagementDialog';


export const Route = createFileRoute('/dashboard_trainer/trainings')({
  component: TrainerTrainingPageComponent,
})

function TrainerTrainingPageComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState<Uuid | null>(null);
  const [selectedTrainingName, setSelectedTrainingName] = useState<string | undefined>(undefined);

  const { data: trainings, isLoading, isError, error } = useQuery({
    queryKey: ['allTrainingsTrainer'],
    queryFn: listTrainings,
    staleTime: 5 * 60 * 1000,
  });

  const handleManageClick = (trainingId: Uuid, trainingName?: string) => {
    setSelectedTrainingId(trainingId);
    setSelectedTrainingName(trainingName);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedTrainingId(null);
      setSelectedTrainingName(undefined);
    }
  };

  const renderTrainingList = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={`trainer-tr-skel-${i}`} className="space-y-3 p-4 border rounded-lg dark:border-gray-700">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex justify-end pt-2">
                <Skeleton className="h-9 w-44" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Trainings</AlertTitle>
          <AlertDescription>
            Could not fetch the list of trainings. {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      );
    }

    if (!trainings || trainings.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-8">
          No training sessions found.
        </p>
      );
    }

    const sortedTrainings = [...trainings].sort((a, b) =>
      new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime()
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTrainings.map((training) => (
          <TrainerTrainingCard
            key={training.id_training}
            training={training}
            onManageClick={handleManageClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Training Registrations & Attendance</h1>

      {renderTrainingList()}

      <TrainingManagementDialog
        trainingId={selectedTrainingId}
        trainingName={selectedTrainingName}
        isOpen={isDialogOpen}
        onOpenChange={handleDialogClose}
      />
    </div>
  );
}
