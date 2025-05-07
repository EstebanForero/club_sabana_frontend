// src/components/admin/courts/CourtCreationForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CourtCreation } from '@/backend/court_backend'; // Adjust path

const courtCreationSchema = z.object({
  court_name: z.string().min(1, { message: "Court name is required." }).max(100, { message: "Court name is too long." }),
});

export type CourtCreationFormData = z.infer<typeof courtCreationSchema>;

interface CourtCreationFormProps {
  onSubmit: (data: CourtCreationFormData) => void;
  isLoading: boolean;
  formId?: string;
}

const CourtCreationForm: React.FC<CourtCreationFormProps> = ({
  onSubmit,
  isLoading,
  formId = "court-creation-form",
}) => {
  const form = useForm<CourtCreationFormData>({
    resolver: zodResolver(courtCreationSchema),
    defaultValues: {
      court_name: '',
    },
  });

  const handleFormSubmit = (values: CourtCreationFormData) => {
    onSubmit(values);
    // Optionally reset form here if not handled by parent dialog closing
    // form.reset();
  };

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="court_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Court Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Court A, Center Court" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* The submit button is typically placed by the component using this form,
                    e.g., in a DialogFooter, linked by the formId.
                    If it were here, it would look like:
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Creating...' : 'Create Court'}
                </Button>
                */}
      </form>
    </Form>
  );
};

export default CourtCreationForm;
