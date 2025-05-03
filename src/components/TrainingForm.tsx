// src/components/trainings/TrainingForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Training, TrainingCreation } from '@/backend/training_backend';
import CategorySelector from './CategorySelector';

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const trainingFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  id_category: z.string().uuid({ message: 'Please select a valid category.' }),
  start_datetime: z.string().regex(datetimeRegex, { message: 'Start datetime: YYYY-MM-DD HH:MM:SS' }),
  end_datetime: z.string().regex(datetimeRegex, { message: 'End datetime: YYYY-MM-DD HH:MM:SS' }),
  minimum_payment: z.preprocess( // Handle potential string input from number field
    (val) => (typeof val === 'string' && val.trim() !== '') ? parseFloat(val) : val,
    z.number().positive({ message: 'Minimum payment must be a positive number.' }).optional().or(z.literal(0)) // Allow 0 or positive
  ),
});

export type TrainingFormData = z.infer<typeof trainingFormSchema>;

interface TrainingFormProps {
  mode: 'create' | 'edit';
  initialData?: Training;
  onSubmit: (data: TrainingFormData) => void; // Pass the specific form data type
  isLoading: boolean;
  onCancel: () => void; // Keep onCancel if needed within dialogs
}

const TrainingForm: React.FC<TrainingFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isLoading,
}) => {
  const form = useForm<TrainingFormData>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      id_category: initialData?.id_category || undefined,
      start_datetime: initialData?.start_datetime || '',
      end_datetime: initialData?.end_datetime || '',
      minimum_payment: initialData?.minimum_payment ?? 0, // Default to 0 if not provided
    },
  });

  // Reset form if initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        id_category: initialData.id_category,
        start_datetime: initialData.start_datetime,
        end_datetime: initialData.end_datetime,
        minimum_payment: initialData.minimum_payment ?? 0,
      });
    } else {
      form.reset({
        name: '', id_category: undefined, start_datetime: '', end_datetime: '', minimum_payment: 0
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: TrainingFormData) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form id={`training-form-${mode}`} onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
        {/* Name Field */}
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-center gap-4">
            <FormLabel className="text-right">Name</FormLabel>
            <FormControl><Input {...field} className="col-span-3" placeholder="e.g., Sunday Kata Session" disabled={isLoading} /></FormControl>
            <FormMessage className="col-start-2 col-span-3 text-sm" />
          </FormItem>
        )} />

        {/* Category Selector */}
        <FormField control={form.control} name="id_category" render={({ field, fieldState }) => (
          <FormItem className="grid grid-cols-4 items-center gap-4">
            <FormLabel className="text-right">Category</FormLabel>
            <FormControl className="col-span-3">
              <CategorySelector
                value={field.value}
                onChange={field.onChange}
                placeholder="Select training category..."
                disabled={isLoading}
                className={fieldState.error ? 'border-destructive' : ''}
              />
            </FormControl>
            <FormMessage className="col-start-2 col-span-3 text-sm" />
          </FormItem>
        )} />

        {/* Start DateTime */}
        <FormField control={form.control} name="start_datetime" render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-center gap-4">
            <FormLabel className="text-right">Start Time</FormLabel>
            <FormControl><Input {...field} className="col-span-3" placeholder="YYYY-MM-DD HH:MM:SS" disabled={isLoading} /></FormControl>
            <FormMessage className="col-start-2 col-span-3 text-sm" />
          </FormItem>
        )} />

        {/* End DateTime */}
        <FormField control={form.control} name="end_datetime" render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-center gap-4">
            <FormLabel className="text-right">End Time</FormLabel>
            <FormControl><Input {...field} className="col-span-3" placeholder="YYYY-MM-DD HH:MM:SS" disabled={isLoading} /></FormControl>
            <FormMessage className="col-start-2 col-span-3 text-sm" />
          </FormItem>
        )} />

        {/* Minimum Payment */}
        <FormField control={form.control} name="minimum_payment" render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-center gap-4">
            <FormLabel className="text-right">Min. Payment ($)</FormLabel>
            <FormControl><Input {...field} type="number" step="0.01" min="0" className="col-span-3" placeholder="e.g., 10.00" disabled={isLoading} /></FormControl>
            <FormMessage className="col-start-2 col-span-3 text-sm" />
          </FormItem>
        )} />
      </form>
    </Form>
  );
};

export default TrainingForm;
