// src/components/admin/courts/CourtCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Court } from '@/backend/court_backend'; // Adjust path
import { Uuid } from '@/backend/common'; // Adjust path
import { Trash2, Disc3 } from 'lucide-react'; // Icons (Disc3 for court icon, or choose another)

interface CourtCardProps {
  court: Court;
  onDelete: (courtId: Uuid) => void;
  isDeleting: boolean; // Is this specific court being deleted?
}

const CourtCard: React.FC<CourtCardProps> = ({ court, onDelete, isDeleting }) => {
  const handleDeleteClick = () => {
    onDelete(court.id_court);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          {court.court_name}
        </CardTitle>
        <Disc3 className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-xs text-muted-foreground">ID: <span className="font-mono">{court.id_court}</span></p>
      </CardContent>
      <CardFooter className="border-t pt-3 dark:border-gray-700">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete Court'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the court
                "{court.court_name}". Any reservations linked to this court might also be affected (depending on backend logic).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Yes, delete it
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default CourtCard;
