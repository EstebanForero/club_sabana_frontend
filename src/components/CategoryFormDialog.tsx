import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Category,
  CategoryCreation,
  createCategory,
  updateCategory,
} from '@/backend/category_backend';

const categoryFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }).max(50, { message: 'Name cannot exceed 50 characters.' }),
  min_age: z.coerce.number().int().nonnegative({ message: 'Minimum age must be 0 or greater.' }), // coerce handles string input
  max_age: z.coerce.number().int().positive({ message: 'Maximum age must be greater than 0.' }),
}).refine(data => data.max_age >= data.min_age, {
  message: "Maximum age must be greater than or equal to minimum age.",
  path: ["max_age"],
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categoryToEdit?: Category | null;
  onSuccess?: () => void;
};

const CategoryFormDialog = ({ isOpen, onOpenChange, categoryToEdit, onSuccess }: Props) => {
  const queryClient = useQueryClient();
  const isEditing = !!categoryToEdit;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      min_age: 0,
      max_age: 18,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing && categoryToEdit) {
        form.reset({
          name: categoryToEdit.name,
          min_age: categoryToEdit.min_age,
          max_age: categoryToEdit.max_age,
        });
      } else {
        form.reset({
          name: '',
          min_age: 0,
          max_age: 18,
        });
      }
    }
  }, [isOpen, categoryToEdit, isEditing, form]);

  const creationMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Category created successfully!');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Error creating category:", error);
      toast.error(`Failed to create category: ${error.message || 'Unknown error'}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: (updatedCategory) => {
      toast.success(`Category "${updatedCategory.name}" updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Error updating category:", error);
      toast.error(`Failed to update category: ${error.message || 'Unknown error'}`);
    },
  });

  const mutation = isEditing ? updateMutation : creationMutation;

  function onSubmit(values: CategoryFormData) {
    console.log("Submitting category form:", values);
    if (isEditing && categoryToEdit) {
      const categoryData: Category = {
        ...categoryToEdit,
        name: values.name,
        min_age: values.min_age,
        max_age: values.max_age,
      };
      updateMutation.mutate(categoryData);
    } else {
      const categoryData: CategoryCreation = {
        name: values.name,
        min_age: values.min_age,
        max_age: values.max_age,
      };
      creationMutation.mutate(categoryData);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this category.' : 'Fill in the details to add a new category.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="col-span-3" placeholder="e.g., Junior Division" />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="min_age"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Min Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="col-span-3" placeholder="e.g., 8" />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_age"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Max Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="col-span-3" placeholder="e.g., 12" />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3 text-sm" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading
                  ? (isEditing ? 'Saving...' : 'Creating...')
                  : (isEditing ? 'Save Changes' : 'Create Category')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
