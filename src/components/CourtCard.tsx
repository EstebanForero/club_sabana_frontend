import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Court } from '@/backend/court_backend';
import { Uuid } from '@/backend/common';
import { Trash2, CalendarClock, LayoutGrid } from 'lucide-react';

interface CourtCardProps {
  court: Court;
  onDelete: (courtId: Uuid) => void;
  isDeleting: boolean;
  onViewReservations: (court: Court) => void;
}

const CourtCard: React.FC<CourtCardProps> = ({ court, onDelete, isDeleting, onViewReservations }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
      <div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <LayoutGrid className="mr-2 h-5 w-5 text-primary" />
            {court.court_name}
          </CardTitle>
          <CardDescription className="text-xs font-mono pt-1">ID: {court.id_court}</CardDescription>
        </CardHeader>
        {/* <CardContent>
            Other details here
                </CardContent> */}
      </div>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewReservations(court)}
          className="w-full sm:w-auto"
        >
          <CalendarClock className="mr-2 h-4 w-4" /> View Reservations
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the court
                "{court.court_name}". Associated reservations might also be affected or orphaned.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(court.id_court)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
