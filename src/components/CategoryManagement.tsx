// src/components/categories/CategoryManagement.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listCategories, Category } from '@/backend/category_backend'; // Adjust path
import { Uuid } from '@/backend/common';
import CategoryComponent from './CategoryComponent'; // Adjust path
import CategoryFormDialog from './CategoryFormDialog'; // Adjust path
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, PlusCircle } from "lucide-react";
import CategoryRequirementsDialog from './CategoryRequirementDialog';

const CategoryManagement = () => {
  // State for Create/Edit Dialog
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // *** State for Requirements Dialog ***
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);
  const [viewingRequirementsFor, setViewingRequirementsFor] = useState<{ id: Uuid; name: string } | null>(null);

  // Query for categories list
  const { data: categories, isLoading, isError, error } = useQuery({
    queryFn: listCategories,
    queryKey: ['categories'],
  });

  // --- Handlers for Dialogs ---
  const handleOpenCreateDialog = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEditDialog = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  // *** Handler to open the requirements dialog ***
  const handleOpenRequirementsDialog = (categoryId: Uuid, categoryName: string) => {
    setViewingRequirementsFor({ id: categoryId, name: categoryName });
    setIsRequirementsOpen(true);
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Button onClick={handleOpenCreateDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[150px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Alert variant="destructive" className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Categories</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'An unknown error occurred.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !isError && categories && categories.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No categories found. Click "Add New Category" to create one.</p>
      )}

      {/* Categories List */}
      {!isLoading && !isError && categories && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map(category => (
            <CategoryComponent
              key={category.id_category}
              category={category}
              onEdit={handleOpenEditDialog}
              // *** Pass the requirements handler ***
              onViewRequirements={handleOpenRequirementsDialog}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <CategoryFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        categoryToEdit={editingCategory}
      />

      {/* *** Requirements Dialog *** */}
      {viewingRequirementsFor && ( // Render only when needed
        <CategoryRequirementsDialog
          isOpen={isRequirementsOpen}
          onOpenChange={setIsRequirementsOpen}
          categoryId={viewingRequirementsFor.id}
          categoryName={viewingRequirementsFor.name}
        />
      )}

    </div>
  );
};

export default CategoryManagement;
