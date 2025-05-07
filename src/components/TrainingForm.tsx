import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Training } from '@/backend/training_backend';
import { Uuid } from '@/backend/common';
import CategorySelector from './CategorySelector';
import TrainerSelector from './TrainerSelector';
import CourtSelector from './CourtSelector';

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const trainingFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  id_category: z.string().uuid({ message: 'Please select a valid category.' }),
  trainer_id: z.string().uuid({ message: 'Please select a trainer.' }),
  id_court: z.string().uuid({ message: 'Please select a court.' }),
  start_datetime: z.string().regex(datetimeRegex, { message: 'Start datetime: YYYY-MM-DD HH:MM:SS' }),
  end_datetime: z.string().regex(datetimeRegex, { message: 'End datetime: YYYY-MM-DD HH:MM:SS' }),
  minimum_payment: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const trimmed = val.trim();
        return trimmed === '' ? undefined : parseFloat(trimmed);
      }
      return val;
    },
    z.number().positive({ message: 'Minimum payment must be a positive number.' }).optional().nullable()
  ),
});

export type TrainingFormData = z.infer<typeof trainingFormSchema>;

interface TrainingFormProps {
  mode: 'create' | 'edit';
  initialData?: Training & { trainer_id?: Uuid; id_court?: Uuid };
  onSubmit: (data: TrainingFormData) => void;
  isLoading: boolean;
  onCancel?: () => void;
  formId?: string;
}

const TrainingForm: React.FC<TrainingFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isLoading,
  formId = `training-form-${mode}`,
}) => {
  const form = useForm<TrainingFormData>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      id_category: initialData?.id_category || undefined,
      trainer_id: initialData?.trainer_id || undefined,
      id_court: initialData?.id_court || undefined,
      start_datetime: initialData?.start_datetime || '',
      end_datetime: initialData?.end_datetime || '',
      minimum_payment: initialData?.minimum_payment === 0 ? 0 : initialData?.minimum_payment || null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        id_category: initialData.id_category,
        trainer_id: initialData.trainer_id || undefined,
        id_court: initialData.id_court || undefined,
        start_datetime: initialData.start_datetime,
        end_datetime: initialData.end_datetime,
        minimum_payment: initialData.minimum_payment === 0 ? 0 : initialData.minimum_payment || null,
      });
    } else {
      form.reset({
        name: '',
        id_category: undefined,
        trainer_id: undefined,
        id_court: undefined,
        start_datetime: '',
        end_datetime: '',
        minimum_payment: null,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: TrainingFormData) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Name</FormLabel>
            <FormControl><Input {...field} placeholder="e.g., Advanced Sparring" disabled={isLoading} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="id_category" render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <CategorySelector
                value={field.value}
                onChange={field.onChange}
                placeholder="Select training category..."
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="trainer_id" render={({ field, fieldState }) => (
          <FormItem className='col-span-2'>
            <FormLabel>Trainer</FormLabel>
            <FormControl>
              <TrainerSelector
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a trainer..."
                disabled={isLoading}
                error={!!fieldState.error}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="id_court" render={({ field, fieldState }) => (
          <FormItem>
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
        )} />


        <FormField control={form.control} name="start_datetime" render={({ field }) => (
          <FormItem>
            <FormLabel>Start Time</FormLabel>
            <FormControl><Input {...field} placeholder="YYYY-MM-DD HH:MM:SS" disabled={isLoading} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="end_datetime" render={({ field }) => (
          <FormItem>
            <FormLabel>End Time</FormLabel>
            <FormControl><Input {...field} placeholder="YYYY-MM-DD HH:MM:SS" disabled={isLoading} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="minimum_payment" render={({ field }) => (
          <FormItem>
            <FormLabel>Min. Payment ($)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value === null ? '' : field.value}
                onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                type="number" step="0.01" min="0"
                placeholder="e.g., 10.00 (optional)"
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </form>
    </Form>
  );
};

export default TrainingForm;
