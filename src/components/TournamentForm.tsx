// src/components/tournaments/TournamentForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Keep Label if needed directly, otherwise FormLabel is better
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Tournament, TournamentCreation } from '@/backend/tournament_backend'; // Adjust path
import { Uuid } from '@/backend/common'; // Import Uuid type
import CategorySelector from './CategorySelector'; // Assuming this exists and works

// Validation Schema (remains the same)
const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const tournamentFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
  id_category: z.string().uuid({ message: 'Please select a valid category.' }),
  start_datetime: z.string().regex(datetimeRegex, { message: 'Start datetime must be in YYYY-MM-DD HH:MM:SS format.' }),
  end_datetime: z.string().regex(datetimeRegex, { message: 'End datetime must be in YYYY-MM-DD HH:MM:SS format.' }),
});

export type TournamentFormData = z.infer<typeof tournamentFormSchema>;

interface TournamentFormProps {
  mode: 'create' | 'edit';
  // Provide existing tournament data for editing
  initialData?: Tournament;
  // Function to handle form submission (will call create or update API)
  onSubmit: (data: TournamentFormData) => void;
  // Indicate if the form submission is in progress
  isLoading: boolean;
  // Function to call when cancelling
  onCancel: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
}

const TournamentForm: React.FC<TournamentFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  submitButtonText,
  cancelButtonText,
}) => {
  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      id_category: initialData?.id_category || undefined, // Set to undefined if no initial category
      start_datetime: initialData?.start_datetime || '',
      end_datetime: initialData?.end_datetime || '',
    },
  });

  // Reset form if initialData changes (important for edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        id_category: initialData.id_category,
        start_datetime: initialData.start_datetime,
        end_datetime: initialData.end_datetime,
      });
    } else {
      form.reset({
        name: '',
        id_category: undefined,
        start_datetime: '',
        end_datetime: '',
      });
    }
  }, [initialData, form]); // Add form to dependency array

  const handleSubmit = (values: TournamentFormData) => {
    onSubmit(values);
  };

  const defaultSubmitText = mode === 'create' ? 'Create Tournament' : 'Save Changes';
  const loadingSubmitText = mode === 'create' ? 'Creating...' : 'Updating...';

  return (
    <Form {...form}>
      <form id={`tournament-form-${mode}`} onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="col-span-3"
                  placeholder="e.g., Summer Championship"
                  disabled={isLoading}
                />
              </FormControl>
              {/* Ensure message appears correctly */}
              <FormMessage className="col-start-2 col-span-3 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="id_category"
          render={({ field, fieldState }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Category</FormLabel>
              <FormControl className="col-span-3">
                <CategorySelector
                  value={field.value}
                  onChange={field.onChange} // Pass onChange directly
                  placeholder="Select tournament category..."
                  disabled={isLoading}
                  className={fieldState.error ? 'border-destructive' : ''}
                />
              </FormControl>
              <FormMessage className="col-start-2 col-span-3 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_datetime"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Start Time</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="col-span-3"
                  placeholder="YYYY-MM-DD HH:MM:SS"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="col-start-2 col-span-3 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_datetime"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">End Time</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="col-span-3"
                  placeholder="YYYY-MM-DD HH:MM:SS"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="col-start-2 col-span-3 text-sm" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default TournamentForm;
