import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from './ui/input';
import { Button } from './ui/button';

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'date' | 'select';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface ReusableFormProps<T extends z.ZodType<any, any>> {
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (values: z.infer<T>) => Promise<void>;
  fields: FormFieldConfig[];
  submitButtonText?: string;
}

const ReusableForm = <T extends z.ZodType<any, any>>({
  schema,
  defaultValues,
  onSubmit,
  fields,
  submitButtonText = 'Submit',
}: ReusableFormProps<T>) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
        )}
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.type === 'select' ? (
                    <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={field.type || 'text'}
                      placeholder={field.placeholder || field.label}
                      {...formField}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full cursor-pointer">
          {form.formState.isSubmitting ? 'Processing...' : submitButtonText}
        </Button>
      </form>
    </Form>
  );
};

export default ReusableForm;
