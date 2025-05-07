// src/routes/dashboard_admin/courts_management.tsx
import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { listCourts, createCourt, deleteCourt, Court } from '@/backend/court_backend'; // Adjust path
import { Uuid } from '@/backend/common'; // Adjust path
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, PlusCircle, LayoutGrid } from 'lucide-react'; // Icons
import CourtCreationForm, { CourtCreationFormData } from '@/components/CourtCreationForm';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import CourtCard from '@/components/CourtCard';

// --- TanStack Router Route Definition ---
export const Route = createFileRoute('/dashboard_admin/courts_management')({
  component: AdminCourtsManagementPage,
  // Optional: Add admin role check loader if not handled by a parent layout
});

// --- Main Page Component ---
function AdminCourtsManagementPage() {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  // State to track which court is currently being deleted for UI feedback
  const [deletingCourtId, setDeletingCourtId] = useState<Uuid | null>(null);

  // Fetch all courts
  const { data: courts, isLoading, isError, error } = useQuery({
    queryKey: ['allCourts'],
    queryFn: listCourts,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Mutation for creating a court
  const createCourtMutation = useMutation({
    mutationFn: createCourt,
    onSuccess: (newCourt) => {
      toast.success(`Court "${newCourt.court_name}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: ['allCourts'] });
      setIsCreateDialogOpen(false); // Close dialog on success
    },
    onError: (error: Error) => {
      console.error("Error creating court:", error);
      toast.error(`Failed to create court: ${error.message || 'Unknown error'}`);
    },
  });

  // Mutation for deleting a court
  const deleteCourtMutation = useMutation({
    mutationFn: deleteCourt, // deleteCourt takes courtId
    onMutate: (courtIdToDelete) => {
      setDeletingCourtId(courtIdToDelete); // Set loading state for the specific card
    },
    onSuccess: (response, courtIdDeleted) => { // response from deleteCourt is void (or string from fetchJson)
      // Find the court name from the cache for a better toast message if possible
      const cachedCourts = queryClient.getQueryData<Court[]>(['allCourts']);
      const deletedCourt = cachedCourts?.find(c => c.id_court === courtIdDeleted);
      const courtName = deletedCourt ? `"${deletedCourt.court_name}" ` : '';

      toast.success(typeof response === 'string' && response ? response : `Court ${courtName}deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ['allCourts'] });
    },
    onError: (error: Error, courtIdAttempted) => {
      console.error("Error deleting court:", error);
      toast.error(`Failed to delete court: ${error.message || 'Unknown error'}`);
    },
    onSettled: () => {
      setDeletingCourtId(null); // Clear loading state
    }
  });

  const handleCreateFormSubmit = (data: CourtCreationFormData) => {
    createCourtMutation.mutate(data);
  };

  const handleDeleteCourt = (courtId: Uuid) => {
    deleteCourtMutation.mutate(courtId);
  };

  // --- Render Logic ---
  const renderCourtList = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-md">
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-1/2" /></CardContent>
              <CardFooter><Skeleton className="h-9 w-full" /></CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Courts</AlertTitle>
          <AlertDescription>
            Could not fetch the court list. {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      );
    }

    if (!courts || courts.length === 0) {
      return (
        <div className="text-center py-10">
          <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No courts found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new court.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {courts.map((court) => (
          <CourtCard
            key={court.id_court}
            court={court}
            onDelete={handleDeleteCourt}
            isDeleting={deletingCourtId === court.id_court}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Court Management</h1>
          <p className="text-muted-foreground">Add, view, and remove tennis courts.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Court
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Court</DialogTitle>
              <DialogDescription>
                Enter the name for the new court.
              </DialogDescription>
            </DialogHeader>
            <CourtCreationForm
              onSubmit={handleCreateFormSubmit}
              isLoading={createCourtMutation.isLoading}
              formId="court-create-dialog-form"
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createCourtMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="court-create-dialog-form" // Link to the form
                disabled={createCourtMutation.isLoading}
              >
                {createCourtMutation.isLoading ? 'Creating...' : 'Create Court'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {renderCourtList()}
    </div>
  );
}
