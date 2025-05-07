import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Tournament, TournamentCreationPayload, TournamentUpdatePayload } from '@/backend/tournament_backend';
import { Uuid } from '@/backend/common';
import CategorySelector from './CategorySelector';
import CourtSelector from './CourtSelector';

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const tournamentFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
  id_category: z.string().uuid({ message: 'Please select a valid category.' }),
  id_court: z.string().uuid({ message: 'Please select a valid court.' }),
  start_datetime: z.string().regex(datetimeRegex, { message: 'Start datetime must be in YYYY-MM-DD HH:MM:SS format.' }),
  end_datetime: z.string().regex(datetimeRegex, { message: 'End datetime must be in YYYY-MM-DD HH:MM:SS format.' }),
});

export type TournamentFormData = z.infer<typeof tournamentFormSchema>;

interface TournamentFormProps {
  mode: 'create' | 'edit';
  initialData?: Tournament & { id_court?: Uuid };
  onSubmit: (data: TournamentFormData) => void;
  isLoading: boolean;
  onCancel?: () => void;
  formId?: string;
}

const TournamentForm: React.FC<TournamentFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  formId = `tournament-form-${mode}`,
}) => {
  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      id_category: initialData?.id_category || undefined,
      id_court: initialData?.id_court || undefined,
      start_datetime: initialData?.start_datetime || '',
      end_datetime: initialData?.end_datetime || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        id_category: initialData.id_category,
        id_court: initialData.id_court || undefined,
        start_datetime: initialData.start_datetime,
        end_datetime: initialData.end_datetime,
      });
    } else {
      form.reset({
        name: '',
        id_category: undefined,
        id_court: undefined,
        start_datetime: '',
        end_datetime: '',
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: TournamentFormData) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Summer Championship" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id_category"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategorySelector
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select tournament category..."
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id_court"
          render={({ field, fieldState }) => (
            <FormItem className='md:col-span-2'>
              <FormLabel>Court</FormLabel>
              <FormControl>
                <CourtSelector
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a court..."
                  disabled={isLoading}
                  error={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_datetime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input {...field} placeholder="YYYY-MM-DD HH:MM:SS" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_datetime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input {...field} placeholder="YYYY-MM-DD HH:MM:SS" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default TournamentForm;
