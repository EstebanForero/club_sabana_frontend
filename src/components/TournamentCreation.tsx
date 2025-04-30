// src/components/tournaments/TournamentCreation.tsx (or similar path)
import React from 'react';
import { useForm, Controller } from 'react-hook-form'; // Import Controller
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField, // Keep FormField for structure
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createTournament, TournamentCreation as TournamentCreationData } from '@/backend/tournament_backend'; // Adjust path
import { Uuid } from '@/backend/common'; // Import Uuid type
import CategorySelector from './CategorySelector';

// Validation Schema - update id_category validation
const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/; // Basic UUID check

// Update schema: Use refine for non-empty UUID string from selector
const tournamentCreationSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
  // id_category should be a non-empty string (UUID) selected from the component
  id_category: z.string().uuid({ message: 'Please select a valid category.' }),
  start_datetime: z.string().regex(datetimeRegex, { message: 'Start datetime must be in YYYY-MM-DD HH:MM:SS format.' }),
  end_datetime: z.string().regex(datetimeRegex, { message: 'End datetime must be in YYYY-MM-DD HH:MM:SS format.' }),
});

type TournamentFormData = z.infer<typeof tournamentCreationSchema>;

const TournamentCreation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentCreationSchema),
    // Default id_category to undefined or null for the selector
    defaultValues: {
      name: '',
      id_category: undefined,
      start_datetime: '',
      end_datetime: '',
    },
  });

  const mutation = useMutation({
    mutationFn: createTournament,
    onSuccess: () => {
      toast.success('Tournament created successfully!');
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      form.reset();
      setIsOpen(false);
    },
    onError: (error: Error) => {
      console.error("Error creating tournament:", error);
      toast.error(`Failed to create tournament: ${error.message || 'Unknown error'}`);
    },
  });

  function onSubmit(values: TournamentFormData) {
    console.log("Submitting Tournament:", values);
    // Type assertion might be needed if default is undefined but schema requires string
    const tournamentData: TournamentCreationData = {
      ...values,
      id_category: values.id_category as Uuid, // Ensure it's Uuid type
    };
    mutation.mutate(tournamentData);
  }

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className='hover:bg-muted'> {/* Subtle hover */}
          Create New Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Tournament</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new tournament.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Name Field (unchanged) */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="col-span-3" placeholder="e.g., Summer Championship" />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3 text-sm" />
                </FormItem>
              )}
            />

            {/* *** Category Selector Field *** */}
            <FormField
              control={form.control}
              name="id_category"
              render={({ field, fieldState }) => ( // Get fieldState for errors
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Category</FormLabel>
                  <FormControl className="col-span-3">
                    {/* Use Controller to wrap CategorySelector */}
                    <CategorySelector
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select tournament category..."
                      disabled={mutation.isLoading}
                      className={fieldState.error ? 'border-destructive' : ''} // Highlight on error
                    />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3 text-sm" />
                </FormItem>
              )}
            />

            {/* Start DateTime (unchanged) */}
            <FormField
              control={form.control}
              name="start_datetime"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Start Time</FormLabel>
                  <FormControl>
                    <Input {...field} className="col-span-3" placeholder="YYYY-MM-DD HH:MM:SS" />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3 text-sm" />
                </FormItem>
              )}
            />

            {/* End DateTime (unchanged) */}
            <FormField
              control={form.control}
              name="end_datetime"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">End Time</FormLabel>
                  <FormControl>
                    <Input {...field} className="col-span-3" placeholder="YYYY-MM-DD HH:MM:SS" />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3 text-sm" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={mutation.isLoading}> {/* Corrected: use isPending */}
                {mutation.isLoading ? 'Creating...' : 'Create Tournament'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentCreation;
