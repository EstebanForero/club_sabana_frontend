import { listTrainings } from '@/backend/training_backend';
import TrainingComponent from '@/components/TrainingComponent';
import TrainingCreation from '@/components/TrainingCreation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react';

export const Route = createFileRoute('/dashboard_admin/training_management')({
  component: AdminTrainingPage,
})

function AdminTrainingPage() {
  const { data: trainings, isLoading, isError, error } = useQuery({
    queryKey: ['trainings'], // Use a consistent key for the list
    queryFn: listTrainings,
    staleTime: 2 * 60 * 1000,
  });

  // Render Loading
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Manage Trainings</h1><Skeleton className="h-10 w-40" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-52 w-full" />)}</div>
      </div>
    );
  }

  // Render Error
  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Manage Trainings</h1>
        <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>Failed to load trainings</AlertDescription></Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Trainings</h1>
        <TrainingCreation /> {/* Creation button/dialog */}
      </div>

      {trainings && trainings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Optional: Sort trainings if needed */}
          {trainings.map((training) => (
            <TrainingComponent
              key={training.id_training}
              training={training}
              enableAdminControls={true} // <-- Enable admin buttons
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8">No trainings found. Create one!</p>
      )}
    </div>
  );
}
