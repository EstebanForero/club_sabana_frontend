import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Training, deleteTraining } from '@/backend/training_backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Users, DollarSign, CalendarDays } from 'lucide-react';
import { Uuid } from '@/backend/common';
import TrainingEdit from './TrainingEdit';
import AdminTrainingRegistrationsDialog from './AdminTrainingRegistrationsDialog';
import EventCourtBadge from './EventCourtBadge';
import TrainerBadgeComponent from './TrainerBadgeComponent';

type Props = {
  training: Training;
  enableAdminControls?: boolean;
};

// Helper
const formatDate = (dateString: string | null | undefined, formatString = 'PPp'): string => {
  if (!dateString) return 'N/A'; try { const date = new Date(dateString.replace(' ', 'T')); return format(date, formatString); } catch { return dateString; }
};


const TrainingComponent: React.FC<Props> = ({ training, enableAdminControls = false }) => {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRegDialogOpen, setIsRegDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteTraining,
    onSuccess: () => {
      toast.success('Training deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete training: ${error.message || 'Unknown error'}`);
    },
  });

  const handleDelete = () => deleteMutation.mutate(training.id_training);
  const handleEdit = () => setIsEditDialogOpen(true);
  const handleViewRegistrations = () => setIsRegDialogOpen(true);

  return (
    <>
      <Card className="w-full max-w-md mb-4 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{training.name}</CardTitle>
          <CardDescription>Category ID: {training.id_category}</CardDescription>
          <EventCourtBadge eventId={training.id_training} eventType="training" className="mt-1 text-xs" />
        </CardHeader>
        <CardContent className="text-sm text-gray-700 dark:text-gray-400 space-y-1.5">
          <p className='flex items-center'><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" /> <span className="font-medium">Starts:</span> {formatDate(training.start_datetime)}</p>
          <p className='flex items-center'><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" /> <span className="font-medium">Ends:</span> {formatDate(training.end_datetime)}</p>
          <p className='flex items-center'><DollarSign className="mr-2 h-4 w-4 text-muted-foreground" /> <span className="font-medium">Min. Payment:</span> ${(training.minimum_payment ?? 0.0).toFixed(2)}</p>
          <TrainerBadgeComponent trainer_id={training.trainer_id} />
        </CardContent>
        {enableAdminControls && (
          <CardFooter className="flex justify-end gap-2 flex-wrap">
            {/* View Registrations Button */}
            <Button variant="outline" size="sm" onClick={handleViewRegistrations}>
              <Users className="mr-2 h-4 w-4" /> Registrations
            </Button>
            {/* Edit Button */}
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={deleteMutation.isLoading}>
                  <Trash2 className="mr-2 h-4 w-4" /> {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Delete Training?</AlertDialogTitle><AlertDialogDescription>Permanently delete "{training.name}"?</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Yes, delete</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        )}
      </Card>

      {/* Edit Dialog */}
      <TrainingEdit
        trainingId={training.id_training}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {/* Registrations Dialog */}
      <AdminTrainingRegistrationsDialog
        trainingId={training.id_training}
        isOpen={isRegDialogOpen}
        onOpenChange={setIsRegDialogOpen}
      />
    </>
  );
};

export default TrainingComponent;
