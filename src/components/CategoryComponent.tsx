import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Trash2, ListChecks } from 'lucide-react';

import { Category, deleteCategory } from '@/backend/category_backend';
import { Uuid } from '@/backend/common';
import { Button } from '@/components/ui/button';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';


type Props = {
  category: Category;
  onEdit: (category: Category) => void;
  onViewRequirements: (categoryId: Uuid, categoryName: string) => void;
};

const CategoryComponent = ({ category, onEdit, onViewRequirements }: Props) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (message) => {
      toast.success(message || `Category "${category.name}" deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: Error) => {
      console.error("Error deleting category:", error);
      toast.error(`Failed to delete category: ${error.message || 'Unknown error'}`);
    },
  });


  const handleDelete = () => {
    deleteMutation.mutate(category.id_category);
  };

  const handleEdit = () => {
    onEdit(category);
  };

  const handleViewRequirements = () => {
    onViewRequirements(category.id_category, category.name);
  }

  return (
    <Card className="w-full shadow-md flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-400">
          <p>Age Range: {category.min_age} - {category.max_age} years</p>
        </CardContent>
      </div>
      <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-4 flex-wrap">
        <Button variant="outline" size="sm" onClick={handleViewRequirements} className="w-full">
          <ListChecks className="mr-2 h-4 w-4" /> Requirements
        </Button>

        <Button variant="outline" size="sm" onClick={handleEdit} className='grow'>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={deleteMutation.isLoading}>
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                category "{category.name}" and potentially related data (like requirements or tournament associations).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, delete it
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default CategoryComponent;
